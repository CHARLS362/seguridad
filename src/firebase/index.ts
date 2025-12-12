'use client';

import { getFirebaseConfig } from './config';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, connectAuthEmulator } from 'firebase/auth';
import { Firestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Explicitly import hooks and providers
export * from './provider';


function initializeFirebase(): { app: FirebaseApp; auth: Auth; firestore: Firestore } {
  const firebaseConfig = getFirebaseConfig();
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // NOTE: This is a development-only feature.
  if (process.env.NODE_ENV === 'development' && !('_firebaseEmulators' in app)) {
    // Point to the emulators running on localhost.
    // connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    // connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  }

  return { app, auth, firestore };
}

// Export a function to get the initialized instances
export { initializeFirebase };
