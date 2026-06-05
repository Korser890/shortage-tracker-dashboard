import Link from 'next/link';
import { fetchOverview } from '@/lib/api';
import { CommodityCard } from '@/components/overview/CommodityCard';
import { FlagTimeline } from '@/components/overview/FlagTimeline';
import { HeadlinePanel } from '@/components/overview/HeadlinePanel';
import { SupplyBalanceBar } from '@/components/overview/SupplyBalanceBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Flag } from '@/lib/types';
import { formatDate } from '@/lib/format';


export default async function HomePage() {
  const data = await fetchOverview();
  

  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">

        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">Dashboard</p>
            <h1 className="text-2xl font-bold text-content">Global Resource Shortage Tracker</h1>
          </div>
          <Badge>Updated {formatDate(data.meta.last_updated)}</Badge>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.commodities.map((c) => (
            <Link key={c.slug} href={`/commodity/${c.slug}`} className="block">
              <CommodityCard
                name={c.name}
                unit={c.unit}
                latest_price={c.latest_price}
                price_dev_pct={c.price_dev_pct}
                flag={c.flag as Flag}
                days_in_flag={c.days_in_flag}
              />
            </Link>
          ))}
        </section>

        <Card className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Signal History — 90 days
          </p>
          {data.commodities.map((c) => (
            <FlagTimeline key={c.slug} history={c.flag_history} label={c.name} />
          ))}
        </Card>

        {data.headlines.length > 0 && (
          <HeadlinePanel headlines={data.headlines} />
        )}
        {data.supply_balance && (
          <SupplyBalanceBar
            current_gap_tbpd={data.supply_balance.current_gap_tbpd}
            min_gap_tbpd={data.supply_balance.min_gap_tbpd}
            max_gap_tbpd={data.supply_balance.max_gap_tbpd}
            latest_date={data.supply_balance.latest_date}
          />
        )}

      </div>
    </main>
  );
}
