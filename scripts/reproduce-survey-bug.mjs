import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
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

async function testSurveyFlow() {
  console.log("=== PHASE A: DIAGNOSTIC REPRODUCTION ===");
  console.log("Connecting to Firebase Project:", firebaseConfig.projectId);

  // 1. Sign in as Admin
  let adminUid = null;
  try {
    const adminCred = await signInWithEmailAndPassword(auth, "aditya12@gmail.com", "Aditya2005");
    adminUid = adminCred.user.uid;
    console.log("1. Admin Sign-In: SUCCESS. UID:", adminUid, "Email:", adminCred.user.email);
  } catch (err) {
    console.error("1. Admin Sign-In: FAILED:", err.code, err.message);
  }

  // 2. Check if users/{adminUid} exists and has role=admin
  if (adminUid) {
    try {
      const userDoc = await getDoc(doc(db, "users", adminUid));
      if (userDoc.exists()) {
        console.log("2. Firestore users/" + adminUid + ":", userDoc.data());
      } else {
        console.warn("2. Firestore users/" + adminUid + " DOES NOT EXIST!");
      }
    } catch (err) {
      console.error("2. Failed to read users/" + adminUid + ":", err.code, err.message);
    }
  }

  // 3. Try reading surveyResponses collection as Admin
  try {
    console.log("3. Fetching collection('surveyResponses') as admin...");
    const snap = await getDocs(collection(db, "surveyResponses"));
    console.log("3. Fetching surveyResponses: SUCCESS! Total documents found:", snap.size);
    snap.docs.forEach((d) => {
      console.log(`   - Doc [${d.id}]:`, JSON.stringify(d.data()));
    });
  } catch (err) {
    console.error("3. Fetching surveyResponses: FAILED!", err.code, err.message);
  }

  // 4. Test simulate frontend fetchFirestoreData() behavior
  console.log("4. Simulating exact admin page fetchFirestoreData() sequence...");
  try {
    const homeSnap = await getDoc(doc(db, "siteContent", "home"));
    console.log("   - siteContent/home:", homeSnap.exists() ? "EXISTS" : "MISSING");
    
    const aboutSnap = await getDoc(doc(db, "siteContent", "about"));
    console.log("   - siteContent/about:", aboutSnap.exists() ? "EXISTS" : "MISSING");

    const inqSnap = await getDocs(collection(db, "contactSubmissions"));
    console.log("   - contactSubmissions size:", inqSnap.size);

    const schoolsSnap = await getDocs(collection(db, "schools"));
    console.log("   - schools size:", schoolsSnap.size);

    const surveySnap = await getDoc(doc(db, "surveys", "danapur-community-survey-2026"));
    console.log("   - surveys/danapur-community-survey-2026:", surveySnap.exists() ? "EXISTS" : "MISSING");

    const respSnap = await getDocs(collection(db, "surveyResponses"));
    console.log("   - surveyResponses size:", respSnap.size);
  } catch (err) {
    console.error("   - Error during sequence:", err.code, err.message);
  }
}

testSurveyFlow().then(() => process.exit(0)).catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
