// Client-only localStorage hooks for bookmarks, history and theme.
import { useEffect, useState, useCallback } from "react";

const isBrowser = typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser) return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export function useLocalList<T>(key: string) {
  const [items, setItems] = useState<T[]>([]);
  useEffect(() => { setItems(read<T[]>(key, [])); }, [key]);

  const set = useCallback((next: T[]) => {
    setItems(next);
    write(key, next);
  }, [key]);

  return [items, set] as const;
}

export function useBookmarks() {
  const [ids, setIds] = useLocalList<string>("efc:bookmarks");
  const has = (id: string) => ids.includes(id);
  const toggle = (id: string) => setIds(has(id) ? ids.filter(x => x !== id) : [...ids, id]);
  return { ids, has, toggle };
}

export interface HistoryEntry {
  id: string;
  formulaId: string;
  formulaName: string;
  timestamp: number;
  inputs: Record<string, number>;
  unknown: string;
  result: number;
}

export function useHistory() {
  const [items, setItems] = useLocalList<HistoryEntry>("efc:history");
  const add = (entry: Omit<HistoryEntry, "id" | "timestamp">) => {
    const next: HistoryEntry = { ...entry, id: crypto.randomUUID(), timestamp: Date.now() };
    setItems([next, ...items].slice(0, 100));
  };
  const clear = () => setItems([]);
  return { items, add, clear };
}

export function useRecentFormulas() {
  const [ids, setIds] = useLocalList<string>("efc:recent");
  const push = (id: string) => {
    const next = [id, ...ids.filter(x => x !== id)].slice(0, 8);
    setIds(next);
  };
  return { ids, push };
}

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = (isBrowser && (localStorage.getItem("efc:theme") as "light" | "dark" | null)) || "light";
    setThemeState(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);
  const setTheme = (t: "light" | "dark") => {
    setThemeState(t);
    if (isBrowser) {
      localStorage.setItem("efc:theme", t);
      document.documentElement.classList.toggle("dark", t === "dark");
    }
  };
  return { theme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
