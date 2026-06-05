import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">404</p>
        <h1 className="text-2xl font-bold text-content">Page not found</h1>
        <p className="text-sm text-muted">That commodity or page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-content transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
