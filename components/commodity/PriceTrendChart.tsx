'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { SectionNote } from '@/components/ui/SectionNote';
import { chartColors as C } from '@/lib/chart-colors';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { eventsForChart } from '@/lib/supply-events';
import { RangeToggle, rangeTitle } from '@/components/commodity/RangeToggle';
import type { PriceRange } from '@/lib/api';

interface PriceTrendChartProps {
  price_trend: Array<{
    date: string;
    price: number;
    risky_threshold: number | null;
    critical_threshold: number | null;
  }>;
  unit: string;
  slug: string;
  range: PriceRange;
  className?: string;
}

const SERIES_LABELS: Record<string, string> = {
  price: 'Price',
  risky_threshold: 'Risky',
  critical_threshold: 'Critical',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Parse YYYY-MM-DD directly. `new Date(str)` reads it as UTC and can shift the day
 *  by one in western timezones. */
function dateParts(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month: MONTHS[month - 1], day };
}

// Day-level ticks are unreadable across 20 years, so the label widens with the range.
// Every label except 90d carries its year, so "Dec 23" can never mean two things.
function makeXTickFormatter(range: PriceRange) {
  if (range === 'max') {
    return (dateStr: string) => String(dateParts(dateStr).year);
  }
  if (range === '90d') {
    const fmt = (dateStr: string) => {
      const { month, day } = dateParts(dateStr);
      return `${day} ${month}`;
    };
    return fmt;
  }
  return (dateStr: string) => {
    const { year, month } = dateParts(dateStr);
    return `${month} '${String(year).slice(-2)}`;
  };
}

/** A chart is an image to a screen reader. This is its text equivalent: the shape of
 *  the series in words, with the numbers that matter rather than a 400-row table. */
function describeSeries(
  data: PriceTrendChartProps['price_trend'],
  title: string,
  unit: string,
): string {
  if (data.length === 0) return `Price trend over ${title.toLowerCase()}. No data available.`;

  const first = data[0];
  const last = data[data.length - 1];
  const low = data.reduce((a, b) => (b.price < a.price ? b : a));
  const high = data.reduce((a, b) => (b.price > a.price ? b : a));
  const scored = data.filter((d) => d.critical_threshold !== null);
  const overCritical = scored.filter((d) => d.price > (d.critical_threshold as number)).length;

  const direction =
    last.price > first.price ? 'rising' : last.price < first.price ? 'falling' : 'flat';

  const crossings = scored.length
    ? ` Above the critical threshold at ${overCritical} of ${scored.length} points.`
    : '';

  return (
    `Line chart of price in ${unit} over ${title.toLowerCase()}, ` +
    `${formatTooltipDate(first.date)} to ${formatTooltipDate(last.date)}, ${data.length} points. ` +
    `Starts at ${first.price.toFixed(2)} and ends at ${last.price.toFixed(2)}, overall ${direction}. ` +
    `Low ${low.price.toFixed(2)} on ${formatTooltipDate(low.date)}, ` +
    `high ${high.price.toFixed(2)} on ${formatTooltipDate(high.date)}.` +
    crossings +
    ' Dashed lines show the risky and critical thresholds at each date.'
  );
}

/** The tooltip is never abbreviated: a hovered point always names its exact day. */
function formatTooltipDate(dateStr: string): string {
  const { year, month, day } = dateParts(dateStr);
  return `${day} ${month} ${year}`;
}

/** "USD/barrel" -> "$". Derived rather than hardcoded, since the unit string carries the
 *  currency code and the project is meant to stay currency-agnostic. */
function currencySymbol(unit: string): string {
  const code = unit.split('/')[0];
  try {
    const part = new Intl.NumberFormat('en-US', { style: 'currency', currency: code })
      .formatToParts(0)
      .find((p) => p.type === 'currency');
    return part ? part.value : '';
  } catch {
    return '';
  }
}

/** "USD/barrel" -> "USD per barrel". The axis previously read just "barrel", which is a unit
 *  of volume, not of price. */
function spellOutUnit(unit: string): string {
  return unit.replace('/', ' per ');
}

export function PriceTrendChart({
  price_trend, unit, slug, range, className,
}: PriceTrendChartProps) {
  const displayUnit = unit.replace(/^USD\//, '');
  const symbol = currencySymbol(unit);
  const axisUnit = spellOutUnit(unit);
  const formatYTick = (value: number) => `${symbol}${value.toFixed(0)}`;
  const formatXTick = makeXTickFormatter(range);
  const title = rangeTitle(range);
  const description = describeSeries(price_trend, title, displayUnit);
  // 5Y and Max are bucketed, and each point is the bucket's highest real price.
  const bucketNote =
    range === '5y' ? 'weekly high' : range === 'max' ? 'monthly high' : null;
  const animate = !useReducedMotion();
  const events = eventsForChart(slug, price_trend.map((d) => d.date));

  return (
    <Card className={`flex flex-col gap-3 ${className ?? ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-semibold tracking-wide text-muted">
          Price Trend, {title}
        </h2>
        <RangeToggle slug={slug} active={range} />
      </div>
      <SectionNote>
        The dashed lines are the Risky and Critical limits. They move over time because they are recalculated from this commodity&apos;s own recent history.
      </SectionNote>

      <div role="img" aria-label={description}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={price_trend} margin={{ top: 22, right: 56, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="date"
              tickFormatter={formatXTick}
              tick={{ fontSize: 11, fill: C.muted }}
              tickLine={false}
              axisLine={false}
              minTickGap={48}
            />
            <YAxis
              tickFormatter={formatYTick}
              tick={{ fontSize: 11, fill: C.muted }}
              tickLine={false}
              axisLine={false}
              width={56}
              label={{ value: axisUnit, angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 10, fill: C.muted } }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                lineHeight: 1.35,
                padding: '5px 8px',
                borderRadius: 6,
                borderColor: C.edge,
                backgroundColor: C.card,
                color: C.content,
              }}
              labelStyle={{ color: C.muted, fontSize: 10, marginBottom: 2 }}
              itemStyle={{ padding: 0 }}
              wrapperStyle={{ outline: 'none' }}
              // The unit sits in the label so it is not repeated on all three rows.
              labelFormatter={(label) => formatTooltipDate(label as string)}
              formatter={(value, name) => [
                `${symbol}${(value as number).toFixed(2)}`,
                SERIES_LABELS[name as string] ?? name,
              ]}
            />
            {events.map((event) =>
              event.band ? (
                <ReferenceArea
                  key={`${event.id}-band`}
                  x1={event.band.from}
                  x2={event.band.to}
                  fill={C.content}
                  fillOpacity={0.07}
                  label={{
                    value: event.band.caption,
                    position: 'insideTop',
                    fontSize: 9,
                    fill: C.muted,
                  }}
                />
              ) : null,
            )}
            {events.map((event) => (
              <ReferenceLine
                key={event.id}
                x={event.eventX}
                stroke={C.muted}
                strokeDasharray="2 3"
                label={{ value: event.label, position: 'top', fontSize: 9, fill: C.muted }}
              />
            ))}
            <Line
              type="monotone"
              dataKey="risky_threshold"
              stroke={C.risky}
              strokeWidth={1}
              strokeDasharray="4 3"
              dot={false}
              activeDot={false}
              connectNulls={false}
              isAnimationActive={animate}
              animationDuration={700}
              animationBegin={0}
            />
            <Line
              type="monotone"
              dataKey="critical_threshold"
              stroke={C.critical}
              strokeWidth={1}
              strokeDasharray="4 3"
              dot={false}
              activeDot={false}
              connectNulls={false}
              isAnimationActive={animate}
              animationDuration={700}
              animationBegin={0}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={C.line}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={animate}
              animationDuration={700}
              animationBegin={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4" style={{ backgroundColor: C.line }} />
          Price
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 border-t border-dashed" style={{ borderColor: C.risky }} />
          Risky threshold
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-4 border-t border-dashed" style={{ borderColor: C.critical }} />
          Critical threshold
        </span>
        {bucketNote && <span className="text-muted/70">Each point is the {bucketNote}</span>}
      </div>

      {events.length > 0 && (
        <div className="border-t border-edge pt-3">
          <h3 className="text-[11px] font-semibold tracking-wide text-muted">Events shown</h3>
          <ul className="mt-2 flex flex-col gap-1.5">
            {events.map((event) => (
              <li key={`${event.id}-note`} className="text-[11px] leading-snug text-muted">
                <span className="text-content">{formatTooltipDate(event.date)}</span>
                {' · '}
                {event.title}
                {event.detail ? `. ${event.detail}.` : '.'}
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[11px] leading-snug text-muted/80">
            Flags are computed from historical data. The tracker has run live since April 2026.
          </p>
        </div>
      )}
    </Card>
  );
}
