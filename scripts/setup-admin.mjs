import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
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

const email = "aditya12@gmail.com";
const password = "Aditya2005";

async function setupAdmin() {
  console.log(`Setting up admin user: ${email}...`);
  let userCred;
  try {
    userCred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("✓ User created in Firebase Authentication! UID:", userCred.user.uid);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      console.log("User already exists in Auth, signing in to retrieve UID...");
      userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("✓ Signed in successfully! UID:", userCred.user.uid);
    } else {
      console.error("Auth error:", err.code, err.message);
      return;
    }
  }

  const uid = userCred.user.uid;
  console.log(`Setting admin role in Firestore users/${uid}...`);
  try {
    await setDoc(doc(db, "users", uid), {
      email: email,
      role: "admin",
      createdAt: new Date().toISOString(),
    }, { merge: true });
    console.log("✓ Successfully granted 'admin' role in Firestore!");
    console.log("ALL SET! You can now log into /admin/login with your credentials.");
  } catch (dbErr) {
    console.error("Firestore error while setting admin role:", dbErr.message);
  }
}

setupAdmin().then(() => process.exit(0)).catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
