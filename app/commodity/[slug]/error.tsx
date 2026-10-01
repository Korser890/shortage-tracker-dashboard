'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <p className="text-xs font-semibold tracking-wide text-muted">Error</p>
        <h1 className="text-2xl font-bold text-content text-balance">Could not load commodity</h1>
        <p className="text-sm text-muted">The API may be unavailable or this commodity has no data.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center rounded-md border border-edge px-4 py-2 text-xs font-medium text-muted hover:text-content hover:border-content/30 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-edge px-4 py-2 text-xs font-medium text-muted hover:text-content hover:border-content/30 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
