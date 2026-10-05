import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:file_picker/file_picker.dart';

class MyHomeworkScreen extends StatefulWidget {
  const MyHomeworkScreen({super.key});

  @override
  State<MyHomeworkScreen> createState() => _MyHomeworkScreenState();
}

class _MyHomeworkScreenState extends State<MyHomeworkScreen> {
  Future<void> _submitAssignment(String hwTitle) async {
    final result = await FilePicker.platform.pickFiles(type: FileType.custom, allowedExtensions: ['pdf', 'jpg', 'png']);
    if (result != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Uploaded ${result.files.first.name} for $hwTitle!'), backgroundColor: Colors.green),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Homework & Worksheets'),
        backgroundColor: const Color(0xFF1E293B),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _hwCard('Mathematics', 'Polynomials & Factorization NCERT Ex 2.3', 'Due: 08 Oct 2026', '25 Marks', true),
          _hwCard('Science', 'Chemical Reactions & Equations Balanced Equations', 'Due: 09 Oct 2026', '20 Marks', false),
          _hwCard('Hindi', 'Sparsh Chapter 3 Long Answers Writing', 'Due: 10 Oct 2026', '15 Marks', false),
        ],
      ),
    );
  }

  Widget _hwCard(String subject, String title, String due, String marks, bool isSubmitted) {
    return Card(
      color: const Color(0xFF1E293B),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Chip(label: Text(subject, style: const TextStyle(color: Colors.white, fontSize: 11)), backgroundColor: Colors.indigo),
                Text(marks, style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 4),
            Text(due, style: const TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: () => _submitAssignment(title),
              icon: Icon(isSubmitted ? Icons.check_circle : Icons.upload_file),
              label: Text(isSubmitted ? 'Resubmit / Upload PDF' : 'Upload Solution PDF'),
              style: ElevatedButton.styleFrom(
                backgroundColor: isSubmitted ? Colors.teal : const Color(0xFF6366F1),
                minimumSize: const Size(double.infinity, 44),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
