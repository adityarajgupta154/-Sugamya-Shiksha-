"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const analyticsInstanceRef = useRef<any>(null);

  useEffect(() => {
    // 1. Never load or run analytics on /admin routes
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    let isCancelled = false;

    // 2. Initialize Firebase Analytics dynamically only on client after page is interactive
    const initAndLog = async () => {
      try {
        if (!analyticsInstanceRef.current) {
          const { app } = await import("@/lib/firebase/app");
          if (!app || isCancelled) return;

          const { getAnalytics, isSupported } = await import("firebase/analytics");
          const supported = await isSupported();
          if (supported && app && !isCancelled) {
            analyticsInstanceRef.current = getAnalytics(app);
          }
        }

        if (analyticsInstanceRef.current && !isCancelled) {
          const { logEvent } = await import("firebase/analytics");
          logEvent(analyticsInstanceRef.current, "page_view", {
            page_path: pathname,
            page_title: typeof document !== "undefined" ? document.title : "",
            page_location: typeof window !== "undefined" ? window.location.href : "",
          });
        }
      } catch (err) {
        // Silently catch in environments where analytics is blocked or unsupported
      }
    };

    // Defer execution until browser is idle or after 3500ms
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const handle = (window as any).requestIdleCallback(initAndLog, { timeout: 3500 });
        return () => {
          isCancelled = true;
          if ("cancelIdleCallback" in window) {
            (window as any).cancelIdleCallback(handle);
          }
        };
      } else {
        const timer = setTimeout(initAndLog, 3000);
        return () => {
          isCancelled = true;
          clearTimeout(timer);
        };
      }
    }
  }, [pathname]);

  return null;
}
