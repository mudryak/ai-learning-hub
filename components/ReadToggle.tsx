"use client";

import { useState, useEffect } from "react";
import { getStatuses, setStatus, nextStatus, type ReadStatus } from "@/lib/storage";

interface ReadToggleProps {
  resourceId: string;
}

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

export default function ReadToggle({ resourceId }: ReadToggleProps) {
  const [status, setLocalStatus] = useState<ReadStatus>("unread");

  useEffect(() => {
    const statuses = getStatuses();
    setLocalStatus(statuses[resourceId] ?? "unread");
  }, [resourceId]);

  function toggle() {
    const next = nextStatus(status);
    setStatus(resourceId, next);
    setLocalStatus(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Status: ${status}. Click to change.`}
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${STYLES[status]}`}
    >
      {LABELS[status]}
    </button>
  );
}
