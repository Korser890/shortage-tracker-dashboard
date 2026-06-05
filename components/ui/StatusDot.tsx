import type { Flag } from '@/lib/types';

const FLAG_COLORS: Record<Flag, string> = {
  NORMAL:   'bg-flag-normal',
  RISKY:    'bg-flag-risky',
  CRITICAL: 'bg-flag-critical',
};

const SIZES = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
} as const;


interface StatusDotProps {
  flag: Flag;
  size?: keyof typeof SIZES;
  className?: string;
}

export function StatusDot({ flag, size = 'md', className }: StatusDotProps) {
  return (
    <span
      className={`inline-block rounded-full ${FLAG_COLORS[flag]} ${SIZES[size]} ${className ?? ''}`}
      aria-label={flag}
    />
  );
}

