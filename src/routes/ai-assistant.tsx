import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { askFormulaAssistant } from "@/lib/ai-assistant.functions";
import { getFormula } from "@/lib/formulas";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Formula Assistant — Formula Lab" },
      { name: "description", content: "Describe your problem in plain English and get the right engineering formula, explained." },
      { property: "og:title", content: "AI Formula Assistant" },
      { property: "og:description", content: "An AI tutor that picks the right formula and solves it with you." },
    ],
  }),
  component: AiAssistant;
});

type Answer = Awaited<ReturnType<typeof askFormulaAssistant>>;

function AiAssistant() {
  const ask = useServerFn(askFormulaAssistant);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 3) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await ask({ data: { query } });
      setAnswer(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const suggestion = answer ? getFormula(answer.formulaId) : null;

  const openCalculator = () => {
    if (!suggestion) return;
    const params = new URLSearchParams();
    for (const e of answer?.extracted ?? []) {
      params.set(e.key, String(e.value));
    }
    navigate({ to: "/formula/$id", params: { id: suggestion.id }, search: Object.fromEntries(params) });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Formula Assistant
      </div>
      <h1 className="mt-3 text-4xl font-extrabold">Ask in plain English.</h1>
      <p className="mt-2 text-muted-foreground">
        Describe your problem. I'll pick the right formula, explain why, and open its calculator.
      </p>

      <form onSubmit={submit} className="mt-6 card-elevated p-4">
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          rows={3}
          placeholder="e.g. I know voltage is 220V and current is 5A. What is the power?"
          className="w-full resize-none bg-transparent p-2 text-base outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Powered by Lovable AI</div>
          <button
            type="submit"
            disabled={loading || query.trim().length < 3}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Ask assistant
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {[
          "Voltage 220V, current 5A. Find the power.",
          "A car of 1200kg accelerates at 3 m/s². What is the force?",
          "Height 20m, mass 5kg. Potential energy?",
          "Convert pH to hydrogen ion concentration for pH 3.",
        ].map(s => (
          <button
            key={s}
            onClick={() => setQuery(s)}
            className="rounded-full border border-border bg-card px-3 py-1 hover:bg-muted"
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {answer && (
        <div className="mt-8 card-elevated p-6">
          {suggestion ? (
            <>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Recommended formula</div>
              <h2 className="mt-1 text-2xl font-bold">{suggestion.name}</h2>
              <div className="mt-2 rounded-lg bg-secondary px-4 py-3 font-mono text-lg">{suggestion.expression}</div>
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Why this fits</div>
                <p className="mt-1 text-sm">{answer.reason}</p>
              </div>
              {answer.explanation && (
                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explanation</div>
                  <p className="mt-1 text-sm whitespace-pre-line">{answer.explanation}</p>
                </div>
              )}
              {answer.extracted.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Extracted values</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {answer.extracted.map(e => (
                      <span key={e.key} className="rounded-full bg-muted px-3 py-1 text-xs font-mono">
                        {e.key} = {e.value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={openCalculator}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Open calculator <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div>
              <p className="text-sm">{answer.reason}</p>
              <Link to="/library" className="mt-3 inline-block text-sm text-primary hover:underline">
                Browse the library →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
