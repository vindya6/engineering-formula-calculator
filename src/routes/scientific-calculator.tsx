import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const BUTTONS: { label: string; op: string; wide?: boolean; accent?: boolean }[][] = [
  [
    { label: "sin", op: "sin(" }, { label: "cos", op: "cos(" }, { label: "tan", op: "tan(" }, { label: "π", op: "PI" }, { label: "e", op: "E" },
  ],
  [
    { label: "log", op: "log10(" }, { label: "ln", op: "log(" }, { label: "√", op: "sqrt(" }, { label: "^", op: "**" }, { label: "!", op: "!" },
  ],
  [
    { label: "(", op: "(" }, { label: ")", op: ")" }, { label: "C", op: "CLEAR", accent: true }, { label: "⌫", op: "BACK", accent: true }, { label: "÷", op: "/" },
  ],
  [
    { label: "7", op: "7" }, { label: "8", op: "8" }, { label: "9", op: "9" }, { label: "×", op: "*" }, { label: "%", op: "%" },
  ],
  [
    { label: "4", op: "4" }, { label: "5", op: "5" }, { label: "6", op: "6" }, { label: "−", op: "-" }, { label: "1/x", op: "1/(" },
  ],
  [
    { label: "1", op: "1" }, { label: "2", op: "2" }, { label: "3", op: "3" }, { label: "+", op: "+" }, { label: "=", op: "EQ", accent: true },
  ],
  [
    { label: "0", op: "0", wide: true }, { label: ".", op: "." }, { label: "±", op: "NEG" }, { label: "ANS", op: "ANS" },
  ],
];

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function evaluate(expr: string, degrees: boolean): number {
  // Replace symbols
  let e = expr.replace(/PI/g, "Math.PI").replace(/E/g, "Math.E");
  const trig = degrees
    ? { sin: "Math.sin(Math.PI/180*", cos: "Math.cos(Math.PI/180*", tan: "Math.tan(Math.PI/180*" }
    : { sin: "Math.sin(", cos: "Math.cos(", tan: "Math.tan(" };
  e = e
    .replace(/\bsin\(/g, trig.sin)
    .replace(/\bcos\(/g, trig.cos)
    .replace(/\btan\(/g, trig.tan)
    .replace(/\bsqrt\(/g, "Math.sqrt(")
    .replace(/\blog10\(/g, "Math.log10(")
    .replace(/\blog\(/g, "Math.log(")
    .replace(/(\d+(?:\.\d+)?)!/g, (_, n) => String(factorial(Number(n))));
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${e});`)();
}

export const Route = createFileRoute("/scientific-calculator")({
  head: () => ({
    meta: [
      { title: "Scientific Calculator — Formula Lab" },
      { name: "description", content: "A modern scientific calculator with trigonometry, logarithms, roots and factorials." },
      { property: "og:title", content: "Scientific Calculator" },
      { property: "og:description", content: "Trigonometry, logs, roots, exponents and factorials." },
    ],
  }),
  component: SciCalc,
});

function SciCalc() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string>("0");
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [degrees, setDegrees] = useState(true);
  const [ans, setAns] = useState(0);

  const press = (op: string) => {
    if (op === "CLEAR") { setExpr(""); setResult("0"); return; }
    if (op === "BACK") { setExpr(expr.slice(0, -1)); return; }
    if (op === "NEG") { setExpr(expr ? `-(${expr})` : "-"); return; }
    if (op === "ANS") { setExpr(expr + String(ans)); return; }
    if (op === "EQ") {
      try {
        const r = evaluate(expr, degrees);
        const str = String(Number(r.toPrecision(12)));
        setResult(str);
        setAns(r);
        setHistory([{ expr, result: str }, ...history].slice(0, 10));
      } catch {
        setResult("Error");
      }
      return;
    }
    setExpr(expr + op);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold">Scientific Calculator</h1>
      <p className="mt-2 text-muted-foreground">Trig, logs, roots, exponents, factorials.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card-elevated p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-1 rounded-full bg-muted p-1 text-xs">
              <button
                onClick={() => setDegrees(true)}
                className={`rounded-full px-3 py-1 ${degrees ? "bg-primary text-primary-foreground" : ""}`}
              >
                Deg
              </button>
              <button
                onClick={() => setDegrees(false)}
                className={`rounded-full px-3 py-1 ${!degrees ? "bg-primary text-primary-foreground" : ""}`}
              >
                Rad
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-muted p-4 text-right">
            <div className="min-h-[1.5rem] font-mono text-sm text-muted-foreground break-all">{expr || "\u00A0"}</div>
            <div className="mt-1 font-mono text-3xl font-bold break-all">{result}</div>
          </div>
          <div className="mt-4 space-y-2">
            {BUTTONS.map((row, i) => (
              <div key={i} className="grid grid-cols-5 gap-2">
                {row.map(b => (
                  <button
                    key={b.label}
                    onClick={() => press(b.op)}
                    className={`rounded-lg border px-3 py-3 text-sm font-semibold transition-colors ${
                      b.accent
                        ? "border-primary bg-primary text-primary-foreground hover:opacity-90"
                        : "border-border bg-card hover:bg-muted"
                    } ${b.wide ? "col-span-2" : ""}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">History</h3>
          {history.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No calculations yet.</p>}
          <ul className="mt-3 space-y-2">
            {history.map((h, i) => (
              <li key={i} className="rounded-lg border border-border p-2 text-sm">
                <div className="font-mono text-xs text-muted-foreground break-all">{h.expr}</div>
                <div className="font-mono font-bold">= {h.result}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
