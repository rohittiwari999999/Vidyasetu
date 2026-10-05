import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AttendanceRegisterScreen extends StatefulWidget {
  const AttendanceRegisterScreen({super.key});

  @override
  State<AttendanceRegisterScreen> createState() => _AttendanceRegisterScreenState();
}

class _AttendanceRegisterScreenState extends State<AttendanceRegisterScreen> {
  final Map<String, String> _statuses = {};

  final List<Map<String, String>> _students = [
    {'id': 's1', 'roll': '01', 'name': 'Aakash Bhattacharya'},
    {'id': 's2', 'roll': '02', 'name': 'Aditi Chauhan'},
    {'id': 's3', 'roll': '12', 'name': 'Aarav Sharma'},
    {'id': 's4', 'roll': '18', 'name': 'Ananya Verma'},
    {'id': 's5', 'roll': '24', 'name': 'Devansh Kumar'},
  ];

  @override
  void initState() {
    super.initState();
    for (var s in _students) {
      _statuses[s['id']!] = 'P';
    }
  }

  Future<void> _saveAttendance() async {
    final now = DateTime.now();
    final dateStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
    
    await FirebaseFirestore.instance.collection('attendance').doc('ATT_${dateStr}_10A').set({
      'date': dateStr,
      'classId': 'Class 10-A',
      'records': _statuses,
      'timestamp': FieldValue.serverTimestamp(),
    });

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Attendance saved! Absentee SMS alerts queued.'), backgroundColor: Colors.green),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Class 10-A Digital Register'),
        backgroundColor: const Color(0xFF1E293B),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _students.length,
        itemBuilder: (context, index) {
          final s = _students[index];
          final current = _statuses[s['id']!] ?? 'P';

          return Card(
            color: const Color(0xFF1E293B),
            margin: const EdgeInsets.only(bottom: 8),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.indigoAccent,
                child: Text('#${s['roll']}', style: const TextStyle(color: Colors.white, fontSize: 13)),
              ),
              title: Text(s['name']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: ['P', 'A', 'L'].map((status) {
                  final isSelected = current == status;
                  return Padding(
                    padding: const EdgeInsets.only(left: 4),
                    child: ChoiceChip(
                      label: Text(status),
                      selected: isSelected,
                      selectedColor: status == 'P' ? Colors.green : (status == 'A' ? Colors.red : Colors.amber),
                      onSelected: (val) {
                        if (val) setState(() => _statuses[s['id']!] = status);
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
          );
        },
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: ElevatedButton.icon(
          onPressed: _saveAttendance,
          icon: const Icon(Icons.send),
          label: const Text('Save Roll Call & Notify Parents'),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6366F1),
            minimumSize: const Size(double.infinity, 50),
          ),
        ),
      ),
    );
  }
}
