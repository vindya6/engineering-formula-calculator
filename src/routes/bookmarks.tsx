import { createFileRoute, Link } from "@tanstack/react-router";
import { FORMULAS } from "@/lib/formulas";
import { useBookmarks } from "@/lib/storage";
import { FormulaCard } from "@/components/formula-card";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks — Formula Lab" },
      { name: "description", content: "Your saved engineering formulas, ready for revision." },
      { property: "og:title", content: "My Bookmarks" },
      { property: "og:description", content: "Your saved engineering formulas." },
    ],
  }),
  component: Bookmarks,
});

function Bookmarks() {
  const { ids } = useBookmarks();
  const items = ids.map(id => FORMULAS.find(f => f.id === id)).filter((f): f is (typeof FORMULAS)[number] => !!f);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold">Bookmarks</h1>
      <p className="mt-2 text-muted-foreground">Saved on this device.</p>
      {items.length === 0 ? (
        <div className="mt-8 card-elevated p-8 text-center">
          <p className="text-muted-foreground">No bookmarks yet. Browse the <Link to="/library" className="text-primary underline">library</Link> and tap the bookmark icon.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(f => <FormulaCard key={f.id} formula={f} />)}
        </div>
      )}
    </div>
  );
}
