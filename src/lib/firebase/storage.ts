import { getStorage, FirebaseStorage } from "firebase/storage";
import { app } from "./app";

let storage: FirebaseStorage | null = null;

if (app) {
  try {
    storage = getStorage(app);
  } catch (error) {
    console.warn("Firebase Storage initialization fallback:", error);
  }
}

export { storage };

