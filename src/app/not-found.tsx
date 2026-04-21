import Link from "next/link";

/**
 * Custom 404 page for the Next.js App Router.
 * Shows when a requested route is not found.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="text-6xl font-bold text-slate-300">404</div>
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Page not found
          </h1>

          <p className="text-center text-slate-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>

          <Link
            href="/"
            className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
