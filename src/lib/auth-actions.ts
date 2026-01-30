'use server';

import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Zod schema for registration
export const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  role: z.enum(['client', 'owner'], {
    required_error: 'Você deve selecionar uma função.',
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export async function registerUser(values: RegisterInput) {
  'use server';
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
    // Handle Firebase Auth errors
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este e-mail já está em uso.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'A senha é muito fraca.';
    }
    console.error('Registration Error:', error);
    return { success: false, error: errorMessage };
  }
}

// Zod schema for login
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export async function loginUser(values: LoginInput) {
  'use server';
  try {
    const { auth, firestore } = initializeFirebase();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    const user = userCredential.user;

    // Get user role from Firestore
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User profile not found in Firestore.");
    }
    
    const role = userDoc.data().role;

    return { success: true, userId: user.uid, role };
  } catch (error: any) {
    let errorMessage = 'Ocorreu um erro desconhecido ao tentar fazer login.';
     if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = 'E-mail ou senha inválidos.';
    }
    console.error('Login Error:', error);
    return { success: false, error: errorMessage };
  }
}
