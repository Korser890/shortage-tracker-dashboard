import Link from 'next/link';
import type { PriceRange } from '@/lib/api';

export const PRICE_RANGES: { value: PriceRange; label: string; title: string }[] = [
  { value: '90d', label: '90D', title: '90 Days' },
  { value: '1y',  label: '1Y',  title: '1 Year' },
  { value: '5y',  label: '5Y',  title: '5 Years' },
  { value: 'max', label: 'MAX', title: 'All Time' },
];

/** Runtime guard. PriceRange is a compile-time type, so the list has to exist twice. */
export function parsePriceRange(value: string | undefined): PriceRange {
  const match = PRICE_RANGES.find((r) => r.value === value);
  return match ? match.value : '1y';
}

export function rangeTitle(range: PriceRange): string {
  return PRICE_RANGES.find((r) => r.value === range)?.title ?? '1 Year';
}

interface RangeToggleProps {
  slug: string;
  active: PriceRange;
}

export function RangeToggle({ slug, active }: RangeToggleProps) {
  return (
    <nav aria-label="Chart time range" className="flex flex-wrap gap-1">
      {PRICE_RANGES.map(({ value, label, title }) => {
        const isActive = value === active;
        return (
          <Link
            key={value}
            href={`/commodity/${slug}?range=${value}`}
            scroll={false}
            aria-current={isActive ? 'true' : undefined}
            aria-label={title}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? 'bg-edge text-content'
                : 'text-muted hover:bg-edge/50 hover:text-content'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
