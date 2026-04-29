"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/AppContext";

interface Props {
  resourceId: string;
}

export default function ResourceNotes({ resourceId }: Props) {
  const { user } = useApp();
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();
  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing note once user is known. Uses async IIFE to avoid
  // calling setState synchronously as the first statement in the effect.
  useEffect(() => {
    async function load() {
      if (!user) {
        setLoaded(true);
        return;
      }
      const { data } = await supabase
        .from("notes")
        .select("content")
        .eq("user_id", user.id)
        .eq("resource_id", resourceId)
        .maybeSingle();
      if (data?.content) setContent(data.content);
      setLoaded(true);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, resourceId]);

  // Cancel any in-flight debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  async function saveNote(value: string) {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    await supabase.from("notes").upsert(
      {
        user_id: user.id,
        resource_id: resourceId,
        content: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,resource_id" }
    );
    setSaving(false);
    setSaved(true);
    // Reset "Saved" indicator after 2 s
    setTimeout(() => setSaved(false), 2000);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setContent(value);
    setSaved(false);
    // Debounce: save 800 ms after last keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveNote(value), 800);
  }

  if (!loaded) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        My notes
      </h2>

      {!user ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/login"
            className="text-zinc-700 underline hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Sign in
          </Link>{" "}
          to save notes about this resource.
        </p>
      ) : (
        <div className="relative">
          <textarea
            value={content}
            onChange={handleChange}
            maxLength={10000}
            rows={5}
            placeholder="Write your notes here…"
            className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-500 dark:focus:border-zinc-500"
          />
          <div className="mt-1 flex items-center justify-end gap-2 text-xs text-zinc-400">
            {saving && <span>Saving…</span>}
            {saved && !saving && (
              <span className="text-emerald-500">Saved</span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
