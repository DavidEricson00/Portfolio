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
  where,
} from "firebase/firestore";

import type {
  Project,
  ProjectDocument,
  ProjectInput,
} from "@/types/project";
import type { Technology } from "@/types/technology";

import { firebaseDb } from "@/lib/firebase/firestore";
import { getTechnologies } from "./technologies";

const projectsCollection = collection(firebaseDb, "projects");

async function getTechnologiesMap(): Promise<
  Map<string, Technology>
> {
  const technologies = await getTechnologies();

  return new Map(
    technologies.map((technology) => [
      technology.id,
      technology,
    ]),
  );
}

function resolveProject(
  document: ProjectDocument & { id: string },
  technologiesById: Map<string, Technology>,
): Project {
  const technologies = document.technologyIds
    .map((id) => technologiesById.get(id))
    .filter(
      (technology): technology is Technology =>
        Boolean(technology),
    )
    .sort(
      (a, b) =>
        (b.ranking ?? 0) - (a.ranking ?? 0),
    );

  return {
    ...document,
    technologies,
  };
}

async function resolveProjectDocument(
  document: ProjectDocument & { id: string },
): Promise<Project> {
  const technologiesById = await getTechnologiesMap();

  return resolveProject(
    document,
    technologiesById,
  );
}

export async function getProjects(): Promise<Project[]> {
  const projectsQuery = query(
    projectsCollection,
    orderBy("ranking", "desc"),
  );

  const snapshot = await getDocs(projectsQuery);

  const technologiesById =
    await getTechnologiesMap();

  return snapshot.docs.map((document) => {
    const data =
      document.data() as ProjectDocument;

    return resolveProject(
      {
        ...data,
        id: document.id,
      },
      technologiesById,
    );
  });
}

export async function getProject(
  id: string,
): Promise<Project | null> {
  const projectRef = doc(
    firebaseDb,
    "projects",
    id,
  );

  const snapshot = await getDoc(projectRef);

  if (!snapshot.exists()) {
    return null;
  }

  return resolveProjectDocument({
    id: snapshot.id,
    ...snapshot.data(),
  } as ProjectDocument & {
    id: string;
  });
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  return getProject(slug);
}

export async function getFeaturedProjects(): Promise<
  Project[]
> {
  const projectsQuery = query(
    projectsCollection,
    where("featured", "==", true),
    orderBy("ranking", "desc"),
  );

  const snapshot = await getDocs(projectsQuery);

  const technologiesById =
    await getTechnologiesMap();

  return snapshot.docs.map((document) => {
    const data =
      document.data() as ProjectDocument;

    return resolveProject(
      {
        ...data,
        id: document.id,
      },
      technologiesById,
    );
  });
}

export async function createProject(
  id: string,
  data: ProjectInput,
): Promise<void> {
  const projectRef = doc(
    firebaseDb,
    "projects",
    id,
  );

  await setDoc(projectRef, data);
}

export async function updateProject(
  id: string,
  data: Partial<ProjectInput>,
): Promise<void> {
  const projectRef = doc(
    firebaseDb,
    "projects",
    id,
  );

  await updateDoc(projectRef, data);
}

export async function deleteProject(
  id: string,
): Promise<void> {
  const projectRef = doc(
    firebaseDb,
    "projects",
    id,
  );

  await deleteDoc(projectRef);
}