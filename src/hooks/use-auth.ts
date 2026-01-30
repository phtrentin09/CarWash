'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import { useDoc, useMemoFirebase } from '@/firebase/firestore/use-doc';
import { User as AppUser } from '@/lib/types';

// Extend the AppUser to include what Firebase Auth provides
export type AuthenticatedUser = AppUser & {
    emailVerified: boolean;
    photoURL: string | null;
}

export function useAuth() {
  const { auth, firestore, user: firebaseUser, isUserLoading, userError } = useFirebase();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !firebaseUser) return null;
    return doc(firestore, 'users', firebaseUser.uid);
  }, [firestore, firebaseUser]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<AppUser>(userDocRef);

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      // Redirect to home page after sign out to clear state
      router.push('/');
    }
  };

  const user = useMemo(() => {
    if (!firebaseUser || !userProfile) return null;
    
    return {
      // From Firebase Auth
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      photoURL: firebaseUser.photoURL,
      // From Firestore 'users' collection
      ...userProfile,
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
