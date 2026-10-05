import React, { useState } from 'react';
import { Copy, Check, Radio, Code2, Cloud } from 'lucide-react';

export const Deliverable5BroadcastCode: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'compose_screen' | 'fcm_service' | 'cloud_function'>('compose_screen');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const codeComposeScreen = `// File: apps/school_management_app/lib/features/broadcast/screens/compose_broadcast_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:core_shared/core_shared.dart';

class ComposeBroadcastScreen extends ConsumerStatefulWidget {
  const ComposeBroadcastScreen({super.key});

  @override
  ConsumerState<ComposeBroadcastScreen> createState() => _ComposeBroadcastScreenState();
}

class _ComposeBroadcastScreenState extends ConsumerState<ComposeBroadcastScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _messageController = TextEditingController();

  String _category = 'urgent'; // urgent, holiday, event, circular, exam
  String _audience = 'all';    // all, parents, students, teachers, class
  String _priority = 'high';   // emergency, high, normal
  String _targetClass = 'Class 10-A';
  bool _isSending = false;

  Future<void> _dispatchBroadcast() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSending = true);

    try {
      final user = ref.read(currentUserProfileProvider).value!;

      // Write to Firestore - Triggering the Cloud Function
      await FirebaseFirestore.instance.collection('broadcasts').add({
        'schoolId': user.schoolId,
        'title': _titleController.text.trim(),
        'message': _messageController.text.trim(),
        'category': _category,
        'targetAudience': _audience,
        'targetClass': _audience == 'class' ? _targetClass : null,
        'priority': _priority,
        'senderId': user.id,
        'senderName': '\${user.name} (\${user.role.name.toUpperCase()})',
        'senderRole': user.role.name,
        'timestamp': FieldValue.serverTimestamp(),
        'readCount': 0,
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('📢 Broadcast Dispatched! Push notification triggered via FCM.'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Broadcast failed: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isSending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text('Send School Broadcast / FCM Push'),
        backgroundColor: const Color(0xFF1E293B),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Notice Category
              const Text('Notice Category', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _category,
                dropdownColor: const Color(0xFF1E293B),
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Category'),
                items: const [
                  DropdownMenuItem(value: 'urgent', child: Text('🚨 Urgent Weather / Safety Advisory')),
                  DropdownMenuItem(value: 'holiday', child: Text('🏖️ Holiday Declaration')),
                  DropdownMenuItem(value: 'circular', child: Text('📜 Official School Circular')),
                  DropdownMenuItem(value: 'exam', child: Text('📝 Board / Term Examination Schedule')),
                  DropdownMenuItem(value: 'event', child: Text('🎉 Annual Day / PTM Invitation')),
                ],
                onChanged: (val) => setState(() => _category = val!),
              ),
              const SizedBox(height: 18),

              // Target Audience
              const Text('Target Audience', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _audience,
                dropdownColor: const Color(0xFF1E293B),
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Target Audience'),
                items: const [
                  DropdownMenuItem(value: 'all', child: Text('All Students, Parents & Staff')),
                  DropdownMenuItem(value: 'parents', child: Text('Parents Only')),
                  DropdownMenuItem(value: 'students', child: Text('Students Only')),
                  DropdownMenuItem(value: 'teachers', child: Text('Teaching Staff Only')),
                  DropdownMenuItem(value: 'class', child: Text('Specific Grade / Section')),
                ],
                onChanged: (val) => setState(() => _audience = val!),
              ),
              const SizedBox(height: 18),

              // Title
              const Text('Circular Title', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _titleController,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('e.g. Autumn Break Circular 2026'),
                validator: (val) => val == null || val.isEmpty ? 'Title required' : null,
              ),
              const SizedBox(height: 18),

              // Message Body
              const Text('Detailed Circular Message Body', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              TextFormField(
                controller: _messageController,
                maxLines: 5,
                style: const TextStyle(color: Colors.white),
                decoration: _inputDecoration('Type circular notice to broadcast to Indian parent WhatsApp and mobile apps...'),
                validator: (val) => val == null || val.isEmpty ? 'Message required' : null,
              ),
              const SizedBox(height: 28),

              ElevatedButton.icon(
                onPressed: _isSending ? null : _dispatchBroadcast,
                icon: _isSending ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)) : const Icon(Icons.campaign),
                label: Text(_isSending ? 'Transmitting FCM Broadcast...' : 'Broadcast to App Notifications & SMS'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF59E0B), // Amber
                  foregroundColor: Colors.black,
                  textStyle: const TextStyle(fontWeight: FontWeight.bold),
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
      filled: true,
      fillColor: const Color(0xFF1E293B),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF334155))),
    );
  }
}`;

  const codeFcmService = `// File: packages/core_shared/lib/services/fcm_notification_service.dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

// Top-level background message handler for Android & iOS
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print("Handling FCM background message: \${message.messageId}");
}

class FCMNotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();

  Future<void> initializeFCM(String userId) async {
    // 1. Request iOS / Android 13+ Notification Permissions
    final settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    if (settings.authorizationStatus != AuthorizationStatus.authorized) {
      print('User declined or has not accepted push notification permissions');
      return;
    }

    // 2. Setup Android high-priority channel
    const AndroidNotificationChannel channel = AndroidNotificationChannel(
      'school_broadcast_channel',
      'School Circulars & Urgent Alerts',
      description: 'High priority alerts for holidays, exams, and emergency notices',
      importance: Importance.max,
      playSound: true,
    );

    await _localNotifications
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);

    // 3. Register background handler
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // 4. Save FCM device token to Firestore user profile
    final token = await _fcm.getToken();
    if (token != null) {
      await FirebaseFirestore.instance.collection('users').doc(userId).update({
        'deviceTokens': FieldValue.arrayUnion([token]),
      });
    }

    // 5. Handle foreground notifications
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      final notification = message.notification;
      final android = message.notification?.android;

      if (notification != null && android != null) {
        _localNotifications.show(
          notification.hashCode,
          notification.title,
          notification.body,
          NotificationDetails(
            android: AndroidNotificationDetails(
              channel.id,
              channel.name,
              channelDescription: channel.description,
              icon: '@mipmap/ic_launcher',
              importance: Importance.max,
              priority: Priority.high,
            ),
            iOS: const DarwinNotificationDetails(
              presentAlert: true,
              presentBadge: true,
              presentSound: true,
            ),
          ),
        );
      }
    });

    // 6. Subscribe to global school topics
    await _fcm.subscribeToTopic('school_all');
  }

  Future<void> subscribeToClassTopic(String classId) async {
    final sanitizedTopic = 'class_\${classId.replaceAll(' ', '_')}';
    await _fcm.subscribeToTopic(sanitizedTopic);
  }
}`;

  const codeCloudFunction = `// File: functions/src/index.ts (Firebase Cloud Functions Node.js/TypeScript)
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Automatically triggers whenever a new broadcast circular is created in Firestore.
 * Dispatches high-priority push notifications to Android & iOS devices via FCM.
 */
export const onBroadcastCreated = functions.firestore
  .document("broadcasts/{broadcastId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    if (!data) return;

    const { title, message, category, priority, targetAudience, targetClass } = data;

    // Determine target topic
    let topicName = "school_all";
    if (targetAudience === "class" && targetClass) {
      topicName = \`class_\${targetClass.replace(/\\s+/g, "_")}\`;
    } else if (targetAudience === "parents") {
      topicName = "role_parents";
    } else if (targetAudience === "students") {
      topicName = "role_students";
    }

    const payload: admin.messaging.Message = {
      topic: topicName,
      notification: {
        title: \`[\${category.toUpperCase()}] \${title}\`,
        body: message.length > 120 ? \`\${message.substring(0, 117)}...\` : message,
      },
      data: {
        broadcastId: context.params.broadcastId,
        category: category,
        priority: priority,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      android: {
        priority: priority === "emergency" ? "high" : "normal",
        notification: {
          channelId: "school_broadcast_channel",
          sound: "default",
          priority: admin.messaging.AndroidNotificationPriority.HIGH,
        },
      },
      apns: {
        payload: {
          aps: {
            alert: { title, body: message },
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await admin.messaging().send(payload);
      console.log(\`Successfully dispatched FCM message to topic: \${topicName}\`, response);
    } catch (error) {
      console.error("Error dispatching FCM broadcast:", error);
    }
  });`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Deliverable 5 of 5
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Broadcast Messaging & FCM Push Notification System Code
            </h2>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Full implementation of the school broadcast communication system. Includes the Flutter Compose UI, client-side Firebase Messaging handler with background receiver, and the Firebase Cloud Function (<code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono">onBroadcastCreated</code>) that automatically delivers high-priority notifications to topics.
        </p>
      </div>

      {/* Code Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('compose_screen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'compose_screen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              compose_broadcast_screen.dart
            </button>
            <button
              onClick={() => setActiveTab('fcm_service')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'fcm_service' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              fcm_notification_service.dart
            </button>
            <button
              onClick={() => setActiveTab('cloud_function')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'cloud_function' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              index.ts (Cloud Function)
            </button>
          </div>

          <button
            onClick={() => {
              const codeMap = {
                compose_screen: codeComposeScreen,
                fcm_service: codeFcmService,
                cloud_function: codeCloudFunction,
              };
              copyToClipboard(codeMap[activeTab], activeTab);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedKey === activeTab ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === activeTab ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[520px] overflow-y-auto">
          {activeTab === 'compose_screen' && <pre>{codeComposeScreen}</pre>}
          {activeTab === 'fcm_service' && <pre>{codeFcmService}</pre>}
          {activeTab === 'cloud_function' && <pre>{codeCloudFunction}</pre>}
        </div>
      </div>
    </div>
  );
};
