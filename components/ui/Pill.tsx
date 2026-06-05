import type { Flag } from '@/lib/types';

const FLAG_STYLES: Record<Flag, string> = {
  NORMAL:   'bg-flag-normal/20 text-flag-normal border-flag-normal/30',
  RISKY:    'bg-flag-risky/20 text-flag-risky border-flag-risky/30',
  CRITICAL: 'bg-flag-critical/20 text-flag-critical border-flag-critical/30',
};

const FLAG_LABELS: Record<Flag, string> = {
  NORMAL:   'NORMAL',
  RISKY:    'RISKY',
  CRITICAL: 'CRITICAL',
};


interface PillProps {
  flag: Flag;
  className?: string;
}

export function Pill({ flag, className }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${FLAG_STYLES[flag]} ${className ?? ''}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {FLAG_LABELS[flag]}
    </span>
  );
}
