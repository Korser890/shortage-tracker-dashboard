'use client';

import { useEffect } from 'react';

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
        <h1 className="text-2xl font-bold text-content">Something went wrong</h1>
        <p className="text-sm text-muted">Could not load data. The API may be unavailable.</p>
        <button
          onClick={reset}
          className="text-xs text-muted hover:text-content transition-colors underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
