import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { firebaseAuth } from "./client";

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export function logout() {
  return signOut(firebaseAuth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(firebaseAuth, callback);
}