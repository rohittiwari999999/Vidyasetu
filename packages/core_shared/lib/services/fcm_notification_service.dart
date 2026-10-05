import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // Process background message
}

class FCMNotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;

  Future<void> initializeFCM(String userId) async {
    final settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
      final token = await _fcm.getToken();
      if (token != null) {
        await FirebaseFirestore.instance.collection('users').doc(userId).update({
          'deviceTokens': FieldValue.arrayUnion([token]),
        });
      }
      await _fcm.subscribeToTopic('school_all');
    }
  }

  Future<void> subscribeToClass(String classId) async {
    final topic = 'class_${classId.replaceAll(' ', '_')}';
    await _fcm.subscribeToTopic(topic);
  }
}
