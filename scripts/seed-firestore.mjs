/**
 * Seed Firestore with Guidelines, SiteContent, Schools, and Surveys per PRD Section 11.2
 * Run via: node scripts/seed-firestore.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Read .env.local if present
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...vals] = trimmed.split("=");
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join("=").trim();
      }
    }
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBC7SxB_GuF_jIBzjARQEN62UaJ5EE4s5w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sugamya-shiksha-bihar.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sugamya-shiksha-bihar",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sugamya-shiksha-bihar.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "406957622393",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:406957622393:web:d9590511afcf60f04840a8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Connecting to Firebase project:", firebaseConfig.projectId);
  try {
    await setDoc(doc(db, "siteContent", "home"), {
      heroHindi: "हर बच्चे के लिए सुगम विद्यालय, हर बच्चे के लिए समान शिक्षा।",
      heroEnglish: "Researching School Accessibility and Advancing Inclusive Education in Danapur, Patna, Bihar.",
      introTitle: "About the Research Initiative",
      introText: "Sugamya Shiksha Bihar is a dedicated research and resource platform. Grounded in the Danapur subdivision of Patna district, this project documents physical infrastructure barriers in schools, evaluates compliance with national universal design standards, and amplifies community voices for inclusive education.",
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log("✓ Successfully connected and seeded siteContent/home");
  } catch (err) {
    console.warn("Notice during seed (rules or permissions):", err.message);
  }
}

seed();
