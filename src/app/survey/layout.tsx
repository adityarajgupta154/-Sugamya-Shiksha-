import React from "react";

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://apis.google.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://sugamya-shiksha-bihar.firebaseapp.com" crossOrigin="anonymous" />
      {children}
    </>
  );
}
