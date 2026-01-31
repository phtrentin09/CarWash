// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 SUA CONFIG DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDlH9RMviJETySOwboq_i2YGiGL6dgZrYQ",
  authDomain: "studio-1013901750-3bbd2.firebaseapp.com",
  projectId: "studio-1013901750-3bbd2",
  storageBucket: "studio-1013901750-3bbd2.firebasestorage.app",
  messagingSenderId: "465432268517",
  appId: "1:465432268517:web:e48f6751c3a41aef608e0c"
};

// 🔥 Inicializa o Firebase de forma segura para o Next.js
// Se já existir um app inicializado, ele usa o existente. Se não, cria um novo.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 🔥 Exporta serviços principais vinculados à instância correta
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;



