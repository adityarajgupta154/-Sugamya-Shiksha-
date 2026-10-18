import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBC7SxB_GuF_jIBzjARQEN62UaJ5EE4s5w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sugamya-shiksha-bihar.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sugamya-shiksha-bihar",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sugamya-shiksha-bihar.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "406957622393",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:406957622393:web:d9590511afcf60f04840a8",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-4EMTED3WH8",
};

let app: FirebaseApp | undefined;

if (typeof window !== "undefined" || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  } catch (error) {
    console.warn("Firebase App initialization fallback:", error);
  }
}

export { app };

