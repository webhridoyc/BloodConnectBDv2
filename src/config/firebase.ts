
// Import the functions you need from the SDKs you need
import type { FirebaseApp } from "firebase/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import type { Auth } from "firebase/auth";
import { getAuth as firebaseGetAuth } from "firebase/auth"; // Renamed to avoid conflict
import type { Firestore } from "firebase/firestore";
import { getFirestore as firebaseGetFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

// Your web app's Firebase configuration (Hardcoded)
// WARNING: Hardcoding credentials is NOT SECURE for production.
// Use environment variables for deployed applications.
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
// initializeApp is safe to call multiple times if the app is already initialized from the same config.
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully with hardcoded config.");
  } catch (e) {
    console.error("CRITICAL Firebase Error during initializeApp with hardcoded config:", e);
    // If initializeApp itself fails with hardcoded values, something is fundamentally wrong
    // with the provided config object (e.g., malformed, truly invalid values not caught by basic checks).
    throw new Error("Firebase core initialization failed with hardcoded config. Check console for FirebaseError details.");
  }
} else {
  app = getApp();
  console.log("Firebase app already initialized, using existing app instance.");
}

try {
  auth = firebaseGetAuth(app);
  db = firebaseGetFirestore(app);
} catch (e) {
  console.error("CRITICAL Firebase Error during getAuth() or getFirestore() with hardcoded config:", e);
  throw new Error("Firebase service (Auth/Firestore) initialization failed. Check console for FirebaseError details.");
}


// Client-side specific initializations
if (typeof window !== 'undefined') {
  // Initialize Analytics only on the client and if supported
  isAnalyticsSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) {
      try {
          analyticsInstance = getAnalytics(app);
          console.log("Firebase Analytics initialized.");
      } catch (e) {
          console.warn("Firebase Analytics could not be initialized (getAnalytics error).", e);
          analyticsInstance = undefined;
      }
    } else if (firebaseConfig.measurementId) {
      console.warn("Firebase: Analytics is NOT supported on this browser, or measurementId is missing; Analytics will not be initialized.");
      analyticsInstance = undefined;
    } else {
      // No measurementId provided
      analyticsInstance = undefined;
    }
  }).catch(e => {
    console.warn("Firebase Analytics support check failed or getAnalytics errored.", e);
    analyticsInstance = undefined;
  });

  // Enable Firestore offline persistence only on the client and only once
  if (!persistenceEnabled) {
    enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
      .then(() => {
        persistenceEnabled = true;
        console.log("Firebase Firestore: Offline persistence ENABLED SUCCESSFULLY.");
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn("Firebase Firestore: Offline persistence FAILED (failed-precondition). Usually means multiple tabs are open or persistence already enabled. Assuming active elsewhere.");
          persistenceEnabled = true; // Assume it's fine if this specific error occurs
        } else if (err.code === 'unimplemented') {
          console.warn("Firebase Firestore: Offline persistence FAILED (unimplemented). Browser doesn't support required features.");
        } else {
          console.error("Firebase Firestore: Offline persistence FAILED with an unexpected error: ", err);
        }
      });
  }
} else {
  // Server-side: No analytics
  analyticsInstance = undefined;
}

export { app, auth, db, analyticsInstance as analytics };
