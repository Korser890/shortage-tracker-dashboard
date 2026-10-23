import { formatDate } from '@/lib/format';
import { Card } from '@/components/ui/Card';

interface InventoryTankProps {
  current_level: number;
  unit: string;
  five_year_max: number;
  fill_pct: number;
  streak_direction: string;
  streak_weeks: number;
  latest_date: string;
  className?: string;
}

function getTankColor(fill_pct: number): string {
  if (fill_pct < 40) return 'bg-flag-critical';
  if (fill_pct < 65) return 'bg-flag-risky';
  return 'bg-flag-normal';
}

function formatLevel(level: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(level);
}

export function InventoryTank({
  current_level, unit, five_year_max,
  fill_pct, streak_direction, streak_weeks,
  latest_date, className,
}: InventoryTankProps) {
  const clampedFill = Math.max(0, Math.min(100, fill_pct));
  const tankColor = getTankColor(clampedFill);
  const safeDirection = streak_direction || null;
  const streakSymbol = safeDirection === 'up' ? '▲' : safeDirection === 'down' ? '▼' : '●';
  const streakLabel = safeDirection === 'up'
    ? 'text-flag-normal'
    : safeDirection === 'down' && clampedFill < 40
    ? 'text-flag-critical'
    : 'text-muted';
  const streakText = safeDirection === 'up' ? 'Increasing' : safeDirection === 'down' ? 'Decreasing' : 'Stable';

  return (
    <Card className={`flex flex-col gap-3 ${className ?? ''}`}>
      <h2 className="text-xs font-semibold tracking-wide text-muted">
        US Crude Inventory
      </h2>

      <div className="flex items-end gap-4">
        <div className="relative h-32 w-10 overflow-hidden rounded border border-edge bg-surface">
          <div
            className={`absolute bottom-0 w-full transition-[height,background-color] duration-300 ${tankColor}`}
            style={{ height: `${clampedFill}%` }}
          />
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <span className="text-lg font-bold text-content">
            {clampedFill.toFixed(1)}%
          </span>
          <span className="text-xs text-muted">
            {formatLevel(current_level)} {unit}
          </span>
          <span className="text-xs text-muted">
            5yr max: {formatLevel(five_year_max)} {unit}
          </span>
          <span className={`text-xs font-medium ${streakLabel}`}>
            <span aria-hidden="true">{streakSymbol}</span>
            <span className="sr-only">{streakText}:</span>
            {' '}{streak_weeks} week streak
          </span>
        </div>
      </div>

      <span className="text-xs text-muted">{formatDate(latest_date)}</span>
      <p className="border-t border-edge pt-3 text-xs text-muted">
        Fill level vs. 5-year historical maximum. Below 40% signals tightening supply.
      </p>
    </Card>
  );
}

