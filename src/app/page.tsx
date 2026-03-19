export default function HomePage(): JSX.Element {
  return (
    <div className="flex h-full min-h-[50vh] flex-col justify-center gap-4">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
        Sun Tracker Website
      </p>
      <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
        Baseline layout is ready for map, controls, and solar analytics modules.
      </h1>
      <p className="max-w-2xl text-base text-slate-600">
        Task 001 setup complete: Next.js App Router, Tailwind, TypeScript,
        Vitest, and core dependencies are configured.
      </p>
    </div>
  );
}
