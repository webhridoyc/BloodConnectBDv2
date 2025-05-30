
// Explicitly load .env variables for server-side, especially during build or when not using Next.js's built-in loading
// import dotenv from 'dotenv';
// const envConfig = dotenv.config({ path: '.env.local' }); // Ensure .env.local is prioritized if it exists

// console.log('--- Firebase Config Debug (Top of file) ---');
// if (envConfig.error) {
//   console.warn(
//     "Firebase Config: .env.local file not found by explicit dotenv.config() or error loading it. This is okay if Next.js internal loading is working or if env vars are set in the hosting environment.",
//     envConfig.error.message // Log only the message to avoid too much verbosity
//   );
// } else if (envConfig.parsed) {
//   console.log('Firebase Config: Successfully loaded .env.local file via explicit dotenv.config().');
//   // console.log('Parsed env vars by dotenv:', envConfig.parsed); // Optionally log all parsed vars
// } else {
//   console.log('Firebase Config: dotenv.config() ran but did not parse any variables (envConfig.parsed is null/undefined). This might be okay if using built-in Next.js env loading.');
// }

// Log the values of environment variables for debugging (SERVER-SIDE)
// These logs will appear in your Next.js development server terminal.
console.log('--- Firebase Config Debug (SERVER-SIDE START) ---');
console.log('Attempting to read from process.env:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY =', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID =', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log('NEXT_PUBLIC_FIREBASE_APP_ID =', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
console.log('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID =', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
console.log('--- Firebase Config Debug (SERVER-SIDE END) ---');


// Import the functions you need from the SDKs you need
import type { FirebaseApp} from "firebase/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import type { Analytics} from "firebase/analytics";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import type { Auth} from "firebase/auth";
import { getAuth as firebaseGetAuth } from "firebase/auth";
import type { Firestore} from "firebase/firestore";
import { getFirestore as firebaseGetFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Check for missing critical Firebase config values
const missingConfigKeys: string[] = [];
if (!firebaseConfig.apiKey) missingConfigKeys.push("NEXT_PUBLIC_FIREBASE_API_KEY");
if (!firebaseConfig.projectId) missingConfigKeys.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
if (!firebaseConfig.authDomain) missingConfigKeys.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
// Add other essential keys if needed, e.g., appId, storageBucket if they are critical for startup

if (missingConfigKeys.length > 0) {
  const errorMessage =
    `CRITICAL Firebase Config Error: The following Firebase configuration variable(s) are undefined or invalid: [${missingConfigKeys.join(", ")}]. ` +
    "Please CHECK YOUR SERVER TERMINAL LOGS for the (SERVER-SIDE) values printed just above this error message. " +
    "Then, ensure these variables are correctly set in your .env.local file (located in the project root directory) for local development, or in your Firebase App Hosting environment configuration for deployment, " +
    "and that you have RESTARTED your Next.js development server after making changes to .env.local. " +
    "Firebase services cannot be initialized.";
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error(errorMessage);
  console.error("Firebase config object based on current env vars:", firebaseConfig);
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  // Throw a clear error to stop initialization if critical config is missing.
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
        // measurementId is optional, so this is not a warning if it's missing.
        // console.log("Firebase: measurementId is missing; Analytics will not be initialized.");
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
                // measurementId is optional
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
          persistenceEnabled = true; // Assume active to prevent repeated attempts in the same session
        } else if (err.code === 'unimplemented') {
          console.warn("Firebase Firestore: Offline persistence FAILED (unimplemented). Browser doesn't support required features.");
        } else {
          console.error("Firebase Firestore: Offline persistence FAILED with an unexpected error: ", err);
        }
      });
  } else {
    // console.log("Firebase Firestore: Offline persistence was already attempted/active in this session.");
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
