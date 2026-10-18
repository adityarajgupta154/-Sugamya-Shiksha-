"use client";

import React, { useState, useRef, useId, useEffect } from "react";
import { clsx } from "clsx";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  ariaLabel: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, ariaLabel, className }: TabsProps) {
  const [selectedTabId, setSelectedTabId] = useState<string>(
    defaultTab || tabs[0]?.id || ""
  );
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, [tabs]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let targetIndex = currentIndex;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      targetIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      targetIndex = tabs.length - 1;
    }

    if (targetIndex !== currentIndex) {
      const nextTab = tabs[targetIndex];
      setSelectedTabId(nextTab.id);
      tabRefs.current[targetIndex]?.focus();
    }
  };

  const activeTab = tabs.find((t) => t.id === selectedTabId) || tabs[0];

  return (
    <div className={clsx("w-full space-y-4", className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex space-x-1 border-b border-slate-200 overflow-x-auto pb-px"
      >
        {tabs.map((tab, idx) => {
          const isSelected = tab.id === selectedTabId;
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              id={tabId}
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => React.startTransition(() => setSelectedTabId(tab.id))}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={clsx(
                "px-4 py-2.5 text-sm font-semibold transition-colors duration-150 border-b-2 whitespace-nowrap min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:rounded-t-md",
                isSelected
                  ? "border-teal-700 text-teal-800 bg-teal-50/50"
                  : "border-transparent text-slate-600 hover:text-navy-900 hover:border-slate-300"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeTab.id}`}
          aria-labelledby={`${baseId}-tab-${activeTab.id}`}
          tabIndex={0}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-md py-2"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
