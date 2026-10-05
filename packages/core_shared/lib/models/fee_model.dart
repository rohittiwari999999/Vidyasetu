import 'package:cloud_firestore/cloud_firestore.dart';

class FeeModel {
  final String id;
  final String studentId;
  final String studentName;
  final String classId;
  final String rollNo;
  final String term;
  final double tuitionFee;
  final double transportFee;
  final double labFee;
  final double examFee;
  final double totalAmount;
  final double paidAmount;
  final String paymentStatus;
  final String? receiptNumber;
  final String? transactionId;
  final String? mode;
  final DateTime? paymentDate;
  final DateTime dueDate;

  FeeModel({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.classId,
    required this.rollNo,
    required this.term,
    required this.tuitionFee,
    required this.transportFee,
    required this.labFee,
    required this.examFee,
    required this.totalAmount,
    required this.paidAmount,
    required this.paymentStatus,
    this.receiptNumber,
    this.transactionId,
    this.mode,
    this.paymentDate,
    required this.dueDate,
  });

  bool get isPaid => paymentStatus == 'paid';

  factory FeeModel.fromFirestore(DocumentSnapshot doc) {
    final data = (doc.data() as Map<String, dynamic>?) ?? {};
    return FeeModel(
      id: doc.id,
      studentId: data['studentId'] ?? '',
      studentName: data['studentName'] ?? '',
      classId: data['classId'] ?? '',
      rollNo: data['rollNo'] ?? '',
      term: data['term'] ?? '',
      tuitionFee: (data['tuitionFee'] as num?)?.toDouble() ?? 0.0,
      transportFee: (data['transportFee'] as num?)?.toDouble() ?? 0.0,
      labFee: (data['labFee'] as num?)?.toDouble() ?? 0.0,
      examFee: (data['examFee'] as num?)?.toDouble() ?? 0.0,
      totalAmount: (data['totalAmount'] as num?)?.toDouble() ?? 0.0,
      paidAmount: (data['paidAmount'] as num?)?.toDouble() ?? 0.0,
      paymentStatus: data['paymentStatus'] ?? 'pending',
      receiptNumber: data['receiptNumber'],
      transactionId: data['transactionId'],
      mode: data['mode'],
      paymentDate: (data['paymentDate'] as Timestamp?)?.toDate(),
      dueDate: (data['dueDate'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'studentId': studentId,
    'studentName': studentName,
    'classId': classId,
    'rollNo': rollNo,
    'term': term,
    'tuitionFee': tuitionFee,
    'transportFee': transportFee,
    'labFee': labFee,
    'examFee': examFee,
    'totalAmount': totalAmount,
    'paidAmount': paidAmount,
    'paymentStatus': paymentStatus,
    'receiptNumber': receiptNumber,
    'transactionId': transactionId,
    'mode': mode,
    'paymentDate': paymentDate != null ? Timestamp.fromDate(paymentDate!) : null,
    'dueDate': Timestamp.fromDate(dueDate),
  };
}
