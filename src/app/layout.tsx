import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { SkipLink } from "@/components/layout/SkipLink";
import { LiveAnnouncer } from "@/components/layout/LiveAnnouncer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-devanagari",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Sugamya Shiksha Bihar | Digital School Accessibility Research & Resource Platform",
  description:
    "Accessible Schools, Inclusive Futures — Sugamya Shiksha Bihar Research Project examining physical infrastructure accessibility and inclusive education in schools across Patna, Bihar.",
  keywords: [
    "School Accessibility",
    "Sugamya Shiksha Bihar",
    "Patna Schools",
    "Inclusive Education",
    "Accessibility Code 2024",
    "RPwD Act 2016",
    "Patna Bihar Education",
  ],
  authors: [{ name: "Sugamya Shiksha Bihar Research Team" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hi"
      dir="ltr"
      className={`text-scale-normal ${inter.variable} ${notoSansDevanagari.variable}`}
    >
      <body className="min-h-screen min-h-dvh flex flex-col font-sans bg-offwhite text-navy-900 selection:bg-teal-200 selection:text-navy-900 overflow-x-clip">
        <AnalyticsTracker />
        <AccessibilityProvider>
          <LanguageProvider>
            <SkipLink />
            <LiveAnnouncer />
            <Header />
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 w-full focus-visible:outline-none"
            >
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
