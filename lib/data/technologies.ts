import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import type { Technology } from "@/types/technology";
import { firebaseDb } from "@/lib/firebase/firestore";

const technologiesCollection = collection(firebaseDb, "technologies");

export async function getTechnologies(): Promise<Technology[]> {
  const technologiesQuery = query(
    technologiesCollection,
    orderBy("ranking", "asc"),
  );

  const snapshot = await getDocs(technologiesQuery);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Technology[];
}