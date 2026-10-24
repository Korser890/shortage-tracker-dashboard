'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the OS "reduce motion" setting.
 *
 * Tailwind's `motion-reduce:` variant covers CSS animation, but Recharts animates in
 * JavaScript and ignores it entirely. Charts have to ask for the preference directly.
 *
 * Starts `false` so the server and the first client render agree, then updates on mount.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
