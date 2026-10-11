import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    if (Firebase.apps.isEmpty) {
      await Firebase.initializeApp().timeout(const Duration(seconds: 4));
    }
  } catch (e) {
    debugPrint('Default Firebase init notice: $e');
    try {
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp(
          options: const FirebaseOptions(
            apiKey: 'AIzaSyAC6Tw4VuZKhJymPCPm4Z5vVn9Y_a7j23A',
            appId: '1:1064474396247:android:01f246dfb73fef95fb8512',
            messagingSenderId: '1064474396247',
            projectId: 'vidyasetu-2d41e',
            storageBucket: 'vidyasetu-2d41e.firebasestorage.app',
          ),
        ).timeout(const Duration(seconds: 4));
      }
    } catch (e2) {
      debugPrint('Firebase fallback options notice: $e2');
    }
  }
  runApp(const ProviderScope(child: StudentParentApp()));
}
