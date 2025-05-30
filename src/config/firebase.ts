
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth as firebaseGetAuth, type Auth } from "firebase/auth";
import { getFirestore as firebaseGetFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4GmyGHApoFuZZV48btnyLLaAaLKrryhA",
  authDomain: "bloodconnectbd.firebaseapp.com",
  projectId: "bloodconnectbd",
  storageBucket: "bloodconnectbd.firebasestorage.app",
  messagingSenderId: "87550285201",
  appId: "1:87550285201:web:25286806971f860d76f630",
  measurementId: "G-L9XFJLP6C9" // Including this as provided, though it's optional
};

// Initialize Firebase
// It's important that app, auth, and db are declared before being exported.
// The getApps().length check prevents re-initializing the app on hot reloads.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = firebaseGetAuth(app);
const db: Firestore = firebaseGetFirestore(app);

export { app, auth, db };
