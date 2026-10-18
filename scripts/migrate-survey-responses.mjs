/**
 * One-off Safe Data Migration Script for Survey Responses
 * PRD Section 11.2, 11.3 & ADR 0011
 * 
 * Safely backfills legacy survey responses saved before the Google sign-in change:
 * - Adds standard 'name', 'email', 'phone', 'role', 'surveyId' fields from legacy equivalents.
 * - Does NOT delete any documents or remove any existing fields.
 * - Idempotent: can be run repeatedly without changing already-migrated documents.
 * 
 * Run via: node scripts/migrate-survey-responses.mjs
 */

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Load .env.local
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
const auth = getAuth(app);
const db = getFirestore(app);

async function runMigration() {
  console.log("==================================================");
  console.log(" Safe Data Migration: Survey Responses");
  console.log(" Project:", firebaseConfig.projectId);
  console.log("==================================================");

  // Authenticate as Admin
  try {
    await signInWithEmailAndPassword(auth, "aditya12@gmail.com", "Aditya2005");
    console.log("✓ Authenticated as admin: aditya12@gmail.com");
  } catch (err) {
    console.error("Authentication failed:", err.message);
    process.exit(1);
  }

  const responsesRef = collection(db, "surveyResponses");
  const snap = await getDocs(responsesRef);
  console.log(`Found ${snap.size} total responses in Firestore.\n`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const docId = docSnap.id;

    // Check if backfill is needed
    const needsName = !data.name && (data.respondentName || data.isAnonymous);
    const needsRole = !data.role && data.respondentRole;
    const needsEmail = data.email === undefined;
    const needsPhone = data.phone === undefined && data.contactInfo !== undefined;
    const needsSurveyId = !data.surveyId;

    if (needsName || needsRole || needsEmail || needsPhone || needsSurveyId) {
      console.log(`Migrating doc [${docId}]...`);
      const updates = {};

      if (needsName) {
        updates.name = data.respondentName || (data.isAnonymous ? "Anonymous Participant" : "Participant");
      }
      if (needsRole) {
        updates.role = data.respondentRole || "other";
      }
      if (needsEmail) {
        updates.email = data.email || "";
      }
      if (needsPhone) {
        updates.phone = data.contactInfo || "";
      }
      if (needsSurveyId) {
        updates.surveyId = "danapur-community-survey-2026";
      }

      await setDoc(doc(db, "surveyResponses", docId), updates, { merge: true });
      console.log(`  ✓ Updated fields:`, JSON.stringify(updates));
      updatedCount++;
    } else {
      console.log(`Skipping already-conforming doc [${docId}]`);
      skippedCount++;
    }
  }

  console.log("\n==================================================");
  console.log(`Migration Complete!`);
  console.log(`- Updated: ${updatedCount}`);
  console.log(`- Already conforming: ${skippedCount}`);
  console.log(`- Total: ${snap.size}`);
  console.log("==================================================");
}

runMigration().then(() => process.exit(0)).catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
