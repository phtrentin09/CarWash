'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { doc, getDoc } from 'firebase/firestore';
import { User as AppUser } from '@/lib/types';

export type AuthenticatedUser = Omit<AppUser, 'email'> & {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
};

export function useAuth() {
  const { auth, firestore, user: firebaseUser, isUserLoading, userError } = useFirebase();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Load Firestore user profile
  useEffect(() => {
    async function fetchProfile() {
      if (!firestore || !firebaseUser) {
        setUserProfile(null);
        setIsProfileLoading(false);
        return;
      }

      try {
        const ref = doc(firestore, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setUserProfile(snap.data() as AppUser);
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setUserProfile(null);
      } finally {
        setIsProfileLoading(false);
      }
    }

    fetchProfile();
  }, [firestore, firebaseUser]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const mergedUser: AuthenticatedUser | null = useMemo(() => {
    if (!firebaseUser || !userProfile) return null;

    // Remove uid do profile (se existir) para evitar conflito
    const { uid: _removedUid, ...cleanProfile } = userProfile;

    return {
      ...cleanProfile,
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? null, // <- garante tipo correto
      emailVerified: firebaseUser.emailVerified,
      photoURL: firebaseUser.photoURL,
    };
  }, [firebaseUser, userProfile]);

  return {
    user: mergedUser,
    isAuthenticated: !!mergedUser,
    loading: isUserLoading || isProfileLoading,
    error: userError,
    signOut,
  };
}



