import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
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

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  Stream<UserModel?> userProfileStream(String uid) {
    return _firestore.collection('users').doc(uid).snapshots().map((doc) {
      if (!doc.exists) return null;
      return UserModel.fromFirestore(doc);
    });
  }

  Future<UserModel> registerStudent({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String grade,
    required String parentName,
    required String parentPhone,
    required String schoolId,
  }) async {
    final userCred = await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

    final uid = userCred.user!.uid;

    final newUser = UserModel(
      id: uid,
      name: name,
      email: email,
      phone: phone,
      role: UserRole.student,
      schoolId: schoolId,
      status: ApprovalStatus.pending, // Locked in pending until verified
      studentDetails: StudentDetails(
        studentId: '',
        admissionNumber: 'PENDING_APPROVAL',
        rollNumber: '',
        grade: grade,
        parentName: parentName,
        parentPhone: parentPhone,
      ),
      createdAt: DateTime.now(),
    );

    await _firestore.collection('users').doc(uid).set(newUser.toMap());
    return newUser;
  }

  Future<void> signIn({required String email, required String password}) async {
    await _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}
