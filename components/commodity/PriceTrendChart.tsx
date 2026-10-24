'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { chartColors as C } from '@/lib/chart-colors';
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

function getThresholds(data: PriceTrendChartProps['price_trend']) {
  const last = [...data].reverse().find(
    (d) => d.risky_threshold !== null && d.critical_threshold !== null
  );
  return {
    risky: last?.risky_threshold ?? null,
    critical: last?.critical_threshold ?? null,
  };
}

// Day-level ticks are unreadable across 20 years, so the label widens with the range.
function makeXTickFormatter(range: PriceRange) {
  if (range === 'max') {
    return (dateStr: string) => String(new Date(dateStr).getFullYear());
  }
  if (range === '5y') {
    return (dateStr: string) =>
      new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }
  return (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatYTick(value: number): string {
  return value.toFixed(0);
}

export function PriceTrendChart({
  price_trend, unit, slug, range, className,
}: PriceTrendChartProps) {
  const { risky, critical } = getThresholds(price_trend);
  const displayUnit = unit.replace(/^USD\//, '');
  const formatXTick = makeXTickFormatter(range);
  const title = rangeTitle(range);

  return (
    <Card className={`flex flex-col gap-3 ${className ?? ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-semibold tracking-wide text-muted">
          Price Trend, {title}
        </h2>
        <RangeToggle slug={slug} active={range} />
      </div>

      <div role="img" aria-label={`Price trend over ${title.toLowerCase()} (${unit})`}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={price_trend} margin={{ top: 4, right: 56, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="date"
              tickFormatter={formatXTick}
              tick={{ fontSize: 11, fill: C.muted }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatYTick}
              tick={{ fontSize: 11, fill: C.muted }}
              tickLine={false}
              axisLine={false}
              width={48}
              label={{ value: displayUnit, angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 10, fill: C.muted } }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                borderColor: C.edge,
                backgroundColor: C.card,
                color: C.content,
              }}
              labelStyle={{ color: C.muted }}
              labelFormatter={(label) => formatXTick(label as string)}
              formatter={(value) => [`${(value as number).toFixed(2)} ${displayUnit}`, 'Price']}
            />
            {risky !== null && (
              <ReferenceLine
                y={risky}
                stroke={C.risky}
                strokeDasharray="4 3"
                label={{ value: 'Risky', position: 'right', fontSize: 10, fill: C.risky }}
              />
            )}
            {critical !== null && (
              <ReferenceLine
                y={critical}
                stroke={C.critical}
                strokeDasharray="4 3"
                label={{ value: 'Critical', position: 'right', fontSize: 10, fill: C.critical }}
              />
            )}
            <Line
              type="monotone"
              dataKey="price"
              stroke={C.line}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
