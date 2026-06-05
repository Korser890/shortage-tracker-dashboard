import type { Flag } from '@/lib/types';

interface FlagTimelineProps {
  history: Array<{ date: string; flag: string }>;
  label?: string;
  className?: string;
}

const FLAG_BG: Record<Flag, string> = {
  NORMAL:   'bg-flag-normal/80',
  RISKY:    'bg-flag-risky/80',
  CRITICAL: 'bg-flag-critical/80',
};

const FLAG_TEXT: Record<Flag, string> = {
  NORMAL:   'text-flag-normal',
  RISKY:    'text-flag-risky',
  CRITICAL: 'text-flag-critical',
};

const FLAGS: Flag[] = ['NORMAL', 'RISKY', 'CRITICAL'];


export function FlagTimeline({ history, label, className }: FlagTimelineProps) {
  const recent = history.slice(-90);
  if (recent.length === 0) return null;

  const runs = recent.reduce<Array<{ flag: Flag; count: number }>>(
    (acc, entry) => {
      const f = entry.flag as Flag;
      if (acc.length > 0 && acc[acc.length - 1].flag === f) {
        acc[acc.length - 1].count++;
      } else {
        acc.push({ flag: f, count: 1 });
      }
      return acc;
    },
    []
  );

  const counts = runs.reduce<Record<Flag, number>>(
    (acc, run) => { acc[run.flag] += run.count; return acc; },
    { NORMAL: 0, RISKY: 0, CRITICAL: 0 }
  );


  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      {label && <span className="text-xs font-medium text-muted">{label}</span>}

      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {runs.map((run, i) => (
          <div
            key={i}
            title={`${run.flag}: ${run.count}d`}
            className={FLAG_BG[run.flag]}
            style={{ flex: run.count }}
          />
        ))}
      </div>


      <div className="flex gap-4">
        {FLAGS.map((flag) => {
          const count = counts[flag];
          if (count === 0) return null;
          return (
            <span key={flag} className={`text-xs ${FLAG_TEXT[flag]}`}>
              {count}d {flag.charAt(0) + flag.slice(1).toLowerCase()}
            </span>
          );
        })}
      </div>

    </div>
  );
}


