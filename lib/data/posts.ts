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

import type { Post } from "@/types/post";

import { firebaseDb } from "@/lib/firebase/firestore";

const postsCollection = collection(firebaseDb, "posts");

export async function getPosts(): Promise<Post[]> {
  const postsQuery = query(
    postsCollection,
    orderBy("date", "desc"),
  );

  const snapshot = await getDocs(postsQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Post[];
}

export async function getPost(
  id: string,
): Promise<Post | null> {
  const postRef = doc(
    firebaseDb,
    "posts",
    id,
  );

  const snapshot = await getDoc(postRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Post;
}

export async function getPostBySlug(
  slug: string,
): Promise<Post | null> {
  const postsQuery = query(
    postsCollection,
    where("slug", "==", slug),
  );

  const snapshot = await getDocs(postsQuery);

  if (snapshot.empty) {
    return null;
  }

  const document = snapshot.docs[0];

  return {
    id: document.id,
    ...document.data(),
  } as Post;
}

export async function createPost(
  id: string,
  data: Omit<Post, "id">,
): Promise<void> {
  const postRef = doc(
    firebaseDb,
    "posts",
    id,
  );

  await setDoc(postRef, data);
}

export async function updatePost(
  id: string,
  data: Partial<Omit<Post, "id">>,
): Promise<void> {
  const postRef = doc(
    firebaseDb,
    "posts",
    id,
  );

  await updateDoc(postRef, data);
}

export async function deletePost(
  id: string,
): Promise<void> {
  const postRef = doc(
    firebaseDb,
    "posts",
    id,
  );

  await deleteDoc(postRef);
}

export function formatPostDate(
  dateString: string,
): string {
  try {
    const [year, month, day] = dateString
      .split("-")
      .map(Number);

    const date = new Date(
      year,
      month - 1,
      day,
    );

    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function estimateReadingTime(
  content: string,
): number {
  const words = content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const wordsPerMinute = 200;

  return Math.max(
    1,
    Math.ceil(words / wordsPerMinute),
  );
}