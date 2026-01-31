import { initializeFirebase } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import type { RegisterInput } from '@/lib/auth-schemas';

export async function register(values: RegisterInput) {
  try {
    const { auth, firestore } = initializeFirebase();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );

    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(firestore, 'users', user.uid), {
      uid: user.uid,
      name: values.name,
      email: values.email,
      role: values.role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, userId: user.uid };
  } catch (error: any) {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este e-mail já está em uso.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'A senha é muito fraca.';
    }

    console.error('Registration Error (client):', error);
    return { success: false, error: errorMessage };
  }
}
