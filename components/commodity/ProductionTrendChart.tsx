'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { chartColors as C } from '@/lib/chart-colors';

interface ProductionTrendChartProps {
  production_trend: Array<{
    date: string;
    volume_tbpd: number;
    rolling_avg_12m: number | null;
  }>;
  className?: string;
}

function formatXTick(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
}

function formatYTick(value: number): string {
  return `${(value / 1000).toFixed(0)}`;
}

export function ProductionTrendChart({
  production_trend, className,
}: ProductionTrendChartProps) {
  const animate = !useReducedMotion();

  return (
    <Card className={`flex flex-col gap-3 ${className ?? ''}`}>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xs font-semibold tracking-wide text-muted">
          World Production Trend
        </h2>
        <span className="text-[10px] text-muted/70">million barrels per day (Mb/d)</span>
      </div>

      <div role="img" aria-label="World production trend chart with 12-month rolling average">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={production_trend}
            margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
          >
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
              width={40}
              label={{ value: 'Mb/d', angle: -90, position: 'insideLeft', offset: 12, style: { fontSize: 10, fill: C.muted } }}
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
              formatter={(value, name) => [
                `${formatYTick(value as number)} Mb/d`,
                name === 'volume_tbpd' ? 'Production' : '12m Avg',
              ]}
            />
            <Legend
              formatter={(value) => value === 'volume_tbpd' ? 'Production' : '12m Avg'}
              wrapperStyle={{ fontSize: 11, color: C.muted }}
            />
            <Line
              type="monotone"
              dataKey="volume_tbpd"
              stroke={C.line}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={animate}
              animationDuration={700}
              animationBegin={0}
            />
            <Line
              type="monotone"
              dataKey="rolling_avg_12m"
              stroke={C.avg}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={animate}
              animationDuration={700}
              animationBegin={0}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
