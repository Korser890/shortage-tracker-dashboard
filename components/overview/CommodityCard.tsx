import type { Flag } from '@/lib/types';
import { formatPrice, formatDevPct } from '@/lib/format';
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
  const { text, className } = formatDevPct(pct);
  return { text: `${text} vs 12-month avg`, className };
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
    <Card className="group flex flex-col gap-3 transition-colors hover:border-content/40 hover:shadow-md active:opacity-90">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-muted">{name}</span>
        <div className="flex shrink-0 items-center gap-1.5">
          <Pill flag={flag} />
          <span className="text-[10px] text-muted/40 transition-colors group-hover:text-muted" aria-hidden="true">→</span>
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight text-content leading-tight">
        {formatPrice(latest_price, unit)}
      </p>
      <div className="flex flex-col gap-1 text-xs">
        <span className={dev.className}>{dev.text}</span>
        {days_in_flag !== null && (
          <span className="text-muted">{days_in_flag} days at current flag</span>
        )}
      </div>
    </Card>
  );
}
