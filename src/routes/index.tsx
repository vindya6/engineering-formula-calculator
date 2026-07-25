import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Search, Calculator, Zap, Atom, FlaskConical, Sigma, Code2, MessageSquare } from "lucide-react";
import { SUBJECTS, FORMULAS, searchFormulas } from "@/lib/formulas";
import { FormulaCard } from "@/components/formula-card";
import { TechUsed } from "@/components/footer";
import { useRecentFormulas } from "@/lib/storage";

const ICONS = { Sigma, Atom, FlaskConical, Zap, Code2, MessageSquare };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Formula Lab — Engineering Formulas Made Interactive" },
      { name: "description", content: "Learn, calculate and practise 150+ engineering formulas with an AI tutor. Physics, Math, Chemistry, BEEE and more." },
      { property: "og:title", content: "Formula Lab — Engineering Formulas Made Interactive" },
      { property: "og:description", content: "Learn, calculate and practise 150+ engineering formulas with an AI tutor. Physics, Math, Chemistry, BEEE and more." },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const results = searchFormulas(q);
  const { ids: recentIds } = useRecentFormulas();
  const recent = recentIds
    .map(id => FORMULAS.find(f => f.id === id))
    .filter((f): f is (typeof FORMULAS)[number] => !!f)
    .slice(0, 4);
  const popular = FORMULAS.filter(f =>
    ["ohms-law", "newton-second", "kinetic-energy", "ideal-gas", "pythagoras", "wave-speed"].includes(f.id),
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/60 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> AI Formula Assistant · Now live
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">
              Engineering formulas,{" "}
              <span style={{ background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                actually understood.
              </span>
            </h1>
            <p className="mt-5 text-base text-foreground/80 sm:text-lg">
              Learn the theory, get the right formula, and solve any unknown — with clear
              step-by-step solutions built for first-year engineering students.
            </p>

            <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-white/80 p-2 shadow-lg backdrop-blur">
              <Search className="ml-2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Try 'ohms law' or 'kinetic energy'…"
                className="flex-1 bg-transparent px-1 py-2 text-sm outline-none"
              />
              <Link
                to="/library"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Browse
              </Link>
            </div>

            {q && results.length > 0 && (
              <div className="mx-auto mt-3 max-w-xl overflow-hidden rounded-2xl border border-border bg-white text-left shadow-xl">
                {results.slice(0, 6).map(f => (
                  <Link
                    key={f.id}
                    to="/formula/$id"
                    params={{ id: f.id }}
                    className="flex items-center justify-between border-b border-border px-4 py-3 last:border-0 hover:bg-muted"
                  >
                    <div>
                      <div className="font-semibold">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.expression}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/subjects"
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background hover:opacity-90"
              >
                Start learning <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                <Sparkles className="h-4 w-4 text-primary" /> Ask the AI tutor
              </Link>
              <Link
                to="/library"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
              >
                <Calculator className="h-4 w-4 text-primary" /> Start calculating
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { k: "6", v: "Subjects" },
              { k: "150+", v: "Formulae" },
              { k: "AI", v: "Assistant" },
              { k: "Live", v: "Calculators" },
              { k: "Step", v: "By-step" },
            ].map(s => (
              <div key={s.v} className="rounded-2xl border border-border bg-white/70 p-4 text-center backdrop-blur">
                <div className="text-2xl font-extrabold">{s.k}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Learn by subject</p>
            <h2 className="mt-1 text-3xl font-bold">Most used subjects</h2>
          </div>
          <Link to="/subjects" className="text-sm font-semibold text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map(s => {
            const Icon = ICONS[s.icon as keyof typeof ICONS];
            const bg = { primary: "bg-primary/10 text-primary", sky: "bg-sky text-foreground", mint: "bg-mint text-foreground", peach: "bg-peach text-foreground", lavender: "bg-lavender text-foreground" }[s.accent];
            return (
              <Link
                key={s.id}
                to="/subject/$slug"
                params={{ slug: s.id }}
                className="card-elevated card-elevated-hover flex items-start gap-4 p-6"
              >
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${bg}`}>
                  {Icon ? <Icon className="h-6 w-6" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{FORMULAS.filter(f => f.subject === s.id).length} formulas</span>
                    <span>·</span>
                    <span>{s.difficulty}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h2 className="text-3xl font-bold">Popular formulas</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map(f => <FormulaCard key={f.id} formula={f} />)}
        </div>
      </section>

      {/* Recent */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h2 className="text-3xl font-bold">Recently viewed</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map(f => <FormulaCard key={f.id} formula={f} />)}
          </div>
        </section>
      )}

      <TechUsed />
    </div>
  );
}
