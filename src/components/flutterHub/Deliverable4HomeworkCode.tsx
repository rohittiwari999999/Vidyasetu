import React, { useState } from 'react';
import { Copy, Check, BookOpen, Code2 } from 'lucide-react';

export const Deliverable4HomeworkCode: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create_screen' | 'repo' | 'model' | 'student_screen'>('create_screen');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const codeCreateScreen = `// File: apps/school_management_app/lib/features/homework/screens/create_homework_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import 'package:intl/intl.dart';
import 'package:core_shared/core_shared.dart';
import '../controllers/homework_controller.dart';

class CreateHomeworkScreen extends ConsumerStatefulWidget {
  final String assignedClass; // e.g. "Class 10-A"
  const CreateHomeworkScreen({super.key, required this.assignedClass});

  @override
  ConsumerState<CreateHomeworkScreen> createState() => _CreateHomeworkScreenState();
}

class _CreateHomeworkScreenState extends ConsumerState<CreateHomeworkScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _marksController = TextEditingController(text: '25');

  String _selectedSubject = 'Mathematics';
  DateTime _dueDate = DateTime.now().add(const Duration(days: 3));
  PlatformFile? _pickedFile;
  bool _isLoading = false;

  final List<String> _subjects = [
    'Mathematics',
    'Science (Physics/Chem/Bio)',
    'English Communicative',
    'Hindi Course B',
    'Social Science',
    'Computer Science / IT',
    'Sanskrit'
  ];

  Future<void> _pickAttachment() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    );
    if (result != null && result.files.isNotEmpty) {
      setState(() => _pickedFile = result.files.first);
    }
  }

  Future<void> _submitHomework() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final user = ref.read(currentUserProfileProvider).value!;

      await ref.read(homeworkControllerProvider.notifier).createHomework(
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        classId: widget.assignedClass,
        subject: _selectedSubject,
        teacherId: user.id,
        teacherName: user.name,
        dueDate: _dueDate,
        maxMarks: int.parse(_marksController.text),
        localAttachment: _pickedFile,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Homework posted successfully! Push notifications queued for students.'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: Text('Assign Homework • \${widget.assignedClass}'),
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Subject Dropdown
              const Text('Subject', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _selectedSubject,
                dropdownColor: const Color(0xFF1E293B),
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Select Subject'),
                items: _subjects.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                onChanged: (val) => setState(() => _selectedSubject = val!),
              ),
              const SizedBox(height: 18),

              // Title Field
              const Text('Assignment Title', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _titleController,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('e.g. NCERT Ex 2.3 Factorization Problems'),
                validator: (val) => val == null || val.isEmpty ? 'Title is required' : null,
              ),
              const SizedBox(height: 18),

              // Description Field
              const Text('Problem Instructions / Details', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _descController,
                maxLines: 4,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Specify question numbers, steps required, and formatting...'),
                validator: (val) => val == null || val.isEmpty ? 'Instructions are required' : null,
              ),
              const SizedBox(height: 18),

              // Due Date & Max Marks Row
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Submission Due Date', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        InkWell(
                          onTap: () async {
                            final picked = await showDatePicker(
                              context: context,
                              initialDate: _dueDate,
                              firstDate: DateTime.now(),
                              lastDate: DateTime.now().add(const Duration(days: 60)),
                            );
                            if (picked != null) setState(() => _dueDate = picked);
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E293B),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF334155)),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(DateFormat('dd MMM yyyy').format(_dueDate), style: const TextStyle(color: Colors.white)),
                                const Icon(Icons.calendar_today, color: Colors.indigoAccent, size: 18),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Maximum Marks', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _marksController,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(color: Colors.white),
                          decoration: _inputDecoration('Max Marks'),
                          validator: (val) => val == null || val.isEmpty ? 'Marks required' : null,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Attachment Picker Box
              const Text('Attach Worksheet PDF (Optional)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              InkWell(
                onTap: _pickAttachment,
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.indigoAccent.withOpacity(0.4), style: BorderStyle.solid),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.attach_file, color: Colors.indigoAccent),
                      const SizedBox(width: 8),
                      Text(
                        _pickedFile != null ? _pickedFile!.name : 'Click to attach PDF / Document',
                        style: TextStyle(
                          color: _pickedFile != null ? Colors.white : Colors.indigoAccent,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Submit Button
              ElevatedButton.icon(
                onPressed: _isLoading ? null : _submitHomework,
                icon: _isLoading ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.send),
                label: Text(_isLoading ? 'Publishing & Notifying...' : 'Publish Homework to \${widget.assignedClass}'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 54),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Color(0xFF64748B)),
      filled: true,
      fillColor: const Color(0xFF1E293B),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF334155))),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF334155))),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF6366F1))),
    );
  }
}`;

  const codeRepository = `// File: packages/core_shared/lib/services/homework_repository.dart
import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:file_picker/file_picker.dart';
import '../models/homework_model.dart';
import '../models/submission_model.dart';

class HomeworkRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;

  /// Stream of homework for a specific class (e.g. "Class 10-A")
  Stream<List<HomeworkModel>> streamClassHomework(String classId) {
    return _firestore
        .collection('homework')
        .where('classId', isEqualTo: classId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snap) => snap.docs.map((doc) => HomeworkModel.fromFirestore(doc)).toList());
  }

  /// Create and publish new homework with file upload
  Future<void> createHomework({
    required String title,
    required String description,
    required String classId,
    required String subject,
    required String teacherId,
    required String teacherName,
    required DateTime dueDate,
    required int maxMarks,
    PlatformFile? localAttachment,
  }) async {
    final docRef = _firestore.collection('homework').doc();
    List<Map<String, dynamic>> attachmentsList = [];

    // 1. Upload PDF worksheet to Firebase Storage if selected
    if (localAttachment != null && localAttachment.bytes != null) {
      final storagePath = 'homework/\${docRef.id}/\${localAttachment.name}';
      final uploadTask = await _storage.ref(storagePath).putData(localAttachment.bytes!);
      final downloadUrl = await uploadTask.ref.getDownloadURL();

      attachmentsList.add({
        'name': localAttachment.name,
        'size': '\${(localAttachment.size / 1024).toStringAsFixed(1)} KB',
        'downloadUrl': downloadUrl,
        'storagePath': storagePath,
      });
    }

    // 2. Save document to Firestore
    await docRef.set({
      'id': docRef.id,
      'title': title,
      'description': description,
      'classId': classId,
      'subject': subject,
      'teacherId': teacherId,
      'teacherName': teacherName,
      'dueDate': Timestamp.fromDate(dueDate),
      'maxMarks': maxMarks,
      'attachments': attachmentsList,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  /// Grade a student submission
  Future<void> gradeSubmission({
    required String submissionId,
    required int marks,
    required String feedback,
  }) async {
    await _firestore.collection('submissions').doc(submissionId).update({
      'marksObtained': marks,
      'feedback': feedback,
      'status': 'graded',
      'gradedAt': FieldValue.serverTimestamp(),
    });
  }
}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Deliverable 4 of 5
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Class Teacher Homework Assignment Module Code
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Production Flutter code implementing the Class Teacher assignment creation flow: subject selector, due date picker, max marks, PDF attachment upload to Firebase Storage, and Firestore document write with real-time stream subscription.
        </p>
      </div>

      {/* Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create_screen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'create_screen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              create_homework_screen.dart
            </button>
            <button
              onClick={() => setActiveTab('repo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'repo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              homework_repository.dart
            </button>
          </div>

          <button
            onClick={() => {
              const codeMap = {
                create_screen: codeCreateScreen,
                repo: codeRepository,
                model: '',
                student_screen: '',
              };
              copyToClipboard(codeMap[activeTab], activeTab);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedKey === activeTab ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === activeTab ? 'Copied Dart Code!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[520px] overflow-y-auto">
          {activeTab === 'create_screen' && <pre>{codeCreateScreen}</pre>}
          {activeTab === 'repo' && <pre>{codeRepository}</pre>}
        </div>
      </div>
    </div>
  );
};
