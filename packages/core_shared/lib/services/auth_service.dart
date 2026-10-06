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

      // Master Super Admin auto-bootstrap into database if new project
      if (normalizedEmail == 'sarita.abhinav.t9@gmail.com') {
        final query = await _firestore
            .collection('verified_staff')
            .where('email', isEqualTo: normalizedEmail)
            .limit(1)
            .get();

        if (query.isEmpty) {
          final rootDoc = _firestore.collection('verified_staff').doc('root_admin_owner');
          await rootDoc.set({
            'name': 'Abhinav Tiwari (Super Admin)',
            'email': normalizedEmail,
            'phone': '+919670708847',
            'role': 'admin',
            'schoolId': 'vidyasetu_main',
            'isActive': true,
            'addedBy': 'Master Security Root',
            'createdAt': FieldValue.serverTimestamp(),
          });
        }
      }

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
      final pBare = cleanPhone.startsWith('+91') ? cleanPhone.substring(3) : cleanPhone;
      final pFull = cleanPhone.startsWith('+91') ? cleanPhone : '+91$cleanPhone';

      // Master Super Admin Mobile Number (9670708847) auto-bootstrap into database
      if (pBare == '9670708847') {
        final query = await _firestore
            .collection('verified_staff')
            .where('phone', whereIn: [pBare, pFull])
            .limit(1)
            .get();

        if (query.isEmpty) {
          final rootDoc = _firestore.collection('verified_staff').doc('root_admin_owner');
          await rootDoc.set({
            'name': 'Abhinav Tiwari (Super Admin)',
            'email': 'sarita.abhinav.t9@gmail.com',
            'phone': '+919670708847',
            'role': 'admin',
            'schoolId': 'vidyasetu_main',
            'isActive': true,
            'addedBy': 'Master Security Root',
            'createdAt': FieldValue.serverTimestamp(),
          });
        }
      }
      
      // Query exact phone or with/without country code
      final query = await _firestore
          .collection('verified_staff')
          .where('phone', whereIn: [pBare, pFull])
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

  Future<void> updateVerifiedStaff(
    String docId, {
    String? name,
    String? email,
    String? phone,
    StaffRole? role,
    String? assignedClass,
  }) async {
    final Map<String, dynamic> data = {
      'updatedAt': FieldValue.serverTimestamp(),
    };
    if (name != null) data['name'] = name.trim();
    if (email != null) data['email'] = email.toLowerCase().trim();
    if (phone != null) data['phone'] = phone.trim();
    if (role != null) data['role'] = role.name;
    if (assignedClass != null) data['assignedClass'] = assignedClass.trim();

    await _firestore.collection('verified_staff').doc(docId).update(data);
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
  // 6. STUDENT / PARENT AUTH & PENDING APPROVAL WORKFLOW
  // -------------------------------------------------------------
  Future<UserCredential> signInStudentWithGoogle({
    String grade = 'Class 10-A',
    String parentPhone = '',
  }) async {
    final userCred = await signInWithGoogle();
    final user = userCred.user!;
    await registerOrEnsurePendingStudent(
      user: user,
      grade: grade,
      parentPhone: parentPhone,
    );
    return userCred;
  }

  Future<void> registerOrEnsurePendingStudent({
    required User user,
    String grade = 'Class 10-A',
    String studentName = '',
    String parentPhone = '',
  }) async {
    final userDoc = await _firestore.collection('users').doc(user.uid).get();

    // If user already exists and is approved, do not overwrite approval
    if (userDoc.exists) {
      final data = userDoc.data() ?? {};
      if (data['isApproved'] == true || data['status'] == 'approved') {
        return;
      }
    }

    final name = studentName.isNotEmpty
        ? studentName
        : (user.displayName != null && user.displayName!.isNotEmpty
            ? user.displayName!
            : 'Student');
    final phone = parentPhone.isNotEmpty
        ? parentPhone
        : (user.phoneNumber ?? '');
    final email = user.email ?? '';

    final studentData = {
      'id': user.uid,
      'name': name,
      'email': email,
      'phone': phone,
      'role': 'student',
      'schoolId': 'vidyasetu_main',
      'isApproved': false,
      'status': 'pending',
      'studentDetails': {
        'studentId': user.uid,
        'admissionNumber': 'PENDING_APPROVAL',
        'rollNumber': 'PENDING',
        'grade': grade,
        'parentName': name,
        'parentPhone': phone,
      },
      'createdAt': FieldValue.serverTimestamp(),
      'updatedAt': FieldValue.serverTimestamp(),
    };

    // 1. Write to users collection
    await _firestore.collection('users').doc(user.uid).set(studentData, SetOptions(merge: true));

    // 2. Write to pending_students collection for Class Teacher approval queue
    await _firestore.collection('pending_students').doc(user.uid).set(studentData, SetOptions(merge: true));
  }

  Stream<DocumentSnapshot> studentApprovalStream(String uid) {
    return _firestore.collection('users').doc(uid).snapshots();
  }

  Future<void> approveStudentByTeacher({
    required String studentId,
    required String rollNumber,
    required String admissionNumber,
    required String grade,
  }) async {
    final updateData = {
      'status': 'approved',
      'isApproved': true,
      'studentDetails.rollNumber': rollNumber,
      'studentDetails.admissionNumber': admissionNumber,
      'approvedAt': FieldValue.serverTimestamp(),
    };

    // 1. Update in users collection
    await _firestore.collection('users').doc(studentId).update(updateData);

    // 2. Write to verified_students collection
    await _firestore.collection('verified_students').doc(studentId).set({
      'studentId': studentId,
      'rollNumber': rollNumber,
      'admissionNumber': admissionNumber,
      'grade': grade,
      'isApproved': true,
      'approvedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));

    // 3. Mark approved in pending_students collection
    await _firestore.collection('pending_students').doc(studentId).update({
      'status': 'approved',
      'isApproved': true,
    });
  }

  // -------------------------------------------------------------
  // 7. GENERAL AUTH & SIGN OUT
  // -------------------------------------------------------------
  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}
