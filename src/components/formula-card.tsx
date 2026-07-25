import { Link } from "@tanstack/react-router";
import type { Formula } from "@/lib/formulas";
import { getSubject } from "@/lib/formulas";

const ACCENT_BG: Record<string, string> = {
  primary: "bg-primary/10",
  sky: "bg-sky",
  mint: "bg-mint",
  peach: "bg-peach",
  lavender: "bg-lavender",
};

export function FormulaCard({ formula }: { formula: Formula }) {
  const subject = getSubject(formula.subject);
  const accent = subject?.accent ?? "primary";
  return (
    <Link
      to="/formula/$id"
      params={{ id: formula.id }}
      className="card-elevated card-elevated-hover group block overflow-hidden"
    >
      <div className={`px-5 py-4 ${ACCENT_BG[accent]}`}>
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-foreground/70">
          <span>{subject?.short}</span>
          <span>{formula.difficulty}</span>
        </div>
        <div className="mt-1 font-mono text-lg text-foreground">{formula.expression}</div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold group-hover:text-primary">{formula.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{formula.description}</p>
        <div className="mt-3 text-xs text-muted-foreground">{formula.chapter}</div>
      </div>
    </Link>
  );
}
