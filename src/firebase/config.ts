// La configuración de Firebase se carga desde las variables de entorno
// No es necesario modificar este archivo manualmente.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseConfig() {
  if (!firebaseConfig.apiKey) {
    throw new Error('No se encontraron las variables de entorno de Firebase. Asegúrate de que tu proyecto de Firebase esté configurado correctamente.');
  }
  return firebaseConfig;
}
