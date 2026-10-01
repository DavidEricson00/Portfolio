import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import type {
  Technology,
  TechnologyInput,
} from "@/types/technology";

import { firebaseDb } from "@/lib/firebase/firestore";

const technologiesCollection = collection(firebaseDb, "technologies");

export async function getTechnologies(): Promise<Technology[]> {
  const technologiesQuery = query(
    technologiesCollection,
    orderBy("ranking", "desc"),
  );

  const snapshot = await getDocs(technologiesQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Technology[];
}

export async function getTechnology(
  id: string,
): Promise<Technology | null> {
  const technologyRef = doc(firebaseDb, "technologies", id);
  const snapshot = await getDoc(technologyRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Technology;
}

export async function createTechnology(
  id: string,
  data: TechnologyInput,
): Promise<void> {
  const technologyRef = doc(firebaseDb, "technologies", id);

  await setDoc(technologyRef, data);
}

export async function updateTechnology(
  id: string,
  data: Partial<TechnologyInput>,
): Promise<void> {
  const technologyRef = doc(firebaseDb, "technologies", id);

  await updateDoc(technologyRef, data);
}

export async function deleteTechnology(
  id: string,
): Promise<void> {
  const technologyRef = doc(firebaseDb, "technologies", id);

  await deleteDoc(technologyRef);
}