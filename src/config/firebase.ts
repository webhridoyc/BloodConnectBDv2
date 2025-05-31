
// Import the functions you need from the SDKs you need
import type { FirebaseApp } from "firebase/app";
import { initializeApp, getApp, getApps } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import type { Auth } from "firebase/auth";
import { getAuth as firebaseGetAuth } from "firebase/auth"; // Renamed to avoid conflict
import type { Firestore } from "firebase/firestore";
import { getFirestore as firebaseGetFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Log startup information
console.log("--- Firebase Config Initialization (src/config/firebase.ts) ---");
const executionEnv = typeof window === 'undefined' ? 'Server-side/Build-time' : 'Client-side';
console.log(`Environment: ${executionEnv}`);
console.log(`Attempting to use environment variables for Firebase config.`);
console.log(`Project ID (from env): ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING or not public'}`);
console.log(`Auth Domain (from env): ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING or not public'}`);
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.error("NEXT_PUBLIC_FIREBASE_API_KEY is MISSING, empty, or not prefixed with NEXT_PUBLIC_ in the environment.");
}
console.log("-------------------------------------------------");

// Check for required environment variables before initializing Firebase
// These keys correspond to the firebaseConfig object above.
const essentialFirebaseConfigKeys: Array<keyof typeof firebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

for (const key of essentialFirebaseConfigKeys) {
  if (!firebaseConfig[key]) {
    // Construct the expected environment variable name
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
    const errorMessage = `CRITICAL Firebase Config Error: Firebase config key "${key}" (expected from env var ${envVarName}) is missing or empty. Ensure all NEXT_PUBLIC_FIREBASE_ environment variables are set correctly in your project environment (e.g., Vercel/Firebase Studio settings or .env.local for local development).`;
    console.error(errorMessage);
    // This error will halt execution if a required var is missing.
    throw new Error(errorMessage);
  }
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analyticsInstance: Analytics | undefined;
let persistenceEnabled = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully using environment variables.");
  } else {
    app = getApp();
    console.log("Using existing Firebase app instance.");
  }
} catch (e: any) {
  const criticalErrorMessage = `CRITICAL Firebase Error during app initialization (initializeApp). This often means the Firebase config values (API Key, Project ID, etc.) are incorrect or missing. Please verify your environment variables. Original Error: ${e.message}`;
  console.error(criticalErrorMessage);
  throw new Error(criticalErrorMessage);
}

try {
  auth = firebaseGetAuth(app);
  db = firebaseGetFirestore(app);
  console.log("Firebase Auth and Firestore services obtained successfully.");
} catch (e: any) {
  // This is the error you are seeing. It means 'app' was initialized with an invalid API key.
  const serviceInitErrorMessage = `CRITICAL Firebase Error during getAuth() or getFirestore(). Error: ${e.message}. This usually indicates an invalid API Key or other misconfiguration in the Firebase project setup or environment variables.`;
  console.error(serviceInitErrorMessage);
  throw new Error(serviceInitErrorMessage);
}


// Client-side specific initializations
if (typeof window !== 'undefined') {
  console.log("Firebase config: Client-side. Attempting Analytics and Persistence setup.");
  isAnalyticsSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) {
      try {
          analyticsInstance = getAnalytics(app);
          console.log("Firebase Analytics initialized (client-side).");
      } catch (e) {
          console.warn("Firebase Analytics could not be initialized (getAnalytics error on client).", e);
          analyticsInstance = undefined;
      }
    } else if (firebaseConfig.measurementId) {
      console.warn("Firebase: Analytics is NOT supported on this browser, or measurementId is missing; Analytics will not be initialized (client-side).");
      analyticsInstance = undefined;
    } else {
      console.log("Firebase: No measurementId provided in config, Analytics will not be initialized (client-side).")
      analyticsInstance = undefined;
    }
  }).catch(e => {
    console.warn("Firebase Analytics support check failed or getAnalytics errored (client-side).", e);
    analyticsInstance = undefined;
  });

  if (!persistenceEnabled) {
    enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
      .then(() => {
        persistenceEnabled = true;
        console.log("Firebase Firestore: Offline persistence ENABLED SUCCESSFULLY (client-side).");
      })
      .catch((err: any) => {
        if (err.code === 'failed-precondition') {
          console.warn("Firebase Firestore: Offline persistence FAILED (failed-precondition on client). Usually means multiple tabs are open or persistence already enabled. Assuming active elsewhere.");
          persistenceEnabled = true;
        } else if (err.code === 'unimplemented') {
          console.warn("Firebase Firestore: Offline persistence FAILED (unimplemented on client). Browser doesn't support required features.");
        } else {
          console.error("Firebase Firestore: Offline persistence FAILED with an unexpected error (client-side): ", err);
        }
      });
  }
} else {
  analyticsInstance = undefined;
  console.log("Firebase config: Server-side/Build-time. Analytics and client-side persistence setup skipped.");
}

export { app, auth, db, analyticsInstance as analytics };
