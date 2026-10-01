import type { Flag } from './types';

export function formatPrice(price: number, unit: string): string {
  const slashIdx = unit.indexOf('/');
  const currency = slashIdx > 0 ? unit.slice(0, slashIdx) : 'USD';
  const displayUnit = slashIdx > 0 ? unit.slice(slashIdx + 1) : unit;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${formatted} /${displayUnit}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function daysAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

const FLAG_COLORS: Record<Flag, string> = {
  NORMAL:   '#22C55E',
  RISKY:    '#F59E0B',
  CRITICAL: '#FF3B5C',
};

export function getFlagColor(flag: Flag): string {
  return FLAG_COLORS[flag];
}

export function formatDevPct(pct: number): { text: string; className: string } {
  const sign = pct >= 0 ? '+' : '';
  const className =
    pct >= 30  ? 'text-flag-critical' :
    pct >= 15  ? 'text-flag-risky' :
    pct > -15  ? 'text-flag-normal' :
    'text-muted';
  return { text: `${sign}${pct.toFixed(1)}%`, className };
}
