import { StatusDot } from '@/components/ui/StatusDot';
import type { Flag } from '@/lib/types';

const ITEMS: { flag: Flag; label: string; condition: string }[] = [
  {
    flag: 'NORMAL',
    label: 'Normal',
    condition: 'z-score < 1.0 and price within 15% of 12-month average',
  },
  {
    flag: 'RISKY',
    label: 'Risky',
    condition: 'z-score = 1.0–2.0 or price 15–30% above 12-month average',
  },
  {
    flag: 'CRITICAL',
    label: 'Critical',
    condition: 'z-score > 2.0 or price 30%+ above 12-month average',
  },
];

export function FlagLegend() {
  return (
    <details className="group rounded-xl border border-edge bg-card px-5 py-4 shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold tracking-wide text-muted transition-colors hover:text-content">
        How are signals calculated?
        <span className="transition-transform duration-200 group-open:rotate-180" aria-hidden="true">▾</span>
      </summary>
      <div className="mt-3 space-y-2.5">
        {ITEMS.map(({ flag, label, condition }) => (
          <div key={flag} className="grid grid-cols-[1rem_4rem_1fr] items-start gap-x-3">
            <div className="mt-0.5"><StatusDot flag={flag} size="md" /></div>
            <span className="text-xs font-medium text-content">{label}</span>
            <span className="text-xs leading-relaxed text-muted">{condition}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-edge pt-3 text-xs text-muted">
        Z-score measures how far the current price sits from its 12-month average, relative to historical volatility. A score of 1.0 means one standard deviation above normal. Above 2.0 means historically unusual.
      </p>
    </details>
  );
}
