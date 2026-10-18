import React from "react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="w-full min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse space-y-8"
    >
      <span className="sr-only">सामग्री लोड हो रही है... / Loading content...</span>

      {/* Top Banner Skeleton */}
      <div className="space-y-3 max-w-3xl">
        <div className="h-5 w-32 bg-slate-200 rounded-full" />
        <div className="h-10 w-3/4 sm:w-1/2 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full sm:w-2/3 bg-slate-100 rounded-lg" />
      </div>

      {/* Primary Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-teal-100 rounded-full" />
              <div className="h-4 w-12 bg-slate-200 rounded-md" />
            </div>
            <div className="h-6 w-4/5 bg-slate-200 rounded-lg" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-100 rounded" />
              <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-20 bg-teal-50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
