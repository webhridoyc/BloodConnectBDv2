
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
  storageBucket: "bloodconnectbd.firebasestorage.app", // Corrected from .firebasestorage.app to .appspot.com if it's a standard Firebase bucket
  messagingSenderId: "87550285201",
  appId: "1:87550285201:web:25286806971f860d76f630",
  measurementId: "G-L9XFJLP6C9"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;
let persistenceEnabled = false; // Flag to ensure persistence is enabled only once

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    try {
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
    db = firebaseGetFirestore(app);
    if (!persistenceEnabled) {
      enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
        .then(() => {
          persistenceEnabled = true;
          console.log("Firebase Firestore offline persistence enabled successfully.");
        })
        .catch((err) => {
          if (err.code == 'failed-precondition') {
            console.warn("Firestore offline persistence failed (failed-precondition): Usually means multiple tabs are open or persistence was already enabled. Offline capabilities might be limited or rely on existing state.");
            persistenceEnabled = true; 
          } else if (err.code == 'unimplemented') {
            console.warn("Firestore offline persistence failed (unimplemented): The current browser does not support all of the features required to enable persistence. Offline capabilities will be unavailable.");
          } else {
            console.error("Firestore offline persistence failed with an unexpected error: ", err);
          }
        });
    }
  } else {
    app = getApp();
    if (!analytics && firebaseConfig.measurementId) { 
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
  // Server-side initialization
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = firebaseGetAuth(app);
  db = firebaseGetFirestore(app);
  analytics = undefined; // Analytics not typically used server-side in this context
}

export { app, auth, db, analytics };
