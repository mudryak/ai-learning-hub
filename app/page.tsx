import resources from "@/data/resources.json";
import type { Resource } from "@/types/resource";
import ResourceList from "@/components/ResourceList";

export default function Home() {
  const data = resources as Resource[];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            AI Learning Hub
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            {data.length} resources
          </p>
        </header>
        <ResourceList resources={data} />
      </div>
    </main>
  );
}
