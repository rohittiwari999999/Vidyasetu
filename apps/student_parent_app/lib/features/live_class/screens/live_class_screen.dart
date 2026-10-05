import 'package:flutter/material.dart';

class LiveClassScreen extends StatelessWidget {
  const LiveClassScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live Online Class'),
        backgroundColor: const Color(0xFF064E3B),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Active Class Banner
            Card(
              color: const Color(0xFF064E3B),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.redAccent,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.fiber_manual_record, color: Colors.white, size: 12),
                              SizedBox(width: 4),
                              Text('LIVE NOW', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11)),
                            ],
                          ),
                        ),
                        const Text('Room: #VS-10A-MATH', style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 12)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text('Class 10-A • Mathematics', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                    const SizedBox(height: 4),
                    const Text('Chapter 4: Quadratic Equations & Formula Derivation', style: TextStyle(color: Colors.white70, fontSize: 14)),
                    const SizedBox(height: 8),
                    const Text('Teacher: Mrs. Sunita Verma (PGT Math)', style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 13)),
                    const SizedBox(height: 20),
                    ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Connecting to secure Jitsi Meet room: meet.jit.si/VidyaSetu_10A_Math'),
                            backgroundColor: Color(0xFF10B981),
                          ),
                        );
                      },
                      icon: const Icon(Icons.video_call, size: 24),
                      label: const Text('Join Live Room Now', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(double.infinity, 50),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            const Text("Upcoming Scheduled Classes", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 12),

            _scheduleCard(
              context,
              subject: 'Physics',
              topic: 'Ray Optics: Refraction Through Prism',
              teacher: 'Mr. Rajesh Pandey',
              time: 'Today • 04:30 PM - 05:30 PM',
              status: 'Starts in 2 hours',
            ),
            _scheduleCard(
              context,
              subject: 'English Core',
              topic: 'Flamingo: The Last Lesson Analysis',
              teacher: 'Ms. Anita Deshmukh',
              time: 'Tomorrow • 10:00 AM - 11:00 AM',
              status: 'Scheduled',
            ),
          ],
        ),
      ),
    );
  }

  Widget _scheduleCard(
    BuildContext context, {
    required String subject,
    required String topic,
    required String teacher,
    required String time,
    required String status,
  }) {
    return Card(
      color: const Color(0xFF1E293B),
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Chip(
                  label: Text(subject, style: const TextStyle(color: Colors.white, fontSize: 11)),
                  backgroundColor: const Color(0xFF0F766E),
                  visualDensity: VisualDensity.compact,
                ),
                Text(status, style: const TextStyle(color: Colors.amber, fontSize: 12, fontWeight: FontWeight.w600)),
              ],
            ),
            const SizedBox(height: 8),
            Text(topic, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 4),
            Text('Instructor: $teacher', style: const TextStyle(color: Colors.grey, fontSize: 13)),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.schedule, color: Colors.grey, size: 16),
                const SizedBox(width: 6),
                Text(time, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
