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
  const streakSymbol = streak_direction === 'up' ? '▲' : '▼';
  const streakLabel = streak_direction === 'up' ? 'text-flag-normal' : 'text-flag-critical';

  return (
    <Card className={`flex flex-col gap-3 ${className ?? ''}`}>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted">
        US Crude Inventory
      </span>

      <div className="flex items-end gap-4">
        <div className="relative h-32 w-10 overflow-hidden rounded border border-edge bg-surface">
          <div
            className={`absolute bottom-0 w-full transition-all ${tankColor}`}
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
            {streakSymbol} {streak_weeks}w streak
          </span>
        </div>
      </div>

      <span className="text-xs text-muted">{formatDate(latest_date)}</span>
    </Card>
  );
}

