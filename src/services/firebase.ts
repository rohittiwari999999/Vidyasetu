import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection } from 'firebase/firestore';

// Vidyasetu Official Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAC6Tw4VuZKhJymPCPm4Z5vVn9Y_a7j23A",
  authDomain: "vidyasetu-2d41e.firebaseapp.com",
  projectId: "vidyasetu-2d41e",
  storageBucket: "vidyasetu-2d41e.firebasestorage.app",
  messagingSenderId: "1064474396247",
  appId: "1:1064474396247:android:01f246dfb73fef95fb8512",
};

// Initialize Firebase App safely (singleton)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider setup with profile and email scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Sign in with Google using Firebase Authentication.
 * Handles popup blockers, iframe sandboxes, and returns authenticated FirebaseUser.
 */
export async function signInWithGoogleFirebase(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Firebase Google Sign-In Error:', error);
    // If popup was blocked or closed by user
    if (error.code === 'auth/popup-blocked') {
      throw new Error(
        'Google Sign-in popup was blocked by your browser. Please allow popups for this site or try again.'
      );
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Google Sign-in popup was closed before authentication completed.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Another sign-in attempt was already in progress.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error during Google authentication. Please check your connection.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error(
        `Firebase domain authorization notice: ${window.location.hostname} is not yet in the authorized domains list in Firebase Console (Authentication > Settings > Authorized domains).`
      );
    }
    throw error;
  }
}

/**
 * Sign out current Firebase user
 */
export async function signOutFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('Firebase signout error:', err);
  }
}

/**
 * Sync authenticated user profile to Firestore
 */
export async function syncUserToFirestore(user: FirebaseUser, staffData: any) {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email?.toLowerCase() || '',
        displayName: user.displayName || staffData.name || '',
        photoURL: user.photoURL || '',
        role: staffData.role || 'staff',
        schoolId: staffData.schoolId || 'SCH-DELHI-001',
        lastLogin: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore sync notice (continuing):', err);
  }
}
