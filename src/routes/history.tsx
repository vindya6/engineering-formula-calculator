import { createFileRoute, Link } from "@tanstack/react-router";
import { useHistory } from "@/lib/storage";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Formula Lab" },
      { name: "description", content: "Every calculation you've run, saved on this device." },
      { property: "og:title", content: "Calculation History" },
      { property: "og:description", content: "Revisit your recent calculations." },
    ],
  }),
  component: History,
});

function History() {
  const { items, clear } = useHistory();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold">History</h1>
          <p className="mt-2 text-muted-foreground">Recent calculations from this device.</p>
        </div>
        {items.length > 0 && (
          <button onClick={clear} className="rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted">
            Clear
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <div className="mt-8 card-elevated p-8 text-center">
          <p className="text-muted-foreground">No calculations yet.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map(h => (
            <li key={h.id} className="card-elevated p-4">
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/formula/$id"
                  params={{ id: h.formulaId }}
                  className="font-semibold hover:text-primary"
                >
                  {h.formulaName}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {new Date(h.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 font-mono text-sm text-muted-foreground">
                {Object.entries(h.inputs).map(([k, v]) => `${k}=${v}`).join(", ")} → {h.unknown} = {Number(h.result.toPrecision(6))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
