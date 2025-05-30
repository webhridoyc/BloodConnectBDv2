
// Import the functions you need from the SDKs you need
import type { FirebaseApp } from "firebase/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import type { Auth } from "firebase/auth";
import { getAuth as firebaseGetAuth } from "firebase/auth"; // Renamed to avoid conflict
import type { Firestore } from "firebase/firestore";
import { getFirestore as firebaseGetFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

// --- START: Firebase Configuration ---
// Your web app's Firebase configuration (Hardcoded as per user request for local development troubleshooting)
// WARNING: Hardcoding credentials is NOT SECURE for production.
// For deployment, you MUST use environment variables set in your hosting provider.
const firebaseConfig = {
  apiKey: "AIzaSyD4GmyGHApoFuZZV48btnyLLaAaLKrryhA",
  authDomain: "bloodconnectbd.firebaseapp.com",
  projectId: "bloodconnectbd",
  storageBucket: "bloodconnectbd.firebasestorage.app",
  messagingSenderId: "87550285201",
  appId: "1:87550285201:web:25286806971f860d76f630",
  measurementId: "G-L9XFJLP6C9"
};

console.log("--- Firebase Config (src/config/firebase.ts) ---");
console.log("Using HARDCODED firebaseConfig. Ensure these values are correct for your project.");
console.log("API Key used:", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + "..." : "MISSING/INVALID");
console.log("Project ID used:", firebaseConfig.projectId);
console.log("Auth Domain used:", firebaseConfig.authDomain);
console.log("-------------------------------------------------");


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analyticsInstance: Analytics | undefined;
let persistenceEnabled = false; // Flag to attempt enabling persistence only once

// Initialize Firebase
// This block will run on both server and client.
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully with hardcoded config.");
  } catch (e: any) {
    const criticalErrorMessage = `CRITICAL Firebase Error during initializeApp with hardcoded config. Provided config: ${JSON.stringify(firebaseConfig)}. Error: ${e.message}`;
    console.error(criticalErrorMessage);
    // This error will be thrown, potentially causing an Internal Server Error if on server-side.
    throw new Error(criticalErrorMessage);
  }
} else {
  app = getApp();
  console.log("Firebase app already initialized, using existing app instance (potentially with old config if not restarted after changes).");
}

// Initialize Auth and Firestore services
// This block will also run on both server and client.
try {
  auth = firebaseGetAuth(app);
  db = firebaseGetFirestore(app);
  console.log("Firebase Auth and Firestore services obtained successfully.");
} catch (e: any) {
  const serviceInitErrorMessage = `CRITICAL Firebase Error during getAuth() or getFirestore() with hardcoded config. Error: ${e.message}`;
  console.error(serviceInitErrorMessage);
  // This error will be thrown, potentially causing an Internal Server Error if on server-side.
  throw new Error(serviceInitErrorMessage);
}


// Client-side specific initializations
if (typeof window !== 'undefined') {
  console.log("Firebase config: Running on client-side. Attempting Analytics and Persistence setup.");
  // Initialize Analytics only on the client and if supported
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

  // Enable Firestore offline persistence only on the client and only once
  if (!persistenceEnabled) {
    enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
      .then(() => {
        persistenceEnabled = true;
        console.log("Firebase Firestore: Offline persistence ENABLED SUCCESSFULLY (client-side).");
      })
      .catch((err: any) => {
        if (err.code === 'failed-precondition') {
          console.warn("Firebase Firestore: Offline persistence FAILED (failed-precondition on client). Usually means multiple tabs are open or persistence already enabled. Assuming active elsewhere.");
          persistenceEnabled = true; // Assume it's fine if this specific error occurs
        } else if (err.code === 'unimplemented') {
          console.warn("Firebase Firestore: Offline persistence FAILED (unimplemented on client). Browser doesn't support required features.");
        } else {
          console.error("Firebase Firestore: Offline persistence FAILED with an unexpected error (client-side): ", err);
        }
      });
  }
} else {
  // Server-side: No analytics, no client-side persistence
  analyticsInstance = undefined;
  console.log("Firebase config: Running on server-side. Analytics and client-side persistence setup skipped.");
}

export { app, auth, db, analyticsInstance as analytics };
