
"use client";

import type { User as FirebaseUser, UserCredential } from "firebase/auth";
import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { auth, db } from "@/config/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean; 
  error: Error | null;
  signOut: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setError(null);
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              setUserProfile(userDocSnap.data() as UserProfile);
            } else {
              // Create a basic profile if it doesn't exist (e.g., for new Google Sign-In users)
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                isDonor: false, 
                // photoURL: firebaseUser.photoURL, // You can add this if you extend UserProfile
              };
              await setDoc(userDocRef, newProfile);
              setUserProfile(newProfile);
            }
          } catch (e) {
            console.error("Error fetching/creating user profile:", e);
            setError(e as Error);
            setUserProfile(null); 
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false); 
      },
      (e) => {
        console.error("Auth state change error:", e);
        setError(e);
        setUser(null);
        setUserProfile(null);
        setLoading(false); 
      }
    );

    return () => unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (e) {
      console.error("Sign out error:", e);
      setError(e as Error);
    }
  }, []);
  
  const updateUserProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const updateData = { ...profileData };
        if (profileData.isDonor && !userProfile?.donorRegistrationTime) {
          updateData.donorRegistrationTime = serverTimestamp();
        }
        await setDoc(userDocRef, updateData, { merge: true });
        setUserProfile(prev => ({ ...prev, ...updateData, uid: user.uid } as UserProfile));
      } catch (e) {
        console.error("Error updating user profile:", e);
        setError(e as Error);
        throw e; 
      }
    } else {
      const e = new Error("User not authenticated for profile update.");
      console.error(e.message);
      setError(e);
      throw e;
    }
  }, [user, userProfile]);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest (setting user, profile, etc.)
    } catch (e) {
      console.error("Google Sign-In error in AuthContext:", e);
      setError(e as Error); // Set context error state
      throw e; // Re-throw to be caught by the UI component for toasts etc.
    }
  }, []);

  const value = useMemo(
    () => ({ user, userProfile, loading, error, signOut, updateUserProfile, signInWithGoogle }),
    [user, userProfile, loading, error, signOut, updateUserProfile, signInWithGoogle]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
