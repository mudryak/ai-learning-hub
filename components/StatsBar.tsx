"use client";

import { useState, useEffect } from "react";
import { getStatuses } from "@/lib/storage";

interface StatsBarProps {
  total: number;
}

export default function StatsBar({ total }: StatsBarProps) {
  const [read, setRead] = useState(0);
  const [inProgress, setInProgress] = useState(0);

  useEffect(() => {
    const statuses = getStatuses();
    const vals = Object.values(statuses);
    setRead(vals.filter((s) => s === "read").length);
    setInProgress(vals.filter((s) => s === "in-progress").length);
  }, []);

  const unread = total - read - inProgress;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
      <span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{read}</span> read
      </span>
      <span>
        <span className="font-semibold text-amber-600 dark:text-amber-400">{inProgress}</span> reading
      </span>
      <span>
        <span className="font-semibold text-zinc-600 dark:text-zinc-300">{unread}</span> unread
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 min-w-[80px]">
        <div className="flex h-full">
          <div
            className="bg-emerald-500 transition-all"
            style={{ width: `${(read / total) * 100}%` }}
          />
          <div
            className="bg-amber-400 transition-all"
            style={{ width: `${(inProgress / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
