import { daysAgo } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

type HeadlineItem = {
  headline: string;
  source: string;
  published_at: string;
  resource_name: string;
  sentiment: number;
  url: string | null;
};

interface HeadlinePanelProps {
  headlines: HeadlineItem[];
  className?: string;
}

function getSentiment(score: number): { prefix: string; label: string; className: string } {
  if (score > 0.05)  return { prefix: '+', label: 'Positive', className: 'text-flag-normal' };
  if (score < -0.05) return { prefix: '−', label: 'Negative', className: 'text-flag-critical' };
  return { prefix: '~', label: 'Neutral', className: 'text-muted' };
}

export function HeadlinePanel({ headlines, className }: HeadlinePanelProps) {
  return (
    <Card className={`flex flex-col ${className ?? ''}`}>
      <h2 className="mb-4 text-sm font-semibold text-content">
        Latest News
      </h2>
      {headlines.length === 0 ? (
        <p className="text-sm text-muted">No recent headlines available.</p>
      ) : (
        <>
          <ul className="divide-y divide-edge" role="list">
            {headlines.map((item, i) => {
              const s = getSentiment(item.sentiment);
              return (
                <li key={item.url ?? i} className="flex flex-col gap-1.5 py-3">
                  <div className="flex items-start justify-between gap-4">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium leading-snug text-content hover:underline transition-colors"
                      >
                        {item.headline}
                      </a>
                    ) : (
                      <p className="text-sm font-medium leading-snug text-content">{item.headline}</p>
                    )}
                    <span className="shrink-0 text-xs text-muted">{daysAgo(item.published_at)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{item.source}</Badge>
                    <Badge>{item.resource_name}</Badge>
                    <span className={`ml-auto text-xs font-medium ${s.className}`}>
                      <span aria-hidden="true">{s.prefix}</span> {s.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 border-t border-edge pt-3 text-xs text-muted">
            Sentiment scored automatically using natural language analysis. Not editorial judgment.
          </p>
        </>
      )}
    </Card>
  );
}
