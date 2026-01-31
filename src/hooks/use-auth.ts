'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { User as AppUser } from '@/lib/types';

// Extend the AppUser to include firebase-auth fields
export type AuthenticatedUser = AppUser & {
  emailVerified: boolean;
  photoURL: string | null;
};

export function useAuth() {
  const { auth, firestore, user: firebaseUser, isUserLoading, userError } = useFirebase();
  const router = useRouter();

  // Build a reference to the user document in Firestore
  const userDocRef = useMemo(() => {
    if (!firestore || !firebaseUser) return null;
    return doc(firestore, 'users', firebaseUser.uid);
  }, [firestore, firebaseUser]);

  // Load user profile from Firestore
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<AppUser>(userDocRef);

  // SignOut handler
  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      router.push('/');
    }
  };

  // Merge Firebase Auth + Firestore profile cleanly
  const user = useMemo(() => {
    if (!firebaseUser || !userProfile) return null;

    return {
      ...userProfile, // Firestore fields first
      uid: firebaseUser.uid, // Firebase uid ALWAYS wins
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      photoURL: firebaseUser.photoURL,
    } as AuthenticatedUser;
  }, [firebaseUser, userProfile]);

  return {
    user,
    loading: isUserLoading || isProfileLoading,
    error: userError,
    isAuthenticated: !!user,
    signOut,
  };
}

