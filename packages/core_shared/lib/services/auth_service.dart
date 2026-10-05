import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../models/user_model.dart';

final authServiceProvider = Provider<AuthService>((ref) => AuthService());

final authStateChangesProvider = StreamProvider<User?>((ref) {
  return ref.watch(authServiceProvider).authStateChanges;
});

final currentUserProfileProvider = StreamProvider<UserModel?>((ref) {
  final authUser = ref.watch(authStateChangesProvider).value;
  if (authUser == null) return Stream.value(null);
  return ref.watch(authServiceProvider).userProfileStream(authUser.uid);
});

class StaffAuthException implements Exception {
  final String message;
  const StaffAuthException(this.message);

  @override
  String toString() => message;
}

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn(scopes: ['email', 'profile']);

  Stream<User?> get authStateChanges => _auth.authStateChanges();
  User? get currentUser => _auth.currentUser;

  Stream<UserModel?> userProfileStream(String uid) {
    return _firestore.collection('users').doc(uid).snapshots().map((doc) {
      if (!doc.exists) return null;
      return UserModel.fromFirestore(doc);
    });
  }

  // -------------------------------------------------------------
  // 1. STRICT PRE-VERIFIED CHECK (Firestore: `verified_staff`)
  // -------------------------------------------------------------
  Future<VerifiedStaffModel?> checkPreVerifiedStaff({
    String? email,
    String? phone,
  }) async {
    // 1. Check by email if provided
    if (email != null && email.trim().isNotEmpty) {
      final normalizedEmail = email.trim().toLowerCase();
      final query = await _firestore
          .collection('verified_staff')
          .where('email', isEqualTo: normalizedEmail)
          .where('isActive', isEqualTo: true)
          .limit(1)
          .get();

      if (query.docs.isNotEmpty) {
        return VerifiedStaffModel.fromFirestore(query.docs.first);
      }
    }

    // 2. Check by phone number if provided (handles with/without +91)
    if (phone != null && phone.trim().isNotEmpty) {
      final cleanPhone = phone.trim().replaceAll(RegExp(r'[\s-]'), '');
      
      // Try exact phone
      var query = await _firestore
          .collection('verified_staff')
          .where('phone', isEqualTo: cleanPhone)
          .where('isActive', isEqualTo: true)
          .limit(1)
          .get();

      if (query.docs.isNotEmpty) {
        return VerifiedStaffModel.fromFirestore(query.docs.first);
      }

      // Try with/without country code +91
      final phoneWithoutCountry = cleanPhone.startsWith('+91')
          ? cleanPhone.substring(3)
          : cleanPhone;
      final phoneWithCountry = cleanPhone.startsWith('+91')
          ? cleanPhone
          : '+91$cleanPhone';

      query = await _firestore
          .collection('verified_staff')
          .where('phone', whereIn: [phoneWithoutCountry, phoneWithCountry])
          .where('isActive', isEqualTo: true)
          .limit(1)
          .get();

      if (query.docs.isNotEmpty) {
        return VerifiedStaffModel.fromFirestore(query.docs.first);
      }
    }

    return null;
  }

  // -------------------------------------------------------------
  // 2. GOOGLE SIGN IN
  // -------------------------------------------------------------
  Future<UserCredential> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        throw const StaffAuthException('Google Sign-In was cancelled.');
      }

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      return await _auth.signInWithCredential(credential);
    } catch (e) {
      if (e is StaffAuthException) rethrow;
      throw StaffAuthException('Google authentication failed: ${e.toString()}');
    }
  }

  // -------------------------------------------------------------
  // 3. PHONE AUTH (OTP)
  // -------------------------------------------------------------
  Future<void> sendPhoneOtp({
    required String phoneNumber,
    required void Function(String verificationId, int? resendToken) onCodeSent,
    required void Function(FirebaseAuthException e) onVerificationFailed,
    required void Function(PhoneAuthCredential credential) onAutoVerified,
    void Function(String verificationId)? onCodeAutoRetrievalTimeout,
  }) async {
    String formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91$formattedPhone';
    }

    await _auth.verifyPhoneNumber(
      phoneNumber: formattedPhone,
      verificationCompleted: onAutoVerified,
      verificationFailed: onVerificationFailed,
      codeSent: onCodeSent,
      codeAutoRetrievalTimeout: onCodeAutoRetrievalTimeout ?? (_) {},
      timeout: const Duration(seconds: 60),
    );
  }

  Future<UserCredential> verifyOtpAndSignIn({
    required String verificationId,
    required String smsCode,
  }) async {
    final credential = PhoneAuthProvider.credential(
      verificationId: verificationId,
      smsCode: smsCode,
    );
    return await _auth.signInWithCredential(credential);
  }

  // -------------------------------------------------------------
  // 4. PRE-VERIFICATION ENFORCEMENT & INSTANT LOGOUT
  // -------------------------------------------------------------
  Future<VerifiedStaffModel> verifyAndAuthorizeStaff({
    required User user,
    required StaffRole requestedRole,
  }) async {
    final staffRecord = await checkPreVerifiedStaff(
      email: user.email,
      phone: user.phoneNumber,
    );

    // Condition 1: Must be in pre-verified database
    if (staffRecord == null) {
      await _auth.signOut();
      await _googleSignIn.signOut();
      throw const StaffAuthException(
        'Access Denied: You are not verified by the Admin. Open registration is prohibited for school staff.',
      );
    }

    // Condition 2: Assigned role in Firestore MUST match the login button clicked
    if (staffRecord.role != requestedRole) {
      await _auth.signOut();
      await _googleSignIn.signOut();
      throw StaffAuthException(
        'Access Denied: You are not authorized for this role.\nYour assigned role is "${staffRecord.role.displayName}", but you selected "${requestedRole.displayName}".',
      );
    }

    // Condition 3: Must be active
    if (!staffRecord.isActive) {
      await _auth.signOut();
      await _googleSignIn.signOut();
      throw const StaffAuthException(
        'Access Revoked: Your staff account has been deactivated by the Administration.',
      );
    }

    // Sync / Upsert into `users` collection with verified status
    final mappedUserRole = _mapStaffRoleToUserRole(staffRecord.role);
    await _firestore.collection('users').doc(user.uid).set({
      'name': staffRecord.name.isNotEmpty ? staffRecord.name : (user.displayName ?? 'Staff'),
      'email': staffRecord.email.isNotEmpty ? staffRecord.email : (user.email ?? ''),
      'phone': staffRecord.phone.isNotEmpty ? staffRecord.phone : (user.phoneNumber ?? ''),
      'role': mappedUserRole.name,
      'staffRole': staffRecord.role.name,
      'schoolId': staffRecord.schoolId,
      'status': 'approved',
      'teacherDetails': {
        'assignedClass': staffRecord.assignedClass,
        'designation': staffRecord.role.displayName,
        'employeeId': staffRecord.id,
      },
      'lastLoginAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));

    return staffRecord;
  }

  UserRole _mapStaffRoleToUserRole(StaffRole role) {
    switch (role) {
      case StaffRole.admin:
        return UserRole.manager;
      case StaffRole.principal:
        return UserRole.principal;
      case StaffRole.classTeacher:
      case StaffRole.generalTeacher:
        return UserRole.teacher;
    }
  }

  // -------------------------------------------------------------
  // 5. ADMIN STAFF ACCESS MANAGEMENT (Superpowers)
  // -------------------------------------------------------------
  Stream<List<VerifiedStaffModel>> getVerifiedStaffStream({String schoolId = 'vidyasetu_main'}) {
    return _firestore
        .collection('verified_staff')
        .where('schoolId', isEqualTo: schoolId)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((d) => VerifiedStaffModel.fromFirestore(d)).toList());
  }

  Future<void> addVerifiedStaff(VerifiedStaffModel staff) async {
    final docRef = _firestore.collection('verified_staff').doc();
    await docRef.set({
      'name': staff.name,
      'email': staff.email.toLowerCase().trim(),
      'phone': staff.phone.trim(),
      'role': staff.role.name,
      'assignedClass': staff.assignedClass,
      'schoolId': staff.schoolId,
      'isActive': true,
      'addedBy': staff.addedBy,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  Future<void> toggleStaffStatus(String docId, bool currentStatus) async {
    await _firestore.collection('verified_staff').doc(docId).update({
      'isActive': !currentStatus,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  Future<void> deleteVerifiedStaff(String docId) async {
    await _firestore.collection('verified_staff').doc(docId).delete();
  }

  // -------------------------------------------------------------
  // 6. STUDENT / PARENT AUTHENTICATION (Google & Phone OTP)
  // -------------------------------------------------------------
  Future<bool> signInOrRegisterStudentWithGoogle({
    required String grade,
    required String parentPhone,
  }) async {
    final cred = await signInWithGoogle();
    final user = cred.user!;
    final userDoc = await _firestore.collection('users').doc(user.uid).get();

    // If user already exists and is approved, return true
    if (userDoc.exists) {
      final data = userDoc.data() ?? {};
      if (data['isApproved'] == true || data['status'] == 'approved') {
        return true;
      }
    }

    // Otherwise, register/update into `pending_students` and `users`
    final now = DateTime.now();
    final studentData = {
      'uid': user.uid,
      'name': user.displayName?.isNotEmpty == true ? user.displayName! : 'Student',
      'email': user.email ?? '',
      'phone': parentPhone.isNotEmpty ? parentPhone : (user.phoneNumber ?? ''),
      'grade': grade,
      'parentName': user.displayName ?? 'Parent',
      'parentPhone': parentPhone,
      'isApproved': false,
      'status': 'pending',
      'schoolId': 'vidyasetu_main',
      'role': 'student',
      'createdAt': FieldValue.serverTimestamp(),
    };

    // Save to pending_students collection
    await _firestore.collection('pending_students').doc(user.uid).set(studentData, SetOptions(merge: true));

    // Save to users collection with isApproved: false
    await _firestore.collection('users').doc(user.uid).set({
      ...studentData,
      'studentDetails': {
        'grade': grade,
        'parentPhone': parentPhone,
        'parentName': user.displayName ?? 'Parent',
        'admissionNumber': 'PENDING_APPROVAL',
        'rollNumber': '',
      },
    }, SetOptions(merge: true));

    return false; // Still pending approval
  }

  Future<bool> signInOrRegisterStudentWithPhone({
    required String verificationId,
    required String smsCode,
    required String studentName,
    required String grade,
  }) async {
    final cred = await verifyOtpAndSignIn(
      verificationId: verificationId,
      smsCode: smsCode,
    );
    final user = cred.user!;
    final userDoc = await _firestore.collection('users').doc(user.uid).get();

    if (userDoc.exists) {
      final data = userDoc.data() ?? {};
      if (data['isApproved'] == true || data['status'] == 'approved') {
        return true;
      }
    }

    final studentData = {
      'uid': user.uid,
      'name': studentName.isNotEmpty ? studentName : 'Student',
      'email': user.email ?? '',
      'phone': user.phoneNumber ?? '',
      'grade': grade,
      'parentName': studentName,
      'parentPhone': user.phoneNumber ?? '',
      'isApproved': false,
      'status': 'pending',
      'schoolId': 'vidyasetu_main',
      'role': 'student',
      'createdAt': FieldValue.serverTimestamp(),
    };

    await _firestore.collection('pending_students').doc(user.uid).set(studentData, SetOptions(merge: true));
    await _firestore.collection('users').doc(user.uid).set({
      ...studentData,
      'studentDetails': {
        'grade': grade,
        'parentPhone': user.phoneNumber ?? '',
        'parentName': studentName,
        'admissionNumber': 'PENDING_APPROVAL',
        'rollNumber': '',
      },
    }, SetOptions(merge: true));

    return false;
  }

  // Real-time approval listener for the Waiting Room Screen
  Stream<DocumentSnapshot> studentApprovalStream(String uid) {
    return _firestore.collection('users').doc(uid).snapshots();
  }

  // -------------------------------------------------------------
  // 7. CLASS TEACHER APPROVAL ACTIONS (Management App Side)
  // -------------------------------------------------------------
  Stream<List<PendingStudentModel>> getPendingStudentsStream() {
    return _firestore
        .collection('pending_students')
        .where('isApproved', isEqualTo: false)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((d) => PendingStudentModel.fromFirestore(d)).toList());
  }

  Future<void> approveStudentByTeacher({
    required String studentUid,
    required String rollNumber,
    required String admissionNumber,
    required String grade,
  }) async {
    // 1. Update pending_students
    await _firestore.collection('pending_students').doc(studentUid).update({
      'isApproved': true,
      'status': 'approved',
      'rollNumber': rollNumber,
      'admissionNumber': admissionNumber,
      'approvedAt': FieldValue.serverTimestamp(),
    });

    // 2. Add to active verified_students
    await _firestore.collection('verified_students').doc(studentUid).set({
      'uid': studentUid,
      'rollNumber': rollNumber,
      'admissionNumber': admissionNumber,
      'grade': grade,
      'isApproved': true,
      'verifiedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));

    // 3. Update users document to release waiting room in real time
    await _firestore.collection('users').doc(studentUid).update({
      'isApproved': true,
      'status': 'approved',
      'studentDetails.rollNumber': rollNumber,
      'studentDetails.admissionNumber': admissionNumber,
      'studentDetails.grade': grade,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // -------------------------------------------------------------
  // 8. GENERAL AUTH
  // -------------------------------------------------------------
  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}
