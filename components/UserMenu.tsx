"use client";

import Link from "next/link";
import { useApp } from "./AppContext";

export default function UserMenu({ isAdmin = false }: { isAdmin?: boolean }) {
  const { user, signOut } = useApp();

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user.user_metadata?.avatar_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.user_metadata.avatar_url}
          alt={user.user_metadata.full_name ?? "User"}
          className="h-7 w-7 rounded-full"
        />
      )}
      <Link
        href="/notes"
        className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
      >
        My notes
      </Link>
      {isAdmin && (
        <Link
          href="/admin/suggestions"
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          Admin
        </Link>
      )}
      <button
        onClick={signOut}
        className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
      >
        Sign out
      </button>
    </div>
  );
}
