
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth as firebaseGetAuth, type Auth } from "firebase/auth";
import { getFirestore as firebaseGetFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

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

// Initialize Firebase
// It's important that app, auth, and db are declared before being exported.
// The getApps().length check prevents re-initializing the app on hot reloads.
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined; // Analytics can be optional

if (typeof window !== 'undefined') { // Ensure Firebase is initialized only on the client-side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    // Check if Analytics is supported by the browser before initializing
    // This is a good practice, though getAnalytics often handles this gracefully
    try {
      analytics = getAnalytics(app);
    } catch (e) {
      console.warn("Firebase Analytics could not be initialized.", e);
      analytics = undefined;
    }
  } else {
    app = getApp();
    // If app was already initialized, try to get analytics instance if not already set
    if (!analytics) {
        try {
            analytics = getAnalytics(app);
        } catch(e) {
            console.warn("Firebase Analytics could not be re-initialized on existing app.", e);
            analytics = undefined;
        }
    }
  }
  auth = firebaseGetAuth(app);
  db = firebaseGetFirestore(app);
} else {
  // Server-side initialization or mock if needed for SSR without client Firebase
  // For this app structure, client-side initialization is primary.
  // If using Firebase Admin SDK on server, that would be separate.
  // For now, provide stubs or handle differently if SSR needs them before hydration.
  // However, since AuthProvider is client-side, these might not be strictly needed on server
  // before client hydration kicks in.
  // To avoid errors if these are imported in server components that don't use them:
  if (!getApps().length) {
    app = initializeApp(firebaseConfig); // Initialize for server context if no app exists
  } else {
    app = getApp();
  }
  auth = firebaseGetAuth(app); // Can be initialized on server too, but client interaction is key
  db = firebaseGetFirestore(app);
}


export { app, auth, db, analytics };

