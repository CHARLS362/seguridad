import {getApps, initializeApp, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getFirestore, type Firestore} from 'firebase/firestore';
import {getFirebaseConfig} from './config';

// Exporta los proveedores y hooks para un fácil acceso
export {FirebaseClientProvider} from './client-provider';
export {FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore} from './provider';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export async function initializeFirebase() {
  const apps = getApps();
  if (apps.length === 0) {
    const config = getFirebaseConfig();
    app = initializeApp(config);
  } else {
    app = apps[0];
  }

  auth = getAuth(app);
  firestore = getFirestore(app);

  return {app, auth, firestore};
}
