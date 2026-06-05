import type { Flag } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

interface CommodityCardProps {
  name: string;
  unit: string;
  latest_price: number;
  price_dev_pct: number;
  flag: Flag;
  days_in_flag: number | null;
}

function formatDev(pct: number): { text: string; className: string } {
  const sign = pct >= 0 ? '+' : '';
  return {
    text: `${sign}${pct.toFixed(1)}% vs 12-mo avg`,
    className: pct >= 0 ? 'text-flag-critical' : 'text-flag-normal',
  };
}

export function CommodityCard({
  name,
  unit,
  latest_price,
  price_dev_pct,
  flag,
  days_in_flag,
}: CommodityCardProps) {
  const dev = formatDev(price_dev_pct);
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-muted">{name}</span>
        <Pill flag={flag} className="shrink-0" />

      </div>
      <p className="text-2xl font-bold tracking-tight text-content leading-tight">
        {formatPrice(latest_price, unit)}
      </p>
      <div className="flex flex-col gap-1 text-xs">
        <span className={dev.className}>{dev.text}</span>
        {days_in_flag !== null && (
          <span className="text-muted">{days_in_flag}d at current flag</span>
        )}
      </div>
    </Card>
  );
}
