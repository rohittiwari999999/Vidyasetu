import 'package:flutter/material.dart';

class StudentNoticesScreen extends StatelessWidget {
  const StudentNoticesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notices & Circulars'),
        backgroundColor: const Color(0xFF064E3B),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _noticeCard(
            title: 'CBSE Board Examination 2027 Registration Form Submission',
            date: '04 Oct 2026',
            sender: 'Principal Office',
            isImportant: true,
            description: 'All Class 10 students must verify their parent details and Aadhaar linkage in the school admin portal by 15th October 2026.',
          ),
          _noticeCard(
            title: 'Annual Sports Day 2026 Selection Trials',
            date: '02 Oct 2026',
            sender: 'Physical Education Dept',
            isImportant: false,
            description: 'Trials for Football, 100m sprint, and Basketball will be conducted on Saturday at the school grounds from 8:00 AM.',
          ),
          _noticeCard(
            title: 'Parent-Teacher Meeting (Term 1 Assessment Discussion)',
            date: '28 Sep 2026',
            sender: 'Academic Coordinator',
            isImportant: true,
            description: 'PTM for grades 9 to 12 will be held this Saturday between 9:00 AM to 1:00 PM. Parents are requested to adhere to their allotted time slots.',
          ),
        ],
      ),
    );
  }

  Widget _noticeCard({
    required String title,
    required String date,
    required String sender,
    required bool isImportant,
    required String description,
  }) {
    return Card(
      color: const Color(0xFF1E293B),
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (isImportant)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.redAccent.withOpacity(0.2),
                      border: Border.all(color: Colors.redAccent),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text('IMPORTANT', style: TextStyle(color: Colors.redAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                  )
                else
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.blueAccent.withOpacity(0.2),
                      border: Border.all(color: Colors.blueAccent),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text('CIRCULAR', style: TextStyle(color: Colors.blueAccent, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                Text(date, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
            const SizedBox(height: 10),
            Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 6),
            Text('From: $sender', style: const TextStyle(color: Color(0xFF6EE7B7), fontSize: 12, fontWeight: FontWeight.w500)),
            const SizedBox(height: 8),
            Text(description, style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4)),
          ],
        ),
      ),
    );
  }
}
