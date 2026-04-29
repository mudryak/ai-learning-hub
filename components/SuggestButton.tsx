"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/AppContext";
import type { ResourceCategory, ResourceType } from "@/types/resource";

const CATEGORIES: ResourceCategory[] = [
  "AI Engineering & Education",
  "Claude Workflow & Skills",
  "AI Agents & Orchestration",
  "Curation & Discovery",
  "Tools & Stacks",
  "Other",
];

type FormState = "idle" | "open" | "submitting" | "success" | "error";

export default function SuggestButton() {
  const { user } = useApp();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ResourceCategory>(CATEGORIES[0]);
  const [type, setType] = useState<ResourceType>("article");

  function resetForm() {
    setTitle("");
    setUrl("");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setType("article");
    setErrorMsg("");
  }

  function open() {
    resetForm();
    setFormState("open");
  }

  function close() {
    setFormState("idle");
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setFormState("submitting");
    setErrorMsg("");

    // Basic length guards (belt-and-suspenders alongside HTML maxLength)
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length === 0 || trimmedTitle.length > 200) {
      setErrorMsg("Title must be between 1 and 200 characters.");
      setFormState("error");
      return;
    }
    if (trimmedUrl.length === 0 || trimmedUrl.length > 500) {
      setErrorMsg("URL must be between 1 and 500 characters.");
      setFormState("error");
      return;
    }
    if (trimmedDescription.length > 1000) {
      setErrorMsg("Description must be 1000 characters or fewer.");
      setFormState("error");
      return;
    }

    const { error } = await supabase.from("suggestions").insert({
      user_id: user.id,
      title: trimmedTitle,
      url: trimmedUrl,
      description: trimmedDescription,
      category,
      type,
    });

    if (error) {
      setErrorMsg("Failed to submit. Please try again.");
      setFormState("error");
      return;
    }

    setFormState("success");
  }

  // Not logged in: show disabled button with tooltip text
  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        Suggest a resource
      </Link>
    );
  }

  if (formState === "success") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-emerald-600 dark:text-emerald-400">
          Suggestion submitted — thanks!
        </span>
        <button
          onClick={() => setFormState("idle")}
          className="text-xs text-zinc-400 underline hover:text-zinc-600"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (formState === "idle") {
    return (
      <button
        onClick={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        Suggest a resource
      </button>
    );
  }

  // Form states: open | submitting | error
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Suggest a resource
          </h2>
          <button
            onClick={close}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Title *
            </span>
            <input
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              URL *
            </span>
            <input
              required
              type="url"
              maxLength={500}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Why is this resource worth reading?"
              className="resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Category *
              </span>
              <select
                required
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ResourceCategory)
                }
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Type *
              </span>
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value as ResourceType)}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
              </select>
            </label>
          </div>

          {(formState === "error") && (
            <p className="text-xs text-red-500">{errorMsg}</p>
          )}

          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formState === "submitting"}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {formState === "submitting" ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
