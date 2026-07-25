import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FORMULAS, SUBJECTS, type Difficulty, type SubjectId } from "@/lib/formulas";

interface Question {
  formulaId: string;
  formulaName: string;
  unknown: string;
  values: Record<string, number>;
  expected: number;
  prompt: string;
}

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function generate(subject: SubjectId | "all", difficulty: Difficulty): Question | null {
  const pool = FORMULAS.filter(f =>
    (subject === "all" || f.subject === subject) &&
    Object.keys(f.solve).length > 0 &&
    f.variables.length > 0 &&
    f.difficulty === difficulty,
  );
  if (pool.length === 0) return null;
  const f = pick(pool);
  const solvable = Object.keys(f.solve);
  const unknown = pick(solvable);
  const values: Record<string, number> = {};
  for (const v of f.variables) {
    if (v.key === unknown) continue;
    const range = difficulty === "Easy" ? [1, 20] : difficulty === "Medium" ? [1, 100] : [1, 500];
    values[v.key] = randInt(range[0], range[1]);
  }
  let expected: number;
  try { expected = f.solve[unknown](values); }
  catch { return null; }
  if (!isFinite(expected)) return null;
  const parts = f.variables
    .filter(v => v.key !== unknown)
    .map(v => `${v.symbol ?? v.key} = ${values[v.key]}${v.unit ? " " + v.unit : ""}`)
    .join(", ");
  return {
    formulaId: f.id,
    formulaName: f.name,
    unknown,
    values,
    expected,
    prompt: `Using ${f.name} (${f.expression}), given ${parts}, find ${unknown}.`,
  };
}

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — Formula Lab" },
      { name: "description", content: "Generate practice questions across engineering subjects and check answers instantly." },
      { property: "og:title", content: "Engineering Practice Questions" },
      { property: "og:description", content: "Sharpen your skills with random practice problems." },
    ],
  }),
  component: Practice,
});

function Practice() {
  const [subject, setSubject] = useState<SubjectId | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [question, setQuestion] = useState<Question | null>(() => generate("all", "Easy"));
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<null | { correct: boolean; expected: number }>(null);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });
  const [showHint, setShowHint] = useState(false);

  const next = () => {
    setQuestion(generate(subject, difficulty));
    setAnswer("");
    setFeedback(null);
    setShowHint(false);
  };

  const check = () => {
    if (!question) return;
    const n = Number(answer);
    if (Number.isNaN(n)) return;
    const tolerance = Math.max(0.01, Math.abs(question.expected) * 0.01);
    const correct = Math.abs(n - question.expected) < tolerance;
    setFeedback({ correct, expected: question.expected });
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), attempted: s.attempted + 1 }));
  };

  const filters = useMemo(() => ({ subject, difficulty }), [subject, difficulty]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">Practice</h1>
          <p className="mt-2 text-muted-foreground">Random questions from the library.</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
          Score: <span className="font-bold">{score.correct}</span> / {score.attempted}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={subject}
          onChange={e => setSubject(e.target.value as SubjectId | "all")}
          className="rounded-lg border border-input bg-card px-3 py-2 text-sm"
        >
          <option value="all">All subjects</option>
          {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value as Difficulty)}
          className="rounded-lg border border-input bg-card px-3 py-2 text-sm"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button
          onClick={() => setQuestion(generate(filters.subject, filters.difficulty))}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
        >
          New question
        </button>
      </div>

      <div className="card-elevated mt-6 p-6">
        {question ? (
          <>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Question</div>
            <p className="mt-1 text-lg">{question.prompt}</p>

            <div className="mt-4 flex gap-2">
              <input
                type="number"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Your answer"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2"
              />
              <button
                onClick={check}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Check
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button onClick={() => setShowHint(true)} className="rounded-full border border-border px-3 py-1 hover:bg-muted">
                Hint
              </button>
              <button onClick={next} className="rounded-full border border-border px-3 py-1 hover:bg-muted">
                Skip
              </button>
              <Link
                to="/formula/$id"
                params={{ id: question.formulaId }}
                className="rounded-full border border-border px-3 py-1 hover:bg-muted"
              >
                Open formula
              </Link>
            </div>

            {showHint && (
              <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                Use the formula from <Link to="/formula/$id" params={{ id: question.formulaId }} className="text-primary underline">{question.formulaName}</Link>. Solve for <span className="font-mono">{question.unknown}</span>.
              </div>
            )}

            {feedback && (
              <div
                className={`mt-4 rounded-lg p-3 text-sm ${
                  feedback.correct
                    ? "border border-[color:var(--success)]/40 bg-[color:var(--success)]/10 text-[color:var(--success)]"
                    : "border border-destructive/40 bg-destructive/10 text-destructive"
                }`}
              >
                {feedback.correct
                  ? "Correct! Great work."
                  : `Not quite. Expected ~ ${Number(feedback.expected.toPrecision(6))}.`}
                <div className="mt-2">
                  <button onClick={next} className="rounded-md bg-foreground px-3 py-1 text-xs text-background">Next question</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No questions available for these filters.</p>
        )}
      </div>
    </div>
  );
}
