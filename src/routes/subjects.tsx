import { createFileRoute, Link } from "@tanstack/react-router";
import { Atom, Code2, FlaskConical, MessageSquare, Sigma, Zap } from "lucide-react";
import { FORMULAS, SUBJECTS } from "@/lib/formulas";

const ICONS = { Sigma, Atom, FlaskConical, Zap, Code2, MessageSquare };
const BG: Record<string, string> = {
  primary: "bg-primary/10",
  sky: "bg-sky",
  mint: "bg-mint",
  peach: "bg-peach",
  lavender: "bg-lavender",
};

export const Route = createFileRoute("/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects — Formula Lab" },
      { name: "description", content: "Browse engineering subjects: Mathematics, Physics, Chemistry, BEEE, C Programming and English." },
      { property: "og:title", content: "Engineering Subjects — Formula Lab" },
      { property: "og:description", content: "Six first-year engineering subjects with interactive formulas." },
    ],
  }),
  component: Subjects,
});

function Subjects() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Subject dashboard</p>
      <h1 className="mt-1 text-4xl font-extrabold">Explore engineering subjects</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Six core first-year subjects, each with formulas, theory, calculators and practice.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map(s => {
          const Icon = ICONS[s.icon as keyof typeof ICONS];
          const count = FORMULAS.filter(f => f.subject === s.id).length;
          return (
            <Link
              key={s.id}
              to="/subject/$slug"
              params={{ slug: s.id }}
              className="card-elevated card-elevated-hover overflow-hidden"
            >
              <div className={`flex h-32 items-center justify-center ${BG[s.accent]}`}>
                {Icon ? <Icon className="h-12 w-12 text-foreground/70" /> : null}
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.difficulty} · {count} formulas
                </div>
                <h3 className="mt-1 text-lg font-bold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                <span className="mt-4 inline-block rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  Open subject →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
