"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "./AppContext";

interface StarRatingProps {
  resourceId: string;
}

export default function StarRating({ resourceId }: StarRatingProps) {
  const { user, progress, updateRating } = useApp();
  const [hover, setHover] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  const rating = progress[resourceId]?.rating ?? 0;

  async function handleClick(star: number) {
    if (!user) {
      setShowPrompt(true);
      return;
    }
    await updateRating(resourceId, rating === star ? 0 : star);
  }

  return (
    <span className="relative">
      <span
        className="flex items-center gap-0.5"
        aria-label={`Rating: ${rating} of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <svg
              viewBox="0 0 20 20"
              className={`h-4 w-4 ${
                (hover || rating) >= star
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
              }`}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </span>
      {showPrompt && (
        <span className="absolute left-0 top-full z-20 mt-1.5 w-48 rounded-xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Sign in to rate resources
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
