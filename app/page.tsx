import Link from 'next/link';
import { fetchOverview } from '@/lib/api';
import { CommodityCard } from '@/components/overview/CommodityCard';
import { FlagTimeline } from '@/components/overview/FlagTimeline';
import { HeadlinePanel } from '@/components/overview/HeadlinePanel';
import { SupplyBalanceBar } from '@/components/overview/SupplyBalanceBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Pill } from '@/components/ui/Pill';
import type { Flag } from '@/lib/types';
import { formatDate, daysAgo } from '@/lib/format';
import { FlagLegend } from '@/components/overview/FlagLegend';
import { StaleDataBanner } from '@/components/overview/StaleDataBanner';


export const revalidate = 3600;


export default async function HomePage() {
  const data = await fetchOverview();
  const daysSince = Math.floor(
    (Date.now() - new Date(data.meta.last_updated).getTime()) / (1000 * 60 * 60 * 24)
  );
  const isStale = daysSince > 10;

  const criticalCount = data.commodities.filter(c => c.flag === 'CRITICAL').length;
  const riskyCount    = data.commodities.filter(c => c.flag === 'RISKY').length;
  const total         = data.commodities.length;
  const statusFlag: Flag = criticalCount > 0 ? 'CRITICAL' : riskyCount > 0 ? 'RISKY' : 'NORMAL';
  // "X of Y" agrees with Y, not X, so the plural follows `total` and is always plural at four.
  const statusMessage = criticalCount > 0
    ? `${criticalCount} of ${total} commodities flagged`
    : riskyCount > 0
    ? `${riskyCount} of ${total} commodities elevated`
    : `All ${total} commodities within expected range`;
  const STATUS_BG: Record<Flag, string> = {
    CRITICAL: 'bg-flag-critical/10 border-flag-critical/25',
    RISKY:    'bg-flag-risky/10 border-flag-risky/25',
    NORMAL:   'bg-flag-normal/10 border-flag-normal/25',
  };
  // Every commodity in the worst tier, not just the first one in the array. `find()` used to
  // return whichever happened to be ordered first, which read as if only one was flagged.
  const flaggedCommodities = criticalCount > 0
    ? data.commodities.filter(c => c.flag === 'CRITICAL')
    : riskyCount > 0
    ? data.commodities.filter(c => c.flag === 'RISKY')
    : [];

  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">

        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold text-content text-balance">Global Resource Shortage Tracker</h1>
            <p className="mt-2 max-w-sm text-sm text-muted">Live shortage signals for crude oil and natural gas, updated daily from EIA and FRED.</p>
          </div>
          <Badge className="gap-1">
            Latest price
            <time dateTime={data.meta.last_updated}>{formatDate(data.meta.last_updated)}</time>
            <span aria-hidden="true">·</span>
            <span>{daysAgo(data.meta.last_updated)}</span>
          </Badge>
        </header>

        {isStale && <StaleDataBanner daysSince={daysSince} />}

        <div
          role={statusFlag === 'CRITICAL' ? 'alert' : 'status'}
          aria-label="System status"
          className={`rounded-lg border px-6 py-5 ${STATUS_BG[statusFlag]}`}
        >
          <div className="flex items-center gap-3">
            <Pill flag={statusFlag} />
            <span className="text-lg font-bold text-content">{statusMessage}</span>
          </div>
          {flaggedCommodities.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-sm text-muted">
              {flaggedCommodities.map((c) => (
                <li key={c.slug}>
                  {c.name}:{' '}
                  {c.price_dev_pct >= 0 ? '+' : ''}{c.price_dev_pct.toFixed(1)}%{' '}
                  {c.price_dev_pct >= 0 ? 'above' : 'below'} 12-month avg
                </li>
              ))}
            </ul>
          )}
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.commodities.map((c) => (
            <Link key={c.slug} href={`/commodity/${c.slug}`} className="block" aria-label={`View ${c.name} details`}>
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
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-content">
              Signal History, 90 days
            </h2>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-flag-normal" aria-hidden="true" />
                <span className="text-[10px] text-muted">Normal</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-flag-risky" aria-hidden="true" />
                <span className="text-[10px] text-muted">Risky</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-flag-critical" aria-hidden="true" />
                <span className="text-[10px] text-muted">Critical</span>
              </span>
            </div>
          </div>
          {data.commodities.map((c) => (
            <FlagTimeline key={c.slug} history={c.flag_history} label={c.name} />
          ))}
        </Card>

        <FlagLegend />

        <HeadlinePanel headlines={data.headlines} />
        {data.supply_balance ? (
          <SupplyBalanceBar
            current_gap_tbpd={data.supply_balance.current_gap_tbpd}
            min_gap_tbpd={data.supply_balance.min_gap_tbpd}
            max_gap_tbpd={data.supply_balance.max_gap_tbpd}
            latest_date={data.supply_balance.latest_date}
          />
        ) : (
          <Card>
            <h2 className="text-sm font-semibold text-content mb-2">Supply Balance</h2>
            <p className="text-sm text-muted">Oil supply balance data is currently unavailable.</p>
          </Card>
        )}

      </div>
    </main>
  );
}
