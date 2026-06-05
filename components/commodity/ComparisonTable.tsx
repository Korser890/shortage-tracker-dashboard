import { formatPrice } from '@/lib/format';
import { Card } from '@/components/ui/Card';

interface ComparisonTableProps {
  current_price: number;
  avg_30d: number;
  avg_1y: number;
  dev_vs_30d_pct: number;
  dev_vs_1y_pct: number;
  unit: string;
  className?: string;
}


function formatDev(pct: number): { text: string; className: string } {
  const sign = pct >= 0 ? '+' : '';
  const className =
    pct >= 5 ? 'text-flag-critical' :
    pct >= 0 ? 'text-flag-risky' :
    'text-flag-normal';
  return { text: `${sign}${pct.toFixed(1)}%`, className };
}


export function ComparisonTable({
  current_price, avg_30d, avg_1y,
  dev_vs_30d_pct, dev_vs_1y_pct,
  unit, className,
}: ComparisonTableProps) {
  const d30 = formatDev(dev_vs_30d_pct);
  const d1y = formatDev(dev_vs_1y_pct);

  return (
    <Card className={`flex flex-col gap-3 ${className ?? ''}`}>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted">
        Price Comparison
      </span>

      <table className="w-full text-sm">
        <tbody className="divide-y divide-edge">
          <tr>
            <td className="py-2 text-muted">Current</td>
            <td className="py-2 text-right font-medium text-content">
              {formatPrice(current_price, unit)}
            </td>
            <td className="py-2 text-right" />
          </tr>
          <tr>
            <td className="py-2 text-muted">30-day avg</td>
            <td className="py-2 text-right font-medium text-content">
              {formatPrice(avg_30d, unit)}
            </td>
            <td className={`py-2 pl-3 text-right font-medium ${d30.className}`}>
              {d30.text}
            </td>
          </tr>
          <tr>
            <td className="py-2 text-muted">1-year avg</td>
            <td className="py-2 text-right font-medium text-content">
              {formatPrice(avg_1y, unit)}
            </td>
            <td className={`py-2 pl-3 text-right font-medium ${d1y.className}`}>
              {d1y.text}
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
