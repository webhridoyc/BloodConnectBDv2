
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { auth, db } from "@/config/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
// LoadingSpinner is no longer rendered directly by AuthProvider
// import { LoadingSpinner } from "@/components/core/LoadingSpinner";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean; // This will represent if auth state resolution is ongoing
  error: Error | null;
  signOut: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // True until first onAuthStateChanged completes
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // setLoading(true); // Already true initially, not needed here
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
              // Create a basic profile if it doesn't exist
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                isDonor: false,
              };
              await setDoc(userDocRef, newProfile);
              setUserProfile(newProfile);
            }
          } catch (e) {
            console.error("Error fetching user profile:", e);
            setError(e as Error);
            setUserProfile(null); // Reset profile on error
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false); // Auth state resolved (or failed)
      },
      (e) => {
        console.error("Auth state change error:", e);
        setError(e);
        setUser(null);
        setUserProfile(null);
        setLoading(false); // Auth state resolution failed
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
        // Ensure donorRegistrationTime is set if isDonor becomes true and it's not already set
        const updateData = { ...profileData };
        if (profileData.isDonor && !userProfile?.donorRegistrationTime) {
          updateData.donorRegistrationTime = serverTimestamp();
        }
        await setDoc(userDocRef, updateData, { merge: true });
        setUserProfile(prev => ({ ...prev, ...updateData, uid: user.uid } as UserProfile));
      } catch (e) {
        console.error("Error updating user profile:", e);
        setError(e as Error);
        throw e; // Re-throw to be caught by caller
      }
    } else {
      const e = new Error("User not authenticated for profile update.");
      console.error(e.message);
      setError(e);
      throw e;
    }
  }, [user, userProfile]);

  const value = useMemo(
    () => ({ user, userProfile, loading, error, signOut, updateUserProfile }),
    [user, userProfile, loading, error, signOut, updateUserProfile]
  );

  // AuthProvider will now always render its children.
  // The loading state is passed via context for consumers to decide how to render.
  // This removes the conditional rendering of a global spinner within AuthProvider itself,
  // which was the source of the hydration mismatch.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
