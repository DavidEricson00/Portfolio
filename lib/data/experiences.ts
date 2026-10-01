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
  ExperienceDocument,
  ExperienceInput,
  ExperienceWithTechnologies,
} from "@/types/experience";
import type { Technology } from "@/types/technology";

import { firebaseDb } from "@/lib/firebase/firestore";
import { getTechnologies } from "./technologies";

const experiencesCollection = collection(firebaseDb, "experiences");

async function getTechnologiesMap(): Promise<Map<string, Technology>> {
  const technologies = await getTechnologies();

  return new Map(
    technologies.map((technology) => [technology.id, technology]),
  );
}

function resolveExperience(
  document: ExperienceDocument & { id: string },
  technologiesById: Map<string, Technology>,
): ExperienceWithTechnologies {
  const technologies = document.technologyIds
    .map((id) => technologiesById.get(id))
    .filter(
      (technology): technology is Technology => Boolean(technology),
    )
    .sort(
      (a, b) => (b.ranking ?? 0) - (a.ranking ?? 0),
    );

  return {
    ...document,
    technologies,
  };
}

export async function getExperiences(): Promise<
  ExperienceWithTechnologies[]
> {
  const experiencesQuery = query(
    experiencesCollection,
    orderBy("startDate", "asc"),
  );

  const snapshot = await getDocs(experiencesQuery);
  const technologiesById = await getTechnologiesMap();

  return snapshot.docs.map((document) => {
    const data = document.data() as ExperienceDocument;

    return resolveExperience(
      {
        ...data,
        id: document.id,
      },
      technologiesById,
    );
  });
}

export async function getExperience(
  id: string,
): Promise<ExperienceWithTechnologies | null> {
  const experienceRef = doc(firebaseDb, "experiences", id);
  const snapshot = await getDoc(experienceRef);

  if (!snapshot.exists()) {
    return null;
  }

  const technologiesById = await getTechnologiesMap();

  return resolveExperience(
    {
      id: snapshot.id,
      ...snapshot.data(),
    } as ExperienceDocument & { id: string },
    technologiesById,
  );
}

export async function createExperience(
  id: string,
  data: ExperienceInput,
): Promise<void> {
  const experienceRef = doc(
    firebaseDb,
    "experiences",
    id,
  );

  await setDoc(experienceRef, data);
}

export async function updateExperience(
  id: string,
  data: Partial<ExperienceInput>,
): Promise<void> {
  const experienceRef = doc(
    firebaseDb,
    "experiences",
    id,
  );

  await updateDoc(experienceRef, data);
}

export async function deleteExperience(
  id: string,
): Promise<void> {
  const experienceRef = doc(
    firebaseDb,
    "experiences",
    id,
  );

  await deleteDoc(experienceRef);
}