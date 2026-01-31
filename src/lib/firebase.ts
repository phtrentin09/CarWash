// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 SUA CONFIG DO FIREBASE (aquela que você pegou no console)
const firebaseConfig = {
  apiKey: "AIzaSyDlH9RMviJETySOwboq_i2YGiGL6dgZrYQ",
  authDomain: "studio-1013901750-3bbd2.firebaseapp.com",
  projectId: "studio-1013901750-3bbd2",
  storageBucket: "studio-1013901750-3bbd2.firebasestorage.app",
  messagingSenderId: "465432268517",
  appId: "1:465432268517:web:e48f6751c3a41aef608e0c"
};

// 🔥 Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Exporta serviços principais
export const auth = getAuth(app);
export const db = getFirestore(app);

// (export default opcional)
export default app;



