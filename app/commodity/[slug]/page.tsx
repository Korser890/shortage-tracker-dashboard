import Link from 'next/link';
import { fetchCommodity } from '@/lib/api';
import type { Metadata } from 'next';
import { ComparisonTable } from '@/components/commodity/ComparisonTable';
import { InventoryTank } from '@/components/commodity/InventoryTank';
import { PriceTrendChart } from '@/components/commodity/PriceTrendChart';
import { ProductionTrendChart } from '@/components/commodity/ProductionTrendChart';
import { Pill } from '@/components/ui/Pill';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/format';
import type { Flag } from '@/lib/types';


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchCommodity(slug);
  return {
    title: `${data.meta.name} — Shortage Tracker`,
    description: `Live shortage signals, price trend, and inventory data for ${data.meta.name}.`,
  };
}


export default async function CommodityPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await fetchCommodity(slug);


  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">

        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-content transition-colors">
          ← Back to Dashboard
        </Link>

        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Commodity Detail
            </p>
            <h1 className="text-2xl font-bold text-content">{data.meta.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Pill flag={data.meta.current_flag as Flag} />
            <Badge>{formatPrice(data.meta.latest_price, data.meta.unit)}</Badge>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <PriceTrendChart price_trend={data.price_trend} unit={data.meta.unit} />
          <ComparisonTable
            current_price={data.comparison.current_price}
            avg_30d={data.comparison.avg_30d}
            avg_1y={data.comparison.avg_1y}
            dev_vs_30d_pct={data.comparison.dev_vs_30d_pct}
            dev_vs_1y_pct={data.comparison.dev_vs_1y_pct}
            unit={data.meta.unit}
          />
        </div>

        {data.inventory && (
          <div className="grid gap-4 lg:grid-cols-2">
            <InventoryTank
              current_level={data.inventory.current_level}
              unit={data.inventory.unit}
              five_year_max={data.inventory.five_year_max}
              fill_pct={data.inventory.fill_pct}
              streak_direction={data.inventory.streak_direction}
              streak_weeks={data.inventory.streak_weeks}
              latest_date={data.inventory.latest_date}
            />
          </div>
        )}

        {data.production_trend.length > 0 && (
          <ProductionTrendChart production_trend={data.production_trend} />
        )}

        <p className="text-xs text-muted">
          Last updated: {formatDate(data.price_trend.at(-1)?.date ?? '')}
        </p>

      </div>
    </main>
  );
}
