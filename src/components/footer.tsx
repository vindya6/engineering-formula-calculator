import { Link } from "@tanstack/react-router";

const TECH = [
  {
    name: "HTML5",
    what: "The standard markup language used to structure web pages.",
    used: "Built the layout, navigation, forms, subject pages, calculator interface, and learning sections.",
    why: "Semantic structure, accessibility and cross-browser compatibility.",
  },
  {
    name: "CSS3 + Tailwind",
    what: "A styling language used to design and format web pages.",
    used: "Pastel theme, responsive layout, animations, cards, typography and dark mode.",
    why: "Visually attractive, readable and responsive across devices.",
  },
  {
    name: "TypeScript / JavaScript",
    what: "A programming language that adds interactivity to websites.",
    used: "Formula calculations, validation, search, bookmarks, history, dark mode, AI interface, unit and scientific calculators.",
    why: "Enables dynamic behaviour and makes the site an interactive learning platform.",
  },
  {
    name: "React + TanStack Start",
    what: "A modern component framework with typed file-based routing.",
    used: "Every page, navigation and reusable calculator widget.",
    why: "Fast, type-safe UI with server functions for the AI layer.",
  },
  {
    name: "Python-style function library",
    what: "Reusable engineering functions modelled after a Python backend.",
    used: "Formula solvers in src/lib/formulas.ts follow the same shape.",
    why: "Easy to maintain, expand and mirror in a Python service later.",
  },
  {
    name: "AI / LLM Layer (Lovable AI)",
    what: "An intelligent assistant that understands natural language.",
    used: "Analyses the student's problem, identifies the correct formula and explains why it fits.",
    why: "Helps students learn conceptually instead of memorising.",
  },
];

export function TechUsed() {
  return (
    <section className="border-t border-border bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Stack</p>
          <h2 className="mt-1 text-3xl font-bold">Technologies Used in This Project</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TECH.map(t => (
            <div key={t.name} className="card-elevated card-elevated-hover p-6">
              <h3 className="text-lg font-bold">{t.name}</h3>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">What it is</p>
              <p className="text-sm">{t.what}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Used in this project</p>
              <p className="text-sm">{t.used}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Why it was chosen</p>
              <p className="text-sm">{t.why}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="grid h-9 w-9 place-items-center rounded-xl text-white font-bold"
              style={{ background: "var(--gradient-primary)" }}
            >
              ∑
            </div>
            <span className="font-bold">Formula Lab</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Engineering Formula Calculator &amp; Smart Learning Platform for first-year students.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/subjects" className="hover:text-foreground">Subjects</Link></li>
            <li><Link to="/library" className="hover:text-foreground">Formula Library</Link></li>
            <li><Link to="/ai-assistant" className="hover:text-foreground">AI Assistant</Link></li>
            <li><Link to="/practice" className="hover:text-foreground">Practice</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Tools</h4>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li><Link to="/unit-converter" className="hover:text-foreground">Unit Converter</Link></li>
            <li><Link to="/scientific-calculator" className="hover:text-foreground">Scientific Calculator</Link></li>
            <li><Link to="/bookmarks" className="hover:text-foreground">Bookmarks</Link></li>
            <li><Link to="/history" className="hover:text-foreground">History</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Formula Lab · Built with Lovable AI
      </div>
    </footer>
  );
}
