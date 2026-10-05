import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class ComposeBroadcastScreen extends ConsumerStatefulWidget {
  const ComposeBroadcastScreen({super.key});

  @override
  ConsumerState<ComposeBroadcastScreen> createState() => _ComposeBroadcastScreenState();
}

class _ComposeBroadcastScreenState extends ConsumerState<ComposeBroadcastScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _messageController = TextEditingController();
  String _targetAudience = 'All Parents';
  String _priority = 'Normal';
  bool _isBroadcasting = false;

  final List<String> _audiences = [
    'All Parents',
    'All Teachers',
    'All Staff & Parents',
    'Class 10th Only',
    'Primary Wing (1st - 5th)'
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  void _sendBroadcast() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isBroadcasting = true);

    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() => _isBroadcasting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Broadcast alert dispatched to $_targetAudience!'),
          backgroundColor: Colors.green,
        ),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Send Broadcast Notice'),
        backgroundColor: const Color(0xFF1E293B),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Card(
                color: const Color(0xFF1E293B),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      DropdownButtonFormField<String>(
                        value: _targetAudience,
                        dropdownColor: const Color(0xFF1E293B),
                        decoration: const InputDecoration(
                          labelText: 'Target Audience',
                          prefixIcon: Icon(Icons.people_alt_outlined),
                          border: OutlineInputBorder(),
                        ),
                        items: _audiences
                            .map((a) => DropdownMenuItem(value: a, child: Text(a)))
                            .toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _targetAudience = val);
                        },
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        value: _priority,
                        dropdownColor: const Color(0xFF1E293B),
                        decoration: const InputDecoration(
                          labelText: 'Notification Priority',
                          prefixIcon: Icon(Icons.notifications_active_outlined),
                          border: OutlineInputBorder(),
                        ),
                        items: const [
                          DropdownMenuItem(value: 'Normal', child: Text('Normal (Routine Notice)')),
                          DropdownMenuItem(value: 'Urgent', child: Text('Urgent (Immediate Push)')),
                          DropdownMenuItem(value: 'Emergency', child: Text('Emergency (Red Alert)')),
                        ],
                        onChanged: (val) {
                          if (val != null) setState(() => _priority = val);
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          labelText: 'Notice Headline',
                          hintText: 'e.g. School Holiday Notice or Annual Sports Meet',
                          border: OutlineInputBorder(),
                        ),
                        validator: (val) =>
                            val == null || val.isEmpty ? 'Please enter a title' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _messageController,
                        maxLines: 5,
                        decoration: const InputDecoration(
                          labelText: 'Message Body',
                          hintText: 'Enter full notification text to broadcast to parents/teachers...',
                          border: OutlineInputBorder(),
                        ),
                        validator: (val) =>
                            val == null || val.isEmpty ? 'Please enter message content' : null,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  onPressed: _isBroadcasting ? null : _sendBroadcast,
                  icon: _isBroadcasting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.campaign),
                  label: Text(_isBroadcasting ? 'Dispatching Broadcast...' : 'Broadcast Notice Now'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE11D48),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
