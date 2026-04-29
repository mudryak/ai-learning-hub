import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NotesExportButton from "@/components/NotesExportButton";

interface NoteRow {
  id: string;
  resource_id: string;
  content: string;
  updated_at: string;
  resources: {
    id: string;
    title: string;
  } | null;
}

export default async function NotesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: rows } = await supabase
    .from("notes")
    .select("id, resource_id, content, updated_at, resources(id, title)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  // Supabase types the joined `resources` as an array; cast through unknown
  const notes = (rows ?? []) as unknown as NoteRow[];
  const hasNotes = notes.length > 0;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← Back to all resources
          </Link>
        </nav>

        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              My notes
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {hasNotes
                ? `${notes.length} note${notes.length === 1 ? "" : "s"}`
                : "No notes yet"}
            </p>
          </div>
          {hasNotes && <NotesExportButton notes={notes} />}
        </header>

        {!hasNotes ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            You haven&apos;t written any notes yet. Open a resource and start
            writing.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <Link
                    href={`/${note.resource_id}`}
                    className="text-sm font-semibold text-zinc-800 hover:text-zinc-600 dark:text-zinc-200 dark:hover:text-zinc-400 line-clamp-1"
                  >
                    {note.resources?.title ?? note.resource_id}
                  </Link>
                  <span className="shrink-0 text-xs text-zinc-400">
                    {new Date(note.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {note.content}
                </p>
                <div className="mt-3">
                  <Link
                    href={`/${note.resource_id}`}
                    className="text-xs text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    View resource →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
