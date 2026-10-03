import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import type { ContactMessage } from "@/types/contact";
import { firebaseDb } from "@/lib/firebase/firestore";

const contactsCollection = collection(firebaseDb, "contacts");

function resolveCreatedAt(rawCreatedAt: unknown): string {
  if (!rawCreatedAt) {
    return new Date().toISOString();
  }

  if (
    typeof rawCreatedAt === "object" &&
    rawCreatedAt !== null &&
    "toDate" in rawCreatedAt &&
    typeof (rawCreatedAt as { toDate: () => Date }).toDate === "function"
  ) {
    return (rawCreatedAt as { toDate: () => Date }).toDate().toISOString();
  }

  if (rawCreatedAt instanceof Date) {
    return rawCreatedAt.toISOString();
  }

  if (typeof rawCreatedAt === "string") {
    return rawCreatedAt;
  }

  return new Date().toISOString();
}

export async function getContacts(): Promise<ContactMessage[]> {
  try {
    const contactsQuery = query(
      contactsCollection,
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(contactsQuery);

    return snapshot.docs.map((document) => {
      const data = document.data();
      return {
        id: document.id,
        name: data.name || "",
        contact: data.contact || data.email || "",
        subject: data.subject || "",
        message: data.message || "",
        createdAt: resolveCreatedAt(data.createdAt),
      };
    });
  } catch (err) {
    // Gracefully handle unauthenticated SSR / build-time prerendering
    console.warn("[getContacts] Leitura não autorizada no SSR ou build:", err);
    return [];
  }
}

export async function getContact(
  id: string,
): Promise<ContactMessage | null> {
  try {
    const contactRef = doc(firebaseDb, "contacts", id);
    const snapshot = await getDoc(contactRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name || "",
      contact: data.contact || data.email || "",
      subject: data.subject || "",
      message: data.message || "",
      createdAt: resolveCreatedAt(data.createdAt),
    };
  } catch (err) {
    console.warn("[getContact] Erro ao buscar contato:", err);
    return null;
  }
}

export async function createContact(
  data: Omit<ContactMessage, "id">,
): Promise<string> {
  const docRef = await addDoc(contactsCollection, {
    name: data.name,
    contact: data.contact,
    subject: data.subject,
    message: data.message,
    createdAt: data.createdAt || new Date().toISOString(),
  });

  return docRef.id;
}

export async function deleteContact(id: string): Promise<void> {
  const contactRef = doc(firebaseDb, "contacts", id);
  await deleteDoc(contactRef);
}

export function formatContactDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}
