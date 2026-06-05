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
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return `${value.toFixed(0)}`;
}

export function ProductionTrendChart({
  production_trend, className,
}: ProductionTrendChartProps) {
  return (
    <Card className={`flex flex-col gap-3 ${className ?? ''}`}>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted">
        World Production Trend
      </span>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={production_trend}
          margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={formatXTick}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatYTick}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              borderColor: '#2E234A',
              backgroundColor: '#18112E',
              color: '#EEE9F8',
            }}
            labelStyle={{ color: '#7E7299' }}
            labelFormatter={(label) => formatXTick(label as string)}
            formatter={(value, name) => [
              `${(value as number).toFixed(2)} Tb/d`,
              name === 'volume_tbpd' ? 'Production' : '12m Avg',
            ]}
          />
          <Legend
            formatter={(value) => value === 'volume_tbpd' ? 'Production' : '12m Avg'}
            wrapperStyle={{ fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="volume_tbpd"
            stroke="#3b82f6"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="rolling_avg_12m"
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
            activeDot={{ r: 3 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
