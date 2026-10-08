import 'package:cloud_firestore/cloud_firestore.dart';

class StudentExamScore {
  final String studentId;
  final String rollNumber;
  final String studentName;
  final double theoryMarks;
  final double practicalMarks;
  final double maxTheory;
  final double maxPractical;
  final String remarks;

  StudentExamScore({
    required this.studentId,
    required this.rollNumber,
    required this.studentName,
    required this.theoryMarks,
    required this.practicalMarks,
    this.maxTheory = 80.0,
    this.maxPractical = 20.0,
    this.remarks = '',
  });

  double get totalMarks => theoryMarks + practicalMarks;
  double get maxTotal => maxTheory + maxPractical;
  double get percentage => maxTotal > 0 ? (totalMarks / maxTotal) * 100 : 0;

  String get cbseGrade {
    final pct = percentage;
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 33) return 'D';
    return 'E (Needs Imp.)';
  }

  Map<String, dynamic> toMap() {
    return {
      'studentId': studentId,
      'rollNumber': rollNumber,
      'studentName': studentName,
      'theoryMarks': theoryMarks,
      'practicalMarks': practicalMarks,
      'maxTheory': maxTheory,
      'maxPractical': maxPractical,
      'totalMarks': totalMarks,
      'percentage': percentage,
      'cbseGrade': cbseGrade,
      'remarks': remarks,
    };
  }

  factory StudentExamScore.fromMap(Map<String, dynamic> map) {
    return StudentExamScore(
      studentId: map['studentId'] ?? '',
      rollNumber: map['rollNumber'] ?? '',
      studentName: map['studentName'] ?? '',
      theoryMarks: (map['theoryMarks'] as num?)?.toDouble() ?? 0.0,
      practicalMarks: (map['practicalMarks'] as num?)?.toDouble() ?? 0.0,
      maxTheory: (map['maxTheory'] as num?)?.toDouble() ?? 80.0,
      maxPractical: (map['maxPractical'] as num?)?.toDouble() ?? 20.0,
      remarks: map['remarks'] ?? '',
    );
  }
}

class ExamAssessmentModel {
  final String id;
  final String classId;
  final String examType; // e.g. "Term 1 Examination", "Periodic Test 1", "Pre-Board"
  final String subjectName; // e.g. "Mathematics (041)"
  final DateTime examDate;
  final List<StudentExamScore> scores;
  final bool isPublished;
  final String createdBy;
  final DateTime updatedAt;

  ExamAssessmentModel({
    required this.id,
    required this.classId,
    required this.examType,
    required this.subjectName,
    required this.examDate,
    required this.scores,
    this.isPublished = false,
    required this.createdBy,
    required this.updatedAt,
  });

  double get classAverage {
    if (scores.isEmpty) return 0.0;
    final total = scores.fold<double>(0.0, (sum, s) => sum + s.totalMarks);
    return total / scores.length;
  }

  double get highestScore {
    if (scores.isEmpty) return 0.0;
    return scores.map((s) => s.totalMarks).reduce((a, b) => a > b ? a : b);
  }

  double get passPercentage {
    if (scores.isEmpty) return 0.0;
    final passed = scores.where((s) => s.percentage >= 33.0).length;
    return (passed / scores.length) * 100;
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'classId': classId,
      'examType': examType,
      'subjectName': subjectName,
      'examDate': Timestamp.fromDate(examDate),
      'scores': scores.map((s) => s.toMap()).toList(),
      'isPublished': isPublished,
      'createdBy': createdBy,
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }

  factory ExamAssessmentModel.fromFirestore(DocumentSnapshot doc) {
    final data = (doc.data() as Map<String, dynamic>?) ?? {};
    final scoresList = (data['scores'] as List<dynamic>?) ?? [];
    return ExamAssessmentModel(
      id: doc.id,
      classId: data['classId'] ?? 'Class 10-A',
      examType: data['examType'] ?? 'Term 1 Examination',
      subjectName: data['subjectName'] ?? 'Mathematics',
      examDate: (data['examDate'] as Timestamp?)?.toDate() ?? DateTime.now(),
      scores: scoresList.map((s) => StudentExamScore.fromMap(s as Map<String, dynamic>)).toList(),
      isPublished: data['isPublished'] ?? false,
      createdBy: data['createdBy'] ?? '',
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }
}

class PtmScheduleModel {
  final String id;
  final String title;
  final String classId;
  final DateTime scheduledDate;
  final String timeSlot; // e.g. "09:30 AM - 01:30 PM"
  final String venue; // e.g. "Room 204, Senior Block"
  final String meetingMode; // "Offline (In Campus)" or "Virtual (Google Meet)"
  final String agenda;
  final bool isCompleted;
  final DateTime createdAt;

  PtmScheduleModel({
    required this.id,
    required this.title,
    required this.classId,
    required this.scheduledDate,
    required this.timeSlot,
    required this.venue,
    required this.meetingMode,
    required this.agenda,
    this.isCompleted = false,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'classId': classId,
      'scheduledDate': Timestamp.fromDate(scheduledDate),
      'timeSlot': timeSlot,
      'venue': venue,
      'meetingMode': meetingMode,
      'agenda': agenda,
      'isCompleted': isCompleted,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }

  factory PtmScheduleModel.fromFirestore(DocumentSnapshot doc) {
    final data = (doc.data() as Map<String, dynamic>?) ?? {};
    return PtmScheduleModel(
      id: doc.id,
      title: data['title'] ?? 'Parent-Teacher Meeting',
      classId: data['classId'] ?? 'Class 10-A',
      scheduledDate: (data['scheduledDate'] as Timestamp?)?.toDate() ?? DateTime.now(),
      timeSlot: data['timeSlot'] ?? '09:30 AM - 01:30 PM',
      venue: data['venue'] ?? 'Room 204, Senior Block',
      meetingMode: data['meetingMode'] ?? 'Offline (In Campus)',
      agenda: data['agenda'] ?? '',
      isCompleted: data['isCompleted'] ?? false,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }
}

class PtmStudentNoteModel {
  final String studentId;
  final String rollNumber;
  final String studentName;
  final String parentName;
  final String attendanceStatus; // "Attended", "Confirmed", "Absent"
  final String teacherFeedback;
  final String parentActionItems;
  final DateTime updatedAt;

  PtmStudentNoteModel({
    required this.studentId,
    required this.rollNumber,
    required this.studentName,
    required this.parentName,
    this.attendanceStatus = 'Confirmed',
    this.teacherFeedback = '',
    this.parentActionItems = '',
    required this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'studentId': studentId,
      'rollNumber': rollNumber,
      'studentName': studentName,
      'parentName': parentName,
      'attendanceStatus': attendanceStatus,
      'teacherFeedback': teacherFeedback,
      'parentActionItems': parentActionItems,
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }

  factory PtmStudentNoteModel.fromMap(Map<String, dynamic> map) {
    return PtmStudentNoteModel(
      studentId: map['studentId'] ?? '',
      rollNumber: map['rollNumber'] ?? '',
      studentName: map['studentName'] ?? '',
      parentName: map['parentName'] ?? '',
      attendanceStatus: map['attendanceStatus'] ?? 'Confirmed',
      teacherFeedback: map['teacherFeedback'] ?? '',
      parentActionItems: map['parentActionItems'] ?? '',
      updatedAt: (map['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }
}
