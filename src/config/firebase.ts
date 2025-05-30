
// Explicitly load .env.local for server-side, just in case Next.js internal loading needs a nudge,
// especially during build or when not using Next.js's built-in loading for all scenarios.
// However, Next.js should handle .env.local automatically for `process.env`.
// This line is more for robust debugging visibility if issues persist.
// import dotenv from 'dotenv';
// const envConfig = dotenv.config({ path: '.env.local' });

// console.log('--- Firebase Config Debug (Top of file, src/config/firebase.ts) ---');
// if (envConfig.error) {
//   console.warn(
//     "Firebase Config: .env.local file not found by explicit dotenv.config() or error loading it. This is okay if Next.js internal loading is working or if env vars are set in the hosting environment.",
//     envConfig.error.message
//   );
// } else if (envConfig.parsed) {
//   console.log('Firebase Config: Successfully loaded .env.local file via explicit dotenv.config().');
// } else {
//   console.log('Firebase Config: dotenv.config() ran but did not parse any variables. This might be okay if using built-in Next.js env loading.');
// }

// Log the values of environment variables for debugging (SERVER-SIDE)
// These logs will appear in your Next.js development server terminal.
// console.log('--- Firebase Config Debug (SERVER-SIDE START, src/config/firebase.ts) ---');
// console.log('Attempting to read from process.env:');
// console.log('NEXT_PUBLIC_FIREBASE_API_KEY =', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
// console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID =', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
// console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
// console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
// console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
// console.log('NEXT_PUBLIC_FIREBASE_APP_ID =', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
// console.log('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID =', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
// console.log('--- Firebase Config Debug (SERVER-SIDE END) ---');

import type { FirebaseApp} from "firebase/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import type { Analytics} from "firebase/analytics";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import type { Auth} from "firebase/auth";
import { getAuth as firebaseGetAuth } from "firebase/auth";
import type { Firestore} from "firebase/firestore";
import { getFirestore as firebaseGetFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

// Hardcoded Firebase configuration as provided by the user.
// IMPORTANT: For production, use environment variables set in your hosting provider.
const firebaseConfig = {
  apiKey: "AIzaSyD4GmyGHApoFuZZV48btnyLLaAaLKrryhA",
  authDomain: "bloodconnectbd.firebaseapp.com",
  projectId: "bloodconnectbd",
  storageBucket: "bloodconnectbd.firebasestorage.app", // Note: usually ends with .appspot.com
  messagingSenderId: "87550285201",
  appId: "1:87550285201:web:25286806971f860d76f630",
  measurementId: "G-L9XFJLP6C9"
};

// Check for missing critical Firebase configuration values from the hardcoded object
const missingConfigKeys: string[] = [];
if (!firebaseConfig.apiKey) missingConfigKeys.push('apiKey in firebaseConfig object');
if (!firebaseConfig.projectId) missingConfigKeys.push('projectId in firebaseConfig object');
if (!firebaseConfig.authDomain) missingConfigKeys.push('authDomain in firebaseConfig object');

if (missingConfigKeys.length > 0) {
  const errorMessage =
    `CRITICAL Firebase Config Error: The following Firebase configuration value(s) are missing or invalid in the hardcoded firebaseConfig object: [${missingConfigKeys.join(', ')}]. ` +
    "Please ensure these values are correctly set in the firebaseConfig object within src/config/firebase.ts. " +
    "Firebase services cannot be initialized.";
  
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error(errorMessage);
  console.error("Firebase config object being used:", firebaseConfig);
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  throw new Error(errorMessage);
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analyticsInstance: Analytics | undefined;
let persistenceEnabled = false; // Flag to attempt enabling persistence only once

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
        console.log("Firebase: measurementId not found in config, Analytics will not be initialized.");
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
                console.log("Firebase: measurementId not found in config, Analytics will not be initialized on existing app.");
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
          persistenceEnabled = true; 
        } else if (err.code === 'unimplemented') {
          console.warn("Firebase Firestore: Offline persistence FAILED (unimplemented). Browser doesn't support required features.");
        } else {
          console.error("Firebase Firestore: Offline persistence FAILED with an unexpected error: ", err);
        }
      });
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
  analyticsInstance = undefined; // Analytics is not typically used server-side in Next.js like this
  console.log("Firebase: App initialized (server-side). Firestore persistence is not applicable here.");
}

export { app, auth, db, analyticsInstance as analytics };
