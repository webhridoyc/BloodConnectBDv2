
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

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4GmyGHApoFuZZV48btnyLLaAaLKrryhA",
  authDomain: "bloodconnectbd.firebaseapp.com",
  projectId: "bloodconnectbd",
  storageBucket: "bloodconnectbd.appspot.com", // Assuming this was corrected to .appspot.com previously
  messagingSenderId: "87550285201",
  appId: "1:87550285201:web:25286806971f860d76f630",
  measurementId: "G-L9XFJLP6C9"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analyticsInstance: Analytics | undefined; // Renamed to avoid conflict
let persistenceEnabled = false; // Flag to ensure persistence is enabled only once

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (!getApps().length) {
    console.log("Firebase: Initializing new app instance (client-side)...");
    app = initializeApp(firebaseConfig);
    try {
      if (firebaseConfig.measurementId) {
        console.log("Firebase: Attempting to initialize Analytics...");
        analyticsInstance = getAnalytics(app);
        console.log("Firebase: Analytics initialized.");
      } else {
        console.warn("Firebase Analytics measurementId is missing; Analytics will not be initialized.");
        analyticsInstance = undefined;
      }
    } catch (e) {
      console.warn("Firebase Analytics could not be initialized on new app instance.", e);
      analyticsInstance = undefined;
    }
  } else {
    console.log("Firebase: Getting existing app instance (client-side)...");
    app = getApp();
    if (!analyticsInstance && firebaseConfig.measurementId) {
        try {
            console.log("Firebase: Attempting to re-initialize Analytics on existing app...");
            analyticsInstance = getAnalytics(app);
            console.log("Firebase: Analytics re-initialized.");
        } catch(e) {
            console.warn("Firebase Analytics could not be re-initialized on existing app.", e);
            analyticsInstance = undefined;
        }
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
          console.warn("Firebase Firestore: Offline persistence FAILED (failed-precondition). This usually means multiple tabs are open, or persistence was already enabled in another tab. Offline capabilities might be limited or rely on existing state. Assuming persistence is active in another context.");
          persistenceEnabled = true; // Set to true to prevent repeated attempts if another tab holds the lock.
        } else if (err.code === 'unimplemented') {
          console.warn("Firebase Firestore: Offline persistence FAILED (unimplemented). The current browser does not support all features required for persistence. Offline capabilities will be unavailable.");
        } else {
          console.error("Firebase Firestore: Offline persistence FAILED with an unexpected error: ", err);
        }
      });
  } else {
    console.log("Firebase Firestore: Offline persistence was already attempted (or assumed active) in this session.");
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
  analyticsInstance = undefined; // Analytics not typically used server-side in this context
  console.log("Firebase: App initialized (server-side). Firestore persistence is not applicable server-side.");
}

export { app, auth, db, analyticsInstance as analytics };
