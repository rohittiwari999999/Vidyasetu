import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole { manager, principal, teacher, student, parent }
enum ApprovalStatus { pending, approved, rejected }

class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final UserRole role;
  final String schoolId;
  final ApprovalStatus status;
  final String? rejectionReason;
  final StudentDetails? studentDetails;
  final TeacherDetails? teacherDetails;
  final List<String> deviceTokens;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    required this.schoolId,
    required this.status,
    this.rejectionReason,
    this.studentDetails,
    this.teacherDetails,
    this.deviceTokens = const [],
    required this.createdAt,
  });

  bool get isApproved => status == ApprovalStatus.approved;
  bool get isPending => status == ApprovalStatus.pending;
  bool get isStaff => role == UserRole.manager || role == UserRole.principal || role == UserRole.teacher;

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = (doc.data() as Map<String, dynamic>?) ?? {};
    return UserModel(
      id: doc.id,
      name: data['name'] ?? '',
      email: data['email'] ?? '',
      phone: data['phone'] ?? '',
      role: UserRole.values.firstWhere(
        (e) => e.name == data['role'],
        orElse: () => UserRole.student,
      ),
      schoolId: data['schoolId'] ?? '',
      status: ApprovalStatus.values.firstWhere(
        (e) => e.name == data['status'],
        orElse: () => ApprovalStatus.pending,
      ),
      rejectionReason: data['rejectionReason'],
      studentDetails: data['studentDetails'] != null
          ? StudentDetails.fromMap(data['studentDetails'])
          : null,
      teacherDetails: data['teacherDetails'] != null
          ? TeacherDetails.fromMap(data['teacherDetails'])
          : null,
      deviceTokens: List<String>.from(data['deviceTokens'] ?? []),
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role.name,
      'schoolId': schoolId,
      'status': status.name,
      'rejectionReason': rejectionReason,
      'studentDetails': studentDetails?.toMap(),
      'teacherDetails': teacherDetails?.toMap(),
      'deviceTokens': deviceTokens,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}

class StudentDetails {
  final String studentId;
  final String admissionNumber; // SRN
  final String rollNumber;
  final String grade; // e.g. "Class 10-A"
  final String parentName;
  final String parentPhone;

  StudentDetails({
    required this.studentId,
    required this.admissionNumber,
    required this.rollNumber,
    required this.grade,
    required this.parentName,
    required this.parentPhone,
  });

  factory StudentDetails.fromMap(Map<String, dynamic> map) {
    return StudentDetails(
      studentId: map['studentId'] ?? '',
      admissionNumber: map['admissionNumber'] ?? 'PENDING_APPROVAL',
      rollNumber: map['rollNumber'] ?? '',
      grade: map['grade'] ?? 'Class 10-A',
      parentName: map['parentName'] ?? '',
      parentPhone: map['parentPhone'] ?? '',
    );
  }

  Map<String, dynamic> toMap() => {
    'studentId': studentId,
    'admissionNumber': admissionNumber,
    'rollNumber': rollNumber,
    'grade': grade,
    'parentName': parentName,
    'parentPhone': parentPhone,
  };
}

class TeacherDetails {
  final String employeeId;
  final String designation;
  final String assignedClass;
  final List<String> subjects;

  TeacherDetails({
    required this.employeeId,
    required this.designation,
    required this.assignedClass,
    required this.subjects,
  });

  factory TeacherDetails.fromMap(Map<String, dynamic> map) {
    return TeacherDetails(
      employeeId: map['employeeId'] ?? '',
      designation: map['designation'] ?? 'Teacher',
      assignedClass: map['assignedClass'] ?? '',
      subjects: List<String>.from(map['subjects'] ?? []),
    );
  }

  Map<String, dynamic> toMap() => {
    'employeeId': employeeId,
    'designation': designation,
    'assignedClass': assignedClass,
    'subjects': subjects,
  };
}
