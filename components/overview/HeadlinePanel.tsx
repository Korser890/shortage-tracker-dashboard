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

function getSentiment(score: number): { label: string; className: string } {
  if (score > 0.05)  return { label: '+ Positive', className: 'text-flag-normal' };
  if (score < -0.05) return { label: '− Negative', className: 'text-flag-critical' };
  return { label: '~ Neutral', className: 'text-muted' };
}

export function HeadlinePanel({ headlines, className }: HeadlinePanelProps) {
  if (headlines.length === 0) return null;
  return (
    <Card className={`flex flex-col ${className ?? ''}`}>
      <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
        Latest News
      </span>
      <div className="divide-y divide-edge">
        {headlines.map((item, i) => {
          const s = getSentiment(item.sentiment);
          return (
            <div key={i} className="flex flex-col gap-1.5 py-3">
              <div className="flex items-start justify-between gap-4">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium leading-snug text-content hover:text-flag-risky transition-colors"
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
                <span className={`ml-auto text-xs font-medium ${s.className}`}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
