
// Log the values of environment variables for debugging (SERVER-SIDE)
// These logs will appear in your Next.js development server terminal.
console.log('Firebase Config (SERVER-SIDE): NEXT_PUBLIC_FIREBASE_API_KEY =', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('Firebase Config (SERVER-SIDE): NEXT_PUBLIC_FIREBASE_PROJECT_ID =', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth as firebaseGetAuth, type Auth }from "firebase/auth";
import { getFirestore as firebaseGetFirestore, type Firestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you need analytics

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // This is optional
};

// Basic check for essential Firebase config variables
// This check runs on both server-side (during Next.js build/SSR) and client-side.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  const missingVars = [];
  if (!firebaseConfig.apiKey) missingVars.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.projectId) missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");

  const errorMessage =
    `CRITICAL Firebase Config Error: The following Firebase configuration variable(s) are undefined or invalid: [${missingVars.join(", ")}]. ` +
    "Please CHECK YOUR SERVER TERMINAL LOGS for the (SERVER-SIDE) values printed just above this error message. " +
    "Then, ensure NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID are correctly set in your .env.local file (located in the project root directory) " +
    "and that you have RESTARTED your Next.js development server after making changes to the .env.local file. " +
    "Firebase services cannot be initialized.";
  console.error(errorMessage);
  // Throw a clear error to stop initialization if critical config is missing.
  // This helps in identifying the root cause faster than a generic Firebase error.
  throw new Error(errorMessage);
}

// Initialize Firebase
// It's important that app, auth, and db are declared before being exported.
// The getApps().length check prevents re-initializing the app on hot reloads.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = firebaseGetAuth(app);
const db: Firestore = firebaseGetFirestore(app);
// const analytics = getAnalytics(app); // Uncomment if you need analytics

export { app, auth, db };
