"use client";

import { useState } from "react";

const STORAGE_KEY = "ai-hub-read";

function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

interface ReadToggleProps {
  resourceId: string;
}

export default function ReadToggle({ resourceId }: ReadToggleProps) {
  const [isRead, setIsRead] = useState(() => getReadIds().has(resourceId));

  function toggle() {
    const ids = getReadIds();
    if (ids.has(resourceId)) {
      ids.delete(resourceId);
    } else {
      ids.add(resourceId);
    }
    saveReadIds(ids);
    setIsRead(ids.has(resourceId));
  }

  return (
    <button
      onClick={toggle}
      aria-label={isRead ? "Mark as unread" : "Mark as read"}
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
        isRead
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
          : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      }`}
    >
      {isRead ? "Read" : "Mark read"}
    </button>
  );
}
