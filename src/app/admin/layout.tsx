"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://apis.google.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://sugamya-shiksha-bihar.firebaseapp.com" crossOrigin="anonymous" />
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
