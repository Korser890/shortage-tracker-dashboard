import Link from 'next/link';
import { fetchCommodity, fetchOverview } from '@/lib/api';
import type { Metadata } from 'next';
import { ComparisonTable } from '@/components/commodity/ComparisonTable';
import { InventoryTank } from '@/components/commodity/InventoryTank';
import { PriceTrendChart } from '@/components/commodity/PriceTrendChart';
import { parsePriceRange } from '@/components/commodity/RangeToggle';
import { ProductionTrendChart } from '@/components/commodity/ProductionTrendChart';
import { Pill } from '@/components/ui/Pill';
import { formatPrice, formatDate } from '@/lib/format';
import type { Flag } from '@/lib/types';


export const revalidate = 3600;


interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ range?: string }>;
}



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchCommodity(slug);
  return {
    title: `${data.meta.name} | Shortage Tracker`,
    description: `Live shortage signals, price trend, and inventory data for ${data.meta.name}.`,
  };
}


export default async function CommodityPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const range = parsePriceRange((await searchParams).range);
  const [data, overview] = await Promise.all([
    fetchCommodity(slug, range),
    fetchOverview(),
  ]);

  const devSign = data.comparison.dev_vs_1y_pct >= 0 ? '+' : '';
  const flagContext = data.meta.current_flag === 'CRITICAL'
    ? `At critical supply risk. Price is ${devSign}${data.comparison.dev_vs_1y_pct.toFixed(1)}% vs. its 1-year average`
    : data.meta.current_flag === 'RISKY'
    ? `At elevated supply risk. Price is ${devSign}${data.comparison.dev_vs_1y_pct.toFixed(1)}% vs. its 1-year average`
    : 'At normal supply levels. Price is within the expected range.';

  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">

        <Link href="/" aria-label="Back to dashboard" className="inline-flex items-center gap-1.5 py-1 text-xs text-muted hover:text-content transition-colors">
          <span aria-hidden="true">←</span> Back to Dashboard
        </Link>

        <nav className="flex flex-wrap gap-1" aria-label="All commodities">
          {overview.commodities.map((c) => (
            <Link
              key={c.slug}
              href={`/commodity/${c.slug}`}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                c.slug === slug
                  ? 'bg-edge text-content'
                  : 'text-muted hover:text-content hover:bg-edge/60'
              }`}
              aria-current={c.slug === slug ? 'page' : undefined}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Commodity Detail
            </p>
            <h1 className="text-2xl font-bold text-content text-balance">{data.meta.name}</h1>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <p className="text-3xl font-bold tracking-tight text-content">
              {formatPrice(data.meta.latest_price, data.meta.unit)}
            </p>
            <Pill flag={data.meta.current_flag as Flag} />
          </div>
        </header>

        <p className="text-sm text-muted">{flagContext}</p>

        <div className="grid gap-4 lg:grid-cols-2">
          <PriceTrendChart
            price_trend={data.price_trend}
            unit={data.meta.unit}
            slug={slug}
            range={range}
          />
          <ComparisonTable
            current_price={data.comparison.current_price}
            avg_30d={data.comparison.avg_30d}
            avg_1y={data.comparison.avg_1y}
            dev_vs_30d_pct={data.comparison.dev_vs_30d_pct}
            dev_vs_1y_pct={data.comparison.dev_vs_1y_pct}
            unit={data.meta.unit}
          />
        </div>

        {data.inventory ? (
          <InventoryTank
            current_level={data.inventory.current_level}
            unit={data.inventory.unit}
            five_year_max={data.inventory.five_year_max}
            fill_pct={data.inventory.fill_pct}
            streak_direction={data.inventory.streak_direction}
            streak_weeks={data.inventory.streak_weeks}
            latest_date={data.inventory.latest_date}
          />
        ) : (
          <p className="text-sm text-muted">US inventory tracking is available for crude oil only.</p>
        )}

        {data.production_trend.length > 0 ? (
          <ProductionTrendChart production_trend={data.production_trend} />
        ) : (
          <p className="text-sm text-muted">Production trend data is not available for this commodity.</p>
        )}

        <p className="text-xs text-muted">
          Last updated: {formatDate(data.price_trend.at(-1)?.date ?? '')}
        </p>

      </div>
    </main>
  );
}
