
// Explicitly load .env variables for server-side, especially during build or when not using Next.js's built-in loading
// import dotenv from 'dotenv';
// const envConfig = dotenv.config();

// if (envConfig.error && process.env.NODE_ENV !== 'production') { // Don't throw error in production as env vars come from hosting
//   console.warn(
//     "Firebase Config: .env file not found or error loading it. This is okay if environment variables are set in the hosting environment.",
//     envConfig.error
//   );
// } else if (envConfig.parsed) {
//   console.log('Firebase Config: Successfully loaded .env file.');
// }


// Import the functions you need from the SDKs you need
import type { FirebaseApp} from "firebase/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import type { Analytics} from "firebase/analytics";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import type { Auth} from "firebase/auth";
import { getAuth as firebaseGetAuth } from "firebase/auth";
import type { Firestore} from "firebase/firestore";
import { getFirestore as firebaseGetFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

// ***************************************************************************************
// IMPORTANT: HARDCODED FIREBASE CONFIGURATION
// The Firebase configuration below is hardcoded. This is generally NOT recommended
// for production environments due to security risks (exposing API keys and other
// sensitive project details directly in the source code).
//
// For local development, this can work, but for deployment to Firebase App Hosting
// or any other hosting service, you MUST use environment variables.
//
// To use environment variables (recommended):
// 1. Create a `.env.local` file in the root of your project.
// 2. Add your Firebase config values to `.env.local` like this:
//    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
//    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
//    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
// 3. Then, in this file, you would read them like:
//    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//    // etc.
// 4. For Firebase App Hosting deployment, set these same environment variables
//    in the Firebase console for your App Hosting backend.
// ***************************************************************************************

const firebaseConfig = {
  apiKey: "AIzaSyD4GmyGHApoFuZZV48btnyLLaAaLKrryhA",
  authDomain: "bloodconnectbd.firebaseapp.com",
  projectId: "bloodconnectbd",
  storageBucket: "bloodconnectbd.appspot.com", // Corrected: usually ends with .appspot.com
  messagingSenderId: "87550285201",
  appId: "1:87550285201:web:25286806971f860d76f630",
  measurementId: "G-L9XFJLP6C9"
};

// Log that we are using hardcoded config (for awareness)
console.warn("Firebase Config: USING HARDCODED CONFIGURATION. This is not recommended for production. Ensure environment variables are used for deployment.");


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analyticsInstance: Analytics | undefined;
let persistenceEnabled = false;

if (typeof window !== 'undefined') {
  // Client-side initialization
  if (!getApps().length) {
    console.log("Firebase: Initializing new app instance (client-side)...");
    app = initializeApp(firebaseConfig);
    isAnalyticsSupported().then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        console.log("Firebase: Analytics is supported. Initializing Analytics...");
        try {
            analyticsInstance = getAnalytics(app);
            console.log("Firebase: Analytics initialized.");
        } catch (e) {
            console.warn("Firebase Analytics could not be initialized on new app instance (getAnalytics error).", e);
            analyticsInstance = undefined;
        }
      } else if (firebaseConfig.measurementId) {
        console.warn("Firebase: Analytics is NOT supported on this browser, or measurementId is missing; Analytics will not be initialized.");
        analyticsInstance = undefined;
      } else {
        console.warn("Firebase: measurementId is missing; Analytics will not be initialized.");
        analyticsInstance = undefined;
      }
    }).catch(e => {
      console.warn("Firebase Analytics support check failed or getAnalytics errored on new app instance.", e);
      analyticsInstance = undefined;
    });
  } else {
    console.log("Firebase: Getting existing app instance (client-side)...");
    app = getApp();
    if (!analyticsInstance) { // Check if analytics was already initialized
        isAnalyticsSupported().then((supported) => {
            if (supported && firebaseConfig.measurementId) {
                try {
                    console.log("Firebase: Analytics is supported. Attempting to re-initialize Analytics on existing app...");
                    analyticsInstance = getAnalytics(app);
                    console.log("Firebase: Analytics re-initialized.");
                } catch (e) {
                    console.warn("Firebase Analytics could not be re-initialized on existing app (getAnalytics error).", e);
                    analyticsInstance = undefined;
                }
            } else if (firebaseConfig.measurementId) {
                 console.warn("Firebase: Analytics is NOT supported on this browser, or measurementId is missing; Analytics will not be initialized on existing app.");
                 analyticsInstance = undefined;
            } else {
                console.warn("Firebase: measurementId is missing; Analytics will not be initialized on existing app.");
                analyticsInstance = undefined;
            }
        }).catch(e => {
             console.warn("Firebase Analytics support check failed or getAnalytics errored on existing app.", e);
             analyticsInstance = undefined;
        });
    }
  }
  auth = firebaseGetAuth(app);
  db = firebaseGetFirestore(app);

  if (!persistenceEnabled) {
    console.log("Firebase Firestore: Attempting to enable offline persistence...");
    enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
      .then(() => {
        persistenceEnabled = true;
        console.log("Firebase Firestore: Offline persistence ENABLED SUCCESSFULLY.");
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn("Firebase Firestore: Offline persistence FAILED (failed-precondition). Usually means multiple tabs are open or persistence already enabled. Assuming active elsewhere.");
          persistenceEnabled = true; // Assume active to prevent repeated attempts
        } else if (err.code === 'unimplemented') {
          console.warn("Firebase Firestore: Offline persistence FAILED (unimplemented). Browser doesn't support required features.");
        } else {
          console.error("Firebase Firestore: Offline persistence FAILED with an unexpected error: ", err);
        }
      });
  } else {
    console.log("Firebase Firestore: Offline persistence was already attempted/active in this session.");
  }

} else {
  // Server-side initialization
  console.log("Firebase: Initializing app instance (server-side)...");
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = firebaseGetAuth(app);
  db = firebaseGetFirestore(app);
  // Analytics is not typically used server-side for page tracking in this manner
  analyticsInstance = undefined; 
  console.log("Firebase: App initialized (server-side). Firestore persistence is not applicable here.");
}

export { app, auth, db, analyticsInstance as analytics };
