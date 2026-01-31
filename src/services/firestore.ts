import { db } from "../lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

export async function getCollection(name: string) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getDocument(path: string) {
  const ref = doc(db, path);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function setDocument(path: string, data: any) {
  const ref = doc(db, path);
  return setDoc(ref, data, { merge: true });
}

export async function deleteDocument(path: string) {
  const ref = doc(db, path);
  return deleteDoc(ref);
}

