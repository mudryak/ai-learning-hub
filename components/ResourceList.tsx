"use client";

import { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";
import { getStatuses, getRatings, type ReadStatus } from "@/lib/storage";
import ResourceCard from "./ResourceCard";
import StatsBar from "./StatsBar";

const CATEGORIES: ResourceCategory[] = [
  "AI Engineering & Education",
  "Claude Workflow & Skills",
  "AI Agents & Orchestration",
  "Curation & Discovery",
  "Tools & Stacks",
  "Other",
];

const TYPES: ResourceType[] = ["article", "video"];

const STATUS_OPTIONS: { value: ReadStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "unread", label: "Unread" },
  { value: "in-progress", label: "Reading" },
  { value: "read", label: "Read" },
];

const MIN_RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 1, label: "★ 1+" },
  { value: 2, label: "★ 2+" },
  { value: 3, label: "★ 3+" },
  { value: 4, label: "★ 4+" },
  { value: 5, label: "★ 5" },
];

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | "">("");
  const [selectedType, setSelectedType] = useState<ResourceType | "">("");
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus | "">("");
  const [minRating, setMinRating] = useState(0);

  const [statuses, setStatuses] = useState<Record<string, ReadStatus>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [sortStatuses, setSortStatuses] = useState<Record<string, ReadStatus>>({});

  useEffect(() => {
    const s = getStatuses();
    setStatuses(s);
    setSortStatuses(s);
    setRatings(getRatings());
  }, []);

  // Re-read storage after any card interaction (ReadToggle / StarRating dispatch custom event)
  useEffect(() => {
    function onStorage() {
      setStatuses(getStatuses());
      setRatings(getRatings());
    }
    window.addEventListener("storage", onStorage);
    // polling fallback for same-tab updates
    const id = setInterval(() => {
      setStatuses(getStatuses());
      setRatings(getRatings());
    }, 500);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(id);
    };
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(resources, {
        keys: ["title", "description", "tags"],
        threshold: 0.35,
        includeScore: true,
      }),
    [resources]
  );

  const results = useMemo(() => {
    let items = query.trim()
      ? fuse.search(query.trim()).map((r) => r.item)
      : resources;

    if (selectedCategory) {
      items = items.filter((r) => r.category === selectedCategory);
    }
    if (selectedType) {
      items = items.filter((r) => r.type === selectedType);
    }
    if (selectedStatus) {
      items = items.filter((r) => (statuses[r.id] ?? "unread") === selectedStatus);
    }
    if (minRating > 0) {
      items = items.filter((r) => (ratings[r.id] ?? 0) >= minRating);
    }

    const ORDER: Record<string, number> = { "in-progress": 0, unread: 1, read: 2 };
    items = [...items].sort((a, b) => {
      const sa = ORDER[sortStatuses[a.id] ?? "unread"];
      const sb = ORDER[sortStatuses[b.id] ?? "unread"];
      return sa - sb;
    });

    return items;
  }, [query, selectedCategory, selectedType, selectedStatus, minRating, fuse, resources, statuses, ratings, sortStatuses]);

  function clearFilters() {
    setQuery("");
    setSelectedCategory("");
    setSelectedType("");
    setSelectedStatus("");
    setMinRating(0);
  }

  const hasActiveFilters = query || selectedCategory || selectedType || selectedStatus || minRating > 0;

  return (
    <div>
      <div className="mb-4">
        <StatsBar total={resources.length} />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          placeholder="Search resources…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as ResourceCategory | "")}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-zinc-500"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as ResourceType | "")}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-zinc-500"
        >
          <option value="">All types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as ReadStatus | "")}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-zinc-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-zinc-500"
        >
          {MIN_RATING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="shrink-0 text-sm text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            Clear
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-400">
          No resources found.{" "}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="underline hover:text-zinc-600">
              Clear filters
            </button>
          )}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {results.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </ul>
      )}
    </div>
  );
}
