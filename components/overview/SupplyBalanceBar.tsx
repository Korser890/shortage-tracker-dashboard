import { formatDate } from '@/lib/format';
import { Card } from '@/components/ui/Card';


interface SupplyBalanceBarProps {
  current_gap_tbpd: number;
  min_gap_tbpd: number;
  max_gap_tbpd: number;
  latest_date: string;
  className?: string;
}

function formatGap(tbpd: number): string {
  const mbpd = tbpd / 1000;
  const sign = mbpd >= 0 ? '+' : '';
  return `${sign}${mbpd.toFixed(1)} Mb/d`;
}

export function SupplyBalanceBar({
  current_gap_tbpd,
  min_gap_tbpd,
  max_gap_tbpd,
  latest_date,
  className,
}: SupplyBalanceBarProps) {
  const range = max_gap_tbpd - min_gap_tbpd;
  const position = range > 0
    ? Math.max(0, Math.min(100, ((current_gap_tbpd - min_gap_tbpd) / range) * 100))
    : 50;
  const zeroPosition = range > 0 && min_gap_tbpd < 0 && max_gap_tbpd > 0
    ? (-min_gap_tbpd / range) * 100
    : null;
  const isDeficit = current_gap_tbpd < 0;
  const dotColor   = isDeficit ? 'bg-flag-critical' : 'bg-flag-normal';
  const labelColor = isDeficit ? 'text-flag-critical' : 'text-flag-normal';

  return (
    <Card className={`flex flex-col gap-3 ${className ?? ''}`}>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-sm font-semibold text-content">
          Supply Balance
        </h2>
        <span className="text-[10px] text-muted/70">million barrels per day (Mb/d)</span>
      </div>
      <div
        role="img"
        aria-label={`Supply balance: ${formatGap(current_gap_tbpd)} (range: ${formatGap(min_gap_tbpd)} to ${formatGap(max_gap_tbpd)})`}
      >
        <div className="relative h-2 rounded-full bg-edge">
          {zeroPosition !== null && (
            <div
              className="absolute top-0 h-full w-px -translate-x-1/2 bg-muted/50"
              style={{ left: `${zeroPosition}%` }}
            />
          )}
          <div
            className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface shadow ${dotColor}`}
            style={{ left: `${position}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-muted">{formatGap(min_gap_tbpd)}</span>
        <span className={`font-medium ${labelColor}`}>
          {formatGap(current_gap_tbpd)} now
        </span>
        <span className="text-muted">{formatGap(max_gap_tbpd)}</span>
      </div>
      <p className="text-xs text-muted">
        {isDeficit ? 'Consumption exceeds production' : 'Production exceeds consumption'}
        {' '}· {formatDate(latest_date)} · last 12 months
      </p>
    </Card>
  );
}
