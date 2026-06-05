import { Card } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import type { Flag } from '@/lib/types';

const ITEMS: { flag: Flag; label: string; condition: string }[] = [
  {
    flag: 'NORMAL',
    label: 'Normal',
    condition: 'z-score < 1.0 and price within 15% of 1y average',
  },
  {
    flag: 'RISKY',
    label: 'Risky',
    condition: 'z-score = 1.0–2.0 or price 15–30% above 1y average',
  },
  {
    flag: 'CRITICAL',
    label: 'Critical',
    condition: 'z-score > 2.0 or price 30%+ above 1y average',
  },
];

export function FlagLegend() {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
        Flag Methodology
      </p>
      <div className="space-y-2.5">
        {ITEMS.map(({ flag, label, condition }) => (
          <div key={flag} className="flex items-center gap-3">
            <StatusDot flag={flag} size="md" />
            <span className="w-16 text-xs font-medium text-content">{label}</span>
            <span className="text-xs text-muted">{condition}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-edge pt-3 text-xs text-muted">
        Z-score measures how far the current price sits from its 1-year average, relative to historical volatility. A score of 1.0 means one standard deviation above normal; above 2.0 means historically unusual.
      </p>
    </Card>
  );
}
