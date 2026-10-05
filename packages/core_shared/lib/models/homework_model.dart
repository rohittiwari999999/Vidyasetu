import 'package:cloud_firestore/cloud_firestore.dart';

class HomeworkModel {
  final String id;
  final String title;
  final String description;
  final String classId;
  final String subject;
  final String teacherId;
  final String teacherName;
  final DateTime dueDate;
  final int maxMarks;
  final List<HomeworkAttachmentModel> attachments;
  final DateTime createdAt;

  HomeworkModel({
    required this.id,
    required this.title,
    required this.description,
    required this.classId,
    required this.subject,
    required this.teacherId,
    required this.teacherName,
    required this.dueDate,
    required this.maxMarks,
    this.attachments = const [],
    required this.createdAt,
  });

  factory HomeworkModel.fromFirestore(DocumentSnapshot doc) {
    final data = (doc.data() as Map<String, dynamic>?) ?? {};
    return HomeworkModel(
      id: doc.id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      classId: data['classId'] ?? '',
      subject: data['subject'] ?? '',
      teacherId: data['teacherId'] ?? '',
      teacherName: data['teacherName'] ?? '',
      dueDate: (data['dueDate'] as Timestamp?)?.toDate() ?? DateTime.now(),
      maxMarks: (data['maxMarks'] as num?)?.toInt() ?? 25,
      attachments: (data['attachments'] as List<dynamic>?)
              ?.map((e) => HomeworkAttachmentModel.fromMap(e as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'title': title,
    'description': description,
    'classId': classId,
    'subject': subject,
    'teacherId': teacherId,
    'teacherName': teacherName,
    'dueDate': Timestamp.fromDate(dueDate),
    'maxMarks': maxMarks,
    'attachments': attachments.map((e) => e.toMap()).toList(),
    'createdAt': Timestamp.fromDate(createdAt),
  };
}

class HomeworkAttachmentModel {
  final String name;
  final String downloadUrl;
  final String size;

  HomeworkAttachmentModel({
    required this.name,
    required this.downloadUrl,
    required this.size,
  });

  factory HomeworkAttachmentModel.fromMap(Map<String, dynamic> map) =>
      HomeworkAttachmentModel(
        name: map['name'] ?? '',
        downloadUrl: map['downloadUrl'] ?? '',
        size: map['size'] ?? '',
      );

  Map<String, dynamic> toMap() => {
    'name': name,
    'downloadUrl': downloadUrl,
    'size': size,
  };
}
