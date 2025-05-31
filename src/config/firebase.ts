
// Import the functions you need from the SDKs you need
import type { FirebaseApp } from "firebase/app";
import { initializeApp, getApp, getApps } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import type { Auth } from "firebase/auth";
import { getAuth as firebaseGetAuth } from "firebase/auth"; // Renamed to avoid conflict
import type { Firestore } from "firebase/firestore";
import { getFirestore as firebaseGetFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4GmyGHApoFuZZV48btnyLLaAaLKrryhA",
  authDomain: "bloodconnectbd.firebaseapp.com",
  projectId: "bloodconnectbd",
  storageBucket: "bloodconnectbd.firebasestorage.app",
  messagingSenderId: "87550285201",
  appId: "1:87550285201:web:25286806971f860d76f630",
  measurementId: "G-L9XFJLP6C9"
};

// Log startup information
console.log("--- Firebase Config Initialization (src/config/firebase.ts) ---");
const executionEnv = typeof window === 'undefined' ? 'Server-side/Build-time' : 'Client-side';
console.log(`Environment: ${executionEnv}`);
console.log("Attempting to use HARDCODED firebaseConfig. Ensure these values are correct for your project.");
console.log("API Key to be used:", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + "..." : "MISSING/INVALID in hardcoded config");
console.log("Project ID to be used:", firebaseConfig.projectId);
console.log("Auth Domain to be used:", firebaseConfig.authDomain);
console.log("-------------------------------------------------");

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analyticsInstance: Analytics | undefined;
let persistenceEnabled = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully with hardcoded config using initializeApp.");
  } else {
    app = getApp();
    console.log("Using existing Firebase app instance with hardcoded config.");
  }
} catch (e: any) {
  const criticalErrorMessage = `CRITICAL Firebase Error during app initialization (initializeApp or getApp) with hardcoded config. \nProvided config: ${JSON.stringify(firebaseConfig)}. \nError: ${e.message}\nStack: ${e.stack}`;
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error(criticalErrorMessage);
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  // For critical errors during Firebase App initialization, re-throwing is appropriate
  // as the app cannot function without a valid Firebase app instance.
  throw new Error(criticalErrorMessage);
}

try {
  auth = firebaseGetAuth(app);
  db = firebaseGetFirestore(app);
  console.log("Firebase Auth and Firestore services obtained successfully.");
} catch (e: any) {
    // This can happen if initializeApp succeeded (e.g. config object structure was fine)
    // but the specific services fail to initialize, often due to project setup issues
    // or if the API key is valid but doesn't have permissions for certain services.
    const serviceInitErrorMessage = `CRITICAL Firebase Error during getAuth() or getFirestore() with hardcoded config. \nError: ${e.message}\nStack: ${e.stack}`;
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error(serviceInitErrorMessage);
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
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
          persistenceEnabled = true; // Still set to true as it might be enabled in another tab.
        } else if (err.code === 'unimplemented') {
          console.warn("Firebase Firestore: Offline persistence FAILED (unimplemented on client). Browser doesn't support required features.");
        } else {
          console.error("Firebase Firestore: Offline persistence FAILED with an unexpected error (client-side): ", err);
        }
      });
  }
} else {
  analyticsInstance = undefined; // Ensure analyticsInstance is undefined on server
  console.log("Firebase config: Server-side/Build-time. Analytics and client-side persistence setup skipped.");
}

export { app, auth, db, analyticsInstance as analytics };
