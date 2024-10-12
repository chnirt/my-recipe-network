import { db } from "@/firebase/firebaseConfig";
import {
  doc,
  collection,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

export const getAllDocs = async (collectionName: string) => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getDocById = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) throw new Error("Document not found");
  return snapshot.data();
};

export const createDoc = async (collectionName: string, data: any) => {
  const collectionRef = collection(db, collectionName);
  return await addDoc(collectionRef, data);
};

export const updateDocById = async (
  collectionName: string,
  id: string,
  data: any,
) => {
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, data);
};

export const deleteDocById = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  return await deleteDoc(docRef);
};
