import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FORMULAS, SUBJECTS, type SubjectId } from "@/lib/formulas";
import { FormulaCard } from "@/components/formula-card";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Formula Library — Formula Lab" },
      { name: "description", content: "Search and filter 150+ engineering formulas across six subjects." },
      { property: "og:title", content: "Formula Library" },
      { property: "og:description", content: "Every engineering formula in one searchable library." },
    ],
  }),
  component: Library,
});

function Library() {
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState<SubjectId | "all">("all");

  const filtered = useMemo(() => {
    const lc = q.trim().toLowerCase();
    return FORMULAS.filter(f => {
      if (subject !== "all" && f.subject !== subject) return false;
      if (!lc) return true;
      return (
        f.name.toLowerCase().includes(lc) ||
        f.expression.toLowerCase().includes(lc) ||
        f.description.toLowerCase().includes(lc) ||
        f.chapter.toLowerCase().includes(lc)
      );
    });
  }, [q, subject]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-extrabold">Formula Library</h1>
      <p className="mt-2 text-muted-foreground">Every formula, searchable and filterable.</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search formulas, variables, chapters…"
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip active={subject === "all"} onClick={() => setSubject("all")}>All</FilterChip>
        {SUBJECTS.map(s => (
          <FilterChip key={s.id} active={subject === s.id} onClick={() => setSubject(s.id)}>
            {s.short}
          </FilterChip>
        ))}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">{filtered.length} formula{filtered.length !== 1 && "s"}</div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(f => <FormulaCard key={f.id} formula={f} />)}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
