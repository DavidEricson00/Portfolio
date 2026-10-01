import { getFirestore } from "firebase/firestore";

import { firebaseApp } from "./app";

export const firebaseDb = getFirestore(firebaseApp);