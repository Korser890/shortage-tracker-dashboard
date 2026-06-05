import { formatDate } from '@/lib/format';
import { Card } from '@/components/ui/Card';


interface SupplyBalanceBarProps {
  current_gap_tbpd: number;
  min_gap_tbpd: number;
  max_gap_tbpd: number;
  latest_date: string;
  className?: string;
}

function formatGap(mbpd: number): string {
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
      <span className="text-xs font-semibold uppercase tracking-widest text-muted">
        Supply Balance
      </span>
      <div className="relative h-2 rounded-full bg-edge">
        {zeroPosition !== null && (
          <div
            className="absolute top-0 h-full w-px -translate-x-1/2 bg-muted/50"
            style={{ left: `${zeroPosition}%` }}
          />
        )}
        <div
          className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ${dotColor}`}
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-muted">{formatGap(min_gap_tbpd)}</span>
        <span className={`font-medium ${labelColor}`}>
          {formatGap(current_gap_tbpd)} now
        </span>
        <span className="text-muted">{formatGap(max_gap_tbpd)}</span>
      </div>
      <span className="text-xs text-muted">{formatDate(latest_date)}</span>
    </Card>
  );
}
