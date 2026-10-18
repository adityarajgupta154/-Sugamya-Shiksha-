import { getFirestore, Firestore } from "firebase/firestore";
import { app } from "./app";

let db: Firestore | null = null;

if (app) {
  try {
    db = getFirestore(app);
  } catch (error) {
    console.warn("Firestore initialization fallback:", error);
  }
}

export { db };

