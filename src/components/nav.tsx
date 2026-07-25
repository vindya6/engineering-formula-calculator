import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/storage";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/subjects", label: "Subjects" },
  { to: "/library", label: "Formula Library" },
  { to: "/ai-assistant", label: "AI Assistant" },
  { to: "/practice", label: "Practice" },
  { to: "/unit-converter", label: "Units" },
  { to: "/scientific-calculator", label: "Calculator" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
];

export function Nav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <div
            className="grid h-9 w-9 place-items-center rounded-xl text-white font-bold"
            style={{ background: "var(--gradient-primary)" }}
          >
            ∑
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold leading-tight">Formula Lab</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">
              Engineering
            </div>
          </div>
        </Link>

        <nav className="ml-6 hidden flex-1 items-center gap-1 lg:flex">
          {LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-lg px-3 py-1.5 text-sm font-semibold text-foreground bg-muted" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/library"
            className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted sm:flex"
          >
            <Search className="h-3.5 w-3.5" />
            Search formulas…
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card hover:bg-muted"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-1 p-3">
            {LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
