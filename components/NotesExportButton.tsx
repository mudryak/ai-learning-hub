"use client";

interface NoteItem {
  resource_id: string;
  content: string;
  updated_at: string;
  resources: {
    id: string;
    title: string;
  } | null;
}

interface Props {
  notes: NoteItem[];
}

export default function NotesExportButton({ notes }: Props) {
  function handleExport() {
    const lines: string[] = ["# AI Shelf — My Notes", ""];

    for (const note of notes) {
      const title = note.resources?.title ?? note.resource_id;
      const date = new Date(note.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      lines.push(`## ${title}`);
      lines.push(`*Updated: ${date}*`);
      lines.push("");
      lines.push(note.content.trim());
      lines.push("");
      lines.push("---");
      lines.push("");
    }

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-shelf-notes.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
    >
      Export as Markdown
    </button>
  );
}
