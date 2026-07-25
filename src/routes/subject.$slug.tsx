import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { formulasBySubject, getSubject, type SubjectId } from "@/lib/formulas";
import { FormulaCard } from "@/components/formula-card";

export const Route = createFileRoute("/subject/$slug")({
  loader: ({ params }) => {
    const subject = getSubject(params.slug);
    if (!subject) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const s = loaderData ? getSubject(loaderData.slug) : undefined;
    return {
      meta: [
        { title: s ? `${s.name} — Formula Lab` : "Subject — Formula Lab" },
        { name: "description", content: s?.description ?? "Engineering subject" },
        { property: "og:title", content: s ? `${s.name} — Formula Lab` : "Subject" },
        { property: "og:description", content: s?.description ?? "" },
      ],
    };
  },
  component: SubjectPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl p-12 text-center">
      <h1 className="text-2xl font-bold">Subject not found</h1>
      <Link to="/subjects" className="mt-4 inline-block text-primary hover:underline">← Back to subjects</Link>
    </div>
  ),
});

function SubjectPage() {
  const { slug } = Route.useLoaderData();
  const subject = getSubject(slug)!;
  const formulas = formulasBySubject(subject.id as SubjectId);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link to="/subjects" className="text-sm text-muted-foreground hover:text-foreground">← All subjects</Link>
      <h1 className="mt-3 text-4xl font-extrabold">{subject.name}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{subject.description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {formulas.map((f) => <FormulaCard key={f.id} formula={f} />)}
      </div>
    </div>
  );
}
