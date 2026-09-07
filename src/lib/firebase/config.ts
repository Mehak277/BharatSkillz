import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';

/**
 * Firebase configuration from VITE environment variables
 */
const getFirebaseConfig = () => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDRKq_f9r1uWQiDYZHFBJAr0mnOrg3x2xU',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'bharatskillz.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'bharatskillz',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'bharatskillz.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '339468213220',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:339468213220:web:a47ca5206fc38c875745f1',
  };
};

/**
 * Initialize Firebase App with singleton pattern
 */
let firebaseApp: FirebaseApp;

const initializeFirebaseApp = (): FirebaseApp => {
  try {
    // Try to get existing app instance first
    firebaseApp = getApp();
  } catch {
    // Initialize new app if it doesn't exist
    firebaseApp = initializeApp(getFirebaseConfig());
  }
  return firebaseApp;
};

/**
 * Get or initialize Firebase Authentication
 */
export const getFirebaseAuth = async (): Promise<Auth> => {
  const app = initializeFirebaseApp();
  const auth = getAuth(app);

  // Set persistence to local storage for better UX
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.warn('Failed to set auth persistence:', error);
  }

  return auth;
};

/**
 * Get or initialize Firebase Firestore
 */
export const getFirebaseFirestore = (): Firestore => {
  const app = initializeFirebaseApp();
  const db = getFirestore(app);

  // Connect to Firestore emulator in development if configured
  if (
    import.meta.env.DEV &&
    import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true'
  ) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      // Emulator already connected or other connection error
      console.debug('Firestore emulator connection info:', error);
    }
  }

  return db;
};

/**
 * Export Firebase app instance
 */
export const getFirebaseApp = (): FirebaseApp => {
  return initializeFirebaseApp();
};

// Type exports for convenience
export type { FirebaseApp, Auth, Firestore };
