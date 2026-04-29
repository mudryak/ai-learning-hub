"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "./AppContext";
import type { ReadStatus } from "@/lib/storage";

const LABELS: Record<ReadStatus, string> = {
  unread: "Mark read",
  "in-progress": "Reading",
  read: "Read",
};

const STYLES: Record<ReadStatus, string> = {
  unread:
    "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
  "in-progress":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  read: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
};

interface ReadToggleProps {
  resourceId: string;
}

export default function ReadToggle({ resourceId }: ReadToggleProps) {
  const { user, progress, cycleStatus } = useApp();
  const [showPrompt, setShowPrompt] = useState(false);

  const status: ReadStatus = progress[resourceId]?.status ?? "unread";

  async function toggle() {
    if (!user) {
      setShowPrompt(true);
      return;
    }
    await cycleStatus(resourceId);
  }

  return (
    <span className="relative">
      <button
        onClick={toggle}
        aria-label={`Status: ${status}. Click to change.`}
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${STYLES[status]}`}
      >
        {LABELS[status]}
      </button>
      {showPrompt && (
        <span className="absolute left-0 top-full z-20 mt-1.5 w-48 rounded-xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Sign in to track progress
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-zinc-900 underline dark:text-zinc-100"
            >
              Sign in →
            </Link>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              Later
            </button>
          </div>
        </span>
      )}
    </span>
  );
}
