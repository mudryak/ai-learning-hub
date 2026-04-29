import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import SuggestionActions from "@/components/SuggestionActions";

interface SuggestionRow {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  type: string;
  status: string;
  created_at: string;
  user_id: string;
  // joined from auth.users via admin client
  submitter_email?: string;
}

export default async function AdminSuggestionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/");
  }

  const adminClient = createAdminClient();
  const { data: rows } = await adminClient
    .from("suggestions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  // Fetch submitter emails in a separate query (admin-only)
  const suggestions: SuggestionRow[] = [];
  for (const row of rows ?? []) {
    const { data: authUser } = await adminClient.auth.admin.getUserById(
      row.user_id
    );
    suggestions.push({
      ...row,
      submitter_email: authUser?.user?.email ?? row.user_id,
    });
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← Back to all resources
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Pending suggestions
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {suggestions.length === 0
              ? "No pending suggestions"
              : `${suggestions.length} suggestion${suggestions.length === 1 ? "" : "s"} to review`}
          </p>
        </header>

        {suggestions.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            All caught up — nothing to review.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Title
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Type
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Submitter
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Date
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                  >
                    <td className="px-4 py-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-zinc-800 hover:underline dark:text-zinc-200"
                      >
                        {s.title}
                      </a>
                      {s.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                          {s.description}
                        </p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {s.category}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {s.type}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400">
                      {s.submitter_email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400">
                      {new Date(s.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <SuggestionActions id={s.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
