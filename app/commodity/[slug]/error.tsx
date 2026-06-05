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
        <p className="text-xs font-medium uppercase tracking-widest text-muted">Error</p>
        <h1 className="text-2xl font-bold text-content">Could not load commodity</h1>
        <p className="text-sm text-muted">The API may be unavailable or this commodity has no data.</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="text-xs text-muted hover:text-content transition-colors underline underline-offset-4"
          >
            Try again
          </button>
          <Link href="/" className="text-xs text-muted hover:text-content transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
