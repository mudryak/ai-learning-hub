"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useApp } from "./AppContext";

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const linkCls = "block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800";

export default function UserMenu({ isAdmin = false }: { isAdmin?: boolean }) {
  const { user, signOut } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  // ── Desktop (sm+) ────────────────────────────────────────────
  const desktop = user ? (
    <div className="hidden sm:flex items-center gap-3">
      {user.user_metadata?.avatar_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.user_metadata.avatar_url}
          alt={user.user_metadata.full_name ?? "User"}
          className="h-7 w-7 rounded-full"
        />
      )}
      <Link href="/notes" className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
        My notes
      </Link>
      {isAdmin && (
        <>
          <Link href="/admin/suggestions" className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            Suggestions
          </Link>
          <Link href="/admin/resources" className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            Badges
          </Link>
        </>
      )}
      <button
        onClick={signOut}
        className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
      >
        Sign out
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="hidden sm:inline text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
    >
      Sign in
    </Link>
  );

  // ── Mobile burger (< sm) ─────────────────────────────────────
  const mobile = (
    <div className="relative sm:hidden" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      >
        {open ? <XIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-48 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col py-1">
            {user ? (
              <>
                {user.user_metadata?.full_name && (
                  <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
                    {user.user_metadata.avatar_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.user_metadata.avatar_url}
                        alt=""
                        className="h-5 w-5 rounded-full"
                      />
                    )}
                    <span className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {user.user_metadata.full_name}
                    </span>
                  </div>
                )}
                <Link href="/notes" onClick={() => setOpen(false)} className={linkCls}>
                  My notes
                </Link>
                {isAdmin && (
                  <>
                    <Link href="/admin/suggestions" onClick={() => setOpen(false)} className={linkCls}>
                      Suggestions
                    </Link>
                    <Link href="/admin/resources" onClick={() => setOpen(false)} className={linkCls}>
                      Badges
                    </Link>
                  </>
                )}
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className={`${linkCls} w-full text-left`}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className={linkCls}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {desktop}
      {mobile}
    </>
  );
}
