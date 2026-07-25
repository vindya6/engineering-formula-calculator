import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Calculator, Copy, RotateCcw } from "lucide-react";
import type { Formula } from "@/lib/formulas";
import { useBookmarks, useHistory, useRecentFormulas } from "@/lib/storage";
import { useEffect } from "react";

interface Props {
  formula: Formula;
  prefill?: Record<string, number>;
}

function formatNumber(n: number) {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) !== 0 && (Math.abs(n) < 1e-3 || Math.abs(n) >= 1e6)) return n.toExponential(4);
  return Number(n.toPrecision(6)).toString();
}

export function CalculatorWidget({ formula, prefill }: Props) {
  const solvable = Object.keys(formula.solve);
  const [unknown, setUnknown] = useState<string>(solvable[0] ?? "");
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const v of formula.variables) init[v.key] = prefill?.[v.key]?.toString() ?? "";
    return init;
  });
  const [result, setResult] = useState<null | { value: number; steps: string[] }>(null);
  const [error, setError] = useState<string | null>(null);
  const { has, toggle } = useBookmarks();
  const { add } = useHistory();
  const { push } = useRecentFormulas();

  useEffect(() => { push(formula.id); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [formula.id]);

  const knowns = useMemo(() => formula.variables.filter(v => v.key !== unknown), [formula, unknown]);

  const calculate = () => {
    setError(null);
    const nums: Record<string, number> = {};
    for (const v of knowns) {
      const raw = values[v.key];
      const n = Number(raw);
      if (raw === "" || Number.isNaN(n)) {
        setError(`Enter a valid number for ${v.name}.`);
        return;
      }
      nums[v.key] = n;
    }
    const solver = formula.solve[unknown];
    if (!solver) return;
    try {
      const value = solver(nums);
      if (!isFinite(value)) throw new Error("Result is not a real number.");
      const steps = [
        `Formula: ${formula.expression}`,
        `Known values: ${knowns.map(v => `${v.symbol ?? v.key} = ${nums[v.key]} ${v.unit}`).join(", ")}`,
        `Unknown: ${unknown}`,
        `Result: ${unknown} = ${formatNumber(value)} ${formula.variables.find(v => v.key === unknown)?.unit ?? ""}`,
      ];
      setResult({ value, steps });
      add({
        formulaId: formula.id,
        formulaName: formula.name,
        inputs: nums,
        unknown,
        result: value,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to solve.");
    }
  };

  const reset = () => {
    setValues(Object.fromEntries(formula.variables.map(v => [v.key, ""])));
    setResult(null);
    setError(null);
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `${formula.name}\n${formula.expression}\n${unknown} = ${formatNumber(result.value)}`,
    );
  };

  if (solvable.length === 0) {
    return (
      <div className="card-elevated p-6 text-sm text-muted-foreground">
        This entry is conceptual — no numeric calculation is needed.
      </div>
    );
  }

  return (
    <div className="card-elevated p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Calculator className="h-3.5 w-3.5" /> Interactive Calculator
          </div>
          <h3 className="mt-1 text-xl font-bold">{formula.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the unknown and enter the values you know.
          </p>
        </div>
        <button
          onClick={() => toggle(formula.id)}
          aria-label="Bookmark"
          className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-muted"
        >
          {has(formula.id) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-secondary px-4 py-3 font-mono text-lg">
        {formula.expression}
      </div>

      <div className="mt-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Solve for
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {solvable.map(k => {
            const v = formula.variables.find(x => x.key === k);
            return (
              <button
                key={k}
                onClick={() => { setUnknown(k); setResult(null); }}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  unknown === k
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                {v?.symbol ?? v?.key} · {v?.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {knowns.map(v => (
          <label key={v.key} className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {v.name} {v.unit ? `(${v.unit})` : ""}
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={values[v.key] ?? ""}
              onChange={e => setValues({ ...values, [v.key]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              placeholder={`Enter ${v.symbol ?? v.key}`}
            />
          </label>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={calculate}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Calculate
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
        {result && (
          <button
            onClick={copyResult}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-muted"
          >
            <Copy className="h-3.5 w-3.5" /> Copy result
          </button>
        )}
      </div>

      {result && (
        <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">Step-by-step</div>
          <ol className="mt-2 space-y-1 text-sm">
            {result.steps.map((s, i) => (
              <li key={i} className="font-mono">
                <span className="mr-2 text-muted-foreground">{i + 1}.</span>{s}
              </li>
            ))}
          </ol>
          <div className="mt-3 text-2xl font-bold">
            {unknown} = {formatNumber(result.value)}{" "}
            <span className="text-base font-normal text-muted-foreground">
              {formula.variables.find(v => v.key === unknown)?.unit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
