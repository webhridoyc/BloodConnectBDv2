
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth as firebaseGetAuth, type Auth } from "firebase/auth";
import { getFirestore as firebaseGetFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Perform an upfront check for essential Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  const errorMessage =
    "CRITICAL Firebase Config Error: Firebase API Key or Project ID is missing or invalid. " +
    "Please ensure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID " +
    "are correctly set in your environment variables. Firebase services cannot be initialized.";
  console.error(errorMessage);
  // Throw a clear error to stop initialization if critical config is missing.
  // This helps in identifying the root cause faster than a generic Firebase error.
  throw new Error(errorMessage);
}

// Initialize Firebase
// It's important that app, auth, and db are declared before being exported.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = firebaseGetAuth(app);
const db: Firestore = firebaseGetFirestore(app);

export { app, auth, db };
