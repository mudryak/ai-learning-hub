"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import type { Resource, ResourceCategory, ResourceType } from "@/types/resource";
import ResourceCard from "./ResourceCard";

const CATEGORIES: ResourceCategory[] = [
  "AI Engineering & Education",
  "Claude Workflow & Skills",
  "AI Agents & Orchestration",
  "Curation & Discovery",
  "Tools & Stacks",
  "Other",
];

const TYPES: ResourceType[] = ["article", "video"];

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | "">("");
  const [selectedType, setSelectedType] = useState<ResourceType | "">("");

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
    return items;
  }, [query, selectedCategory, selectedType, fuse, resources]);

  function clearFilters() {
    setQuery("");
    setSelectedCategory("");
    setSelectedType("");
  }

  const hasActiveFilters = query || selectedCategory || selectedType;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search resources…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-500"
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
