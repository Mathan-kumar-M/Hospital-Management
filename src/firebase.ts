import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

import firebaseConfigActual from './firebase-applet-config.json';

const defaultFirebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "placeholder-project.firebaseapp.com",
  projectId: "placeholder-project",
  storageBucket: "placeholder-project.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
  firestoreDatabaseId: "(default)"
};

const firebaseConfig = { ...defaultFirebaseConfig, ...firebaseConfigActual };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
  }
}

testConnection();

export default app;
