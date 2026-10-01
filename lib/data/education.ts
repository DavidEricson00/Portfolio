import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import type { Education } from "@/types/education";

import { firebaseDb } from "@/lib/firebase/firestore";

const educationCollection = collection(
  firebaseDb,
  "education",
);

function parseEducationDate(date?: string): number {
  if (!date) {
    return Infinity;
  }

  const [month, year] = date.split("/").map(Number);

  return new Date(year, month - 1).getTime();
}

export async function getEducations(): Promise<Education[]> {
  const snapshot = await getDocs(educationCollection);

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...document.data(),
    }) as Education)
    .sort(
      (a, b) =>
        parseEducationDate(b.endDate) -
        parseEducationDate(a.endDate),
    );
}

export async function getEducation(
  id: string,
): Promise<Education | null> {
  const educationRef = doc(
    firebaseDb,
    "education",
    id,
  );

  const snapshot = await getDoc(educationRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Education;
}

export async function createEducation(
  id: string,
  data: Omit<Education, "id">,
): Promise<void> {
  const educationRef = doc(
    firebaseDb,
    "education",
    id,
  );

  await setDoc(educationRef, data);
}

export async function updateEducation(
  id: string,
  data: Partial<Omit<Education, "id">>,
): Promise<void> {
  const educationRef = doc(
    firebaseDb,
    "education",
    id,
  );

  await updateDoc(educationRef, data);
}

export async function deleteEducation(
  id: string,
): Promise<void> {
  const educationRef = doc(
    firebaseDb,
    "education",
    id,
  );

  await deleteDoc(educationRef);
}