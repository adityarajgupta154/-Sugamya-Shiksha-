"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firestore";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  demoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if demo admin session exists in localStorage
    const demoSession = typeof window !== "undefined" ? localStorage.getItem("ssb_demo_admin") : null;
    if (demoSession === "true") {
      setUser({
        uid: "demo-admin-uid",
        email: "admin@sugamyashikshabihar.org",
        displayName: "Research Fellow (Admin)",
      } as unknown as User);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && db) {
        if (currentUser.email === "aditya12@gmail.com") {
          setIsAdmin(true);
        } else {
          try {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists() && userDoc.data()?.role === "admin") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } catch (err) {
            console.warn("Could not check admin role in Firestore:", err);
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    // Demo admin bypass for local testing when Firebase credentials are demo
    if (email === "admin@sugamyashikshabihar.org" && pass === "Admin@1234") {
      localStorage.setItem("ssb_demo_admin", "true");
      setUser({
        uid: "demo-admin-uid",
        email: "admin@sugamyashikshabihar.org",
        displayName: "Research Fellow (Admin)",
      } as unknown as User);
      setIsAdmin(true);
      return { success: true };
    }

    if (!auth) {
      return { success: false, error: "Firebase Auth is not configured." };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user.email === "aditya12@gmail.com") {
        setIsAdmin(true);
        return { success: true };
      }
      if (db) {
        const userDoc = await getDoc(doc(db, "users", cred.user.uid));
        if (userDoc.exists() && userDoc.data()?.role === "admin") {
          setIsAdmin(true);
          return { success: true };
        } else {
          await fbSignOut(auth);
          return { success: false, error: "Access denied. Only authorized research admins may log in." };
        }
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Invalid credentials." };
    }
  };

  const demoLogin = () => {
    localStorage.setItem("ssb_demo_admin", "true");
    setUser({
      uid: "demo-admin-uid",
      email: "admin@sugamyashikshabihar.org",
      displayName: "Research Fellow (Admin)",
    } as unknown as User);
    setIsAdmin(true);
  };

  const signOut = async () => {
    localStorage.removeItem("ssb_demo_admin");
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        // silent
      }
    }
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signIn,
        signOut,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
