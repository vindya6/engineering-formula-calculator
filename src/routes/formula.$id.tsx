import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Copy, Share2 } from "lucide-react";
import { getFormula, getSubject, FORMULAS } from "@/lib/formulas";
import { CalculatorWidget } from "@/components/calculator-widget";
import { useBookmarks } from "@/lib/storage";

export const Route = createFileRoute("/formula/$id")({
  loader: ({ params }) => {
    const formula = getFormula(params.id);
    if (!formula) throw notFound();
    return { formula };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.formula.name} — Formula Lab` : "Formula" },
      { name: "description", content: loaderData?.formula.description ?? "Engineering formula" },
      { property: "og:title", content: loaderData?.formula.name ?? "Formula" },
      { property: "og:description", content: loaderData?.formula.description ?? "" },
    ],
  }),
  component: FormulaPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl p-12 text-center">
      <h1 className="text-2xl font-bold">Formula not found</h1>
      <Link to="/library" className="mt-4 inline-block text-primary hover:underline">← Browse library</Link>
    </div>
  ),
});

function FormulaPage() {
  const { formula } = Route.useLoaderData();
  const subject = getSubject(formula.subject);
  const { has, toggle } = useBookmarks();
  const related = (formula.related ?? [])
    .map(id => FORMULAS.find(f => f.id === id))
    .filter((f): f is (typeof FORMULAS)[number] => !!f);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link to="/library" className="hover:text-foreground">Library</Link>
        <span>/</span>
        <Link to="/subject/$slug" params={{ slug: formula.subject }} className="hover:text-foreground">
          {subject?.name}
        </Link>
        <span>/</span>
        <span>{formula.chapter}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="min-w-0">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{formula.name}</h1>
          <p className="mt-2 text-muted-foreground">{formula.description}</p>
          <div className="mt-3 rounded-xl bg-secondary px-5 py-4 font-mono text-2xl">
            {formula.expression}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggle(formula.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
          >
            {has(formula.id) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
            {has(formula.id) ? "Bookmarked" : "Bookmark"}
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(`${formula.name}: ${formula.expression}`)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
          >
            <Copy className="h-4 w-4" /> Copy
          </button>
          <button
            onClick={() => { if (navigator.share) navigator.share({ title: formula.name, text: formula.expression, url: location.href }); }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Section title="Theory">{formula.theory}</Section>
          <Section title="When to use it">{formula.whenToUse}</Section>
          <Section title="Real-world application">{formula.application}</Section>
          {formula.memoryTrick && <Section title="Memory trick">{formula.memoryTrick}</Section>}
          {formula.commonMistakes && formula.commonMistakes.length > 0 && (
            <Section title="Common mistakes">
              <ul className="ml-5 list-disc space-y-1">
                {formula.commonMistakes.map(m => <li key={m}>{m}</li>)}
              </ul>
            </Section>
          )}
          {formula.variables.length > 0 && (
            <Section title="Variables & units">
              <div className="grid gap-2 sm:grid-cols-2">
                {formula.variables.map(v => (
                  <div key={v.key} className="rounded-lg border border-border p-3">
                    <div className="font-mono text-sm font-semibold">{v.symbol ?? v.key}</div>
                    <div className="text-sm">{v.name}</div>
                    <div className="text-xs text-muted-foreground">SI unit: {v.unit || "—"}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        <div className="space-y-6">
          <CalculatorWidget formula={formula} />
          {related.length > 0 && (
            <div className="card-elevated p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related formulas</h3>
              <div className="mt-3 space-y-2">
                {related.map(r => (
                  <Link
                    key={r.id}
                    to="/formula/$id"
                    params={{ id: r.id }}
                    className="block rounded-lg border border-border p-3 hover:bg-muted"
                  >
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{r.expression}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-elevated p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
