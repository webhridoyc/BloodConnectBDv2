
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth as firebaseGetAuth, type Auth } from "firebase/auth";
import {
  getFirestore as firebaseGetFirestore,
  type Firestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { config } from 'dotenv'; // Explicitly import and call dotenv

// Attempt to load environment variables from .env (or .env.local if dotenv picks it up)
// This is an attempt to ensure variables are loaded if Next.js's default mechanism isn't working as expected.
config(); // Call dotenv config at the very top

// Log the values of environment variables for debugging (SERVER-SIDE)
// These logs will appear in your Next.js development server terminal.
console.log('Firebase Config (SERVER-SIDE): NEXT_PUBLIC_FIREBASE_API_KEY =', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('Firebase Config (SERVER-SIDE): NEXT_PUBLIC_FIREBASE_PROJECT_ID =', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('Firebase Config (SERVER-SIDE): NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Check for missing critical Firebase configuration
const missingConfigKeys: string[] = [];
if (!firebaseConfig.apiKey) missingConfigKeys.push("NEXT_PUBLIC_FIREBASE_API_KEY");
if (!firebaseConfig.projectId) missingConfigKeys.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
if (!firebaseConfig.authDomain) missingConfigKeys.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");


if (missingConfigKeys.length > 0) {
  const errorMessage =
    `CRITICAL Firebase Config Error: The following Firebase configuration variable(s) are undefined or invalid: [${missingConfigKeys.join(", ")}]. ` +
    "Please CHECK YOUR SERVER TERMINAL LOGS for the (SERVER-SIDE) values printed just above this error message. " +
    "Then, ensure these variables are correctly set in your .env.local file (located in the project root directory) for local development, " +
    "or in your Firebase App Hosting environment configuration for deployment, " +
    "and that you have RESTARTED your Next.js development server after making changes to .env.local. " +
    "Firebase services cannot be initialized.";
  console.error(errorMessage);
  // Throw a clear error to stop initialization if critical config is missing.
  throw new Error(errorMessage);
}


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;
let persistenceEnabled = false; // Flag to ensure persistence is enabled only once

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    try {
      // Check if measurementId is provided before initializing Analytics
      if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      } else {
        console.warn("Firebase Analytics measurementId is missing; Analytics will not be initialized.");
        analytics = undefined;
      }
    } catch (e) {
      console.warn("Firebase Analytics could not be initialized.", e);
      analytics = undefined;
    }
    // Initialize Firestore first
    db = firebaseGetFirestore(app);
    // Attempt to enable offline persistence
    if (!persistenceEnabled) {
      enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
        .then(() => {
          persistenceEnabled = true;
          console.log("Firebase Firestore offline persistence enabled successfully.");
        })
        .catch((err) => {
          if (err.code == 'failed-precondition') {
            console.warn("Firestore offline persistence failed (failed-precondition): Usually means multiple tabs are open or persistence was already enabled. Offline capabilities might be limited or rely on existing state.");
            persistenceEnabled = true; // Assume it's effectively enabled if this specific error occurs
          } else if (err.code == 'unimplemented') {
            console.warn("Firestore offline persistence failed (unimplemented): The current browser does not support all of the features required to enable persistence. Offline capabilities will be unavailable.");
          } else {
            console.error("Firestore offline persistence failed with an unexpected error: ", err);
          }
        });
    }
  } else {
    app = getApp();
    if (!analytics && firebaseConfig.measurementId) { // Check if analytics was already initialized and if measurementId exists
        try {
            analytics = getAnalytics(app);
        } catch(e) {
            console.warn("Firebase Analytics could not be re-initialized on existing app.", e);
            analytics = undefined;
        }
    }
    db = firebaseGetFirestore(app);
  }
  auth = firebaseGetAuth(app);
} else {
  // Server-side initialization (e.g., for Next.js API routes or server components that might need auth/db)
  // Note: Offline persistence and Analytics are typically client-side features.
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = firebaseGetAuth(app);
  db = firebaseGetFirestore(app);
  // Analytics is not typically initialized on the server-side for Next.js apps using App Router
  analytics = undefined;
}

export { app, auth, db, analytics };

    