"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BADGE_OPTIONS } from "@/types/resource";

interface Props {
  resourceId: string;
  initialBadge: string | null;
}

export default function ResourceBadgeCell({ resourceId, initialBadge }: Props) {
  const [selected, setSelected] = useState(initialBadge ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function save() {
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/resources", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: resourceId, badge: selected || null }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Failed to save");
    } else {
      router.refresh();
    }
  }

  const dirty = selected !== (initialBadge ?? "");

  return (
    <div className="flex items-center gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      >
        <option value="">— none —</option>
        {BADGE_OPTIONS.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {dirty && (
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
