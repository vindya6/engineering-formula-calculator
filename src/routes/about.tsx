import { createFileRoute } from "@tanstack/react-router";
import { TechUsed } from "@/components/footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Formula Lab" },
      { name: "description", content: "About the Engineering Formula Calculator & Smart Learning Platform." },
      { property: "og:title", content: "About Formula Lab" },
      { property: "og:description", content: "An interactive learning platform for first-year engineering students." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">About the project</p>
        <h1 className="mt-1 text-4xl font-extrabold">A smarter way to learn engineering formulas.</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Formula Lab is an educational web application built for first-year engineering students.
          Instead of simply displaying formulas, it teaches concepts, recommends the correct formula
          for the problem you describe, performs the calculation, and explains every step.
        </p>
        <h2 className="mt-8 text-xl font-bold">What it covers</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>• Engineering Mathematics (Linear algebra, matrices, functions)</li>
          <li>• Engineering Physics</li>
          <li>• Engineering Chemistry</li>
          <li>• Basic Electrical & Electronics Engineering</li>
          <li>• Programming for Problem Solving (C)</li>
          <li>• English Communication Skills</li>
        </ul>
        <h2 className="mt-8 text-xl font-bold">Highlights</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Interactive calculator for every formula — solve any unknown variable.</li>
          <li>• AI Formula Assistant that reads your problem and picks the right formula.</li>
          <li>• Practice mode with instant checking and hints.</li>
          <li>• Scientific calculator and engineering unit converter.</li>
          <li>• Bookmarks and history stored locally on your device.</li>
          <li>• Beautiful dark mode designed for long study sessions.</li>
        </ul>
      </div>
      <TechUsed />
    </div>
  );
}
