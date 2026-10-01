import { formatPrice, formatDevPct } from '@/lib/format';
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


export function ComparisonTable({
  current_price, avg_30d, avg_1y,
  dev_vs_30d_pct, dev_vs_1y_pct,
  unit, className,
}: ComparisonTableProps) {
  const d30 = formatDevPct(dev_vs_30d_pct);
  const d1y = formatDevPct(dev_vs_1y_pct);

  return (
    <Card className={`flex flex-col gap-3 ${className ?? ''}`}>
      <h2 className="text-xs font-semibold tracking-wide text-muted">
        Price Comparison
      </h2>

      <table className="w-full text-sm" aria-label="Price comparison">
        <tbody className="divide-y divide-edge">
          <tr>
            <th scope="row" className="py-2 text-left font-normal text-muted">Current</th>
            <td className="py-2 text-right font-medium text-content">
              {formatPrice(current_price, unit)}
            </td>
            <td className="py-2 pl-3 text-right text-muted" aria-label="no comparison">—</td>
          </tr>
          <tr>
            <th scope="row" className="py-2 text-left font-normal text-muted">30-day avg</th>
            <td className="py-2 text-right font-medium text-content">
              {formatPrice(avg_30d, unit)}
            </td>
            <td className={`py-2 pl-3 text-right font-medium ${d30.className}`}>
              {d30.text}
            </td>
          </tr>
          <tr>
            <th scope="row" className="py-2 text-left font-normal text-muted">12-month avg</th>
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
