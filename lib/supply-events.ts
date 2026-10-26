/**
 * Known supply events, for annotating the price chart.
 *
 * Every flag date here was read from `shortage_signals`, not estimated. Events are only
 * listed where the cause is nameable and the flag timing is meaningful: a flag onset that
 * merely reflects a post-crash recovery is not evidence of anything and is left out.
 *
 * `flaggedAt` is the first day the commodity entered CRITICAL for that episode. It may fall
 * after the event, which is normal and honest: the tracker detects price moves, it does not
 * forecast geopolitics.
 */

export interface SupplyEvent {
  id: string;
  /** The real-world event. */
  date: string;
  /** Short anchor drawn on the chart. A long string centred on a vertical line overflows. */
  label: string;
  /** Full description, shown in the list under the chart. */
  title: string;
  /** Per commodity. Omit `flaggedAt` to mark the event without a lead-time band. */
  slugs: Record<string, { flaggedAt?: string; flaggedPrice?: number }>;
}

export const SUPPLY_EVENTS: SupplyEvent[] = [
  {
    id: 'ukraine-2022',
    date: '2022-02-24',
    label: 'Ukraine invasion',
    title: 'Russia invades Ukraine',
    slugs: {
      'brent-crude': { flaggedAt: '2022-01-14', flaggedPrice: 87.17 },
      'wti-crude': { flaggedAt: '2022-01-18', flaggedPrice: 85.42 },
    },
  },
  {
    // Winter Storm Uri spiked Henry Hub to $23.86 on 17 Feb 2021. Marker only: the CRITICAL
    // run began 30 Jan 2021 at $2.75, driven by the post-COVID recovery rather than the storm,
    // so a lead-time band would claim a warning that was not about this event.
    id: 'uri-2021',
    date: '2021-02-17',
    label: 'Storm Uri',
    title: 'Winter Storm Uri freezes Texas gas supply',
    slugs: {
      'henry-hub': {},
    },
  },
  {
    // Flagged 2 days before the all-time high. The Nov 2025 CRITICAL run at $4.59 was a separate
    // winter-demand episode that lapsed back to NORMAL in December, so this onset is Fern's.
    id: 'fern-2026',
    date: '2026-01-23',
    label: 'Storm Fern',
    title: 'Winter Storm Fern freezes off US gas production, Henry Hub hits an all-time high of $30.72',
    slugs: {
      'henry-hub': { flaggedAt: '2026-01-21', flaggedPrice: 4.96 },
    },
  },
  {
    id: 'hormuz-2026',
    date: '2026-02-28',
    label: 'Hormuz blockage',
    // Prices broke to new highs again in September when alternative export routes were hit,
    // notably Saudi Arabia's East-West (Petroline) pipeline. No reliable date for that attack,
    // so it is described here rather than drawn as a separate line.
    title:
      'U.S.-Israeli strikes on Iran close the Strait of Hormuz, disrupting around 20% of global '
      + 'oil supply. Attacks on alternative export routes drove a second Critical run from September',
    slugs: {
      'brent-crude': { flaggedAt: '2026-03-02', flaggedPrice: 77.24 },
      'wti-crude': { flaggedAt: '2026-03-03', flaggedPrice: 74.48 },
    },
  },
];

function toUTC(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toUTC(to) - toUTC(from)) / 86_400_000);
}

/**
 * Recharts draws on a category axis, so a reference line only appears if its x value is one
 * of the plotted dates. Bucketed ranges rarely contain the exact event date, so snap to the
 * nearest plotted point.
 */
export function snapToPlotted(dateStr: string, plotted: string[]): string | null {
  if (plotted.length === 0) return null;
  const target = toUTC(dateStr);
  let best = plotted[0];
  let bestGap = Math.abs(toUTC(best) - target);
  for (const candidate of plotted) {
    const gap = Math.abs(toUTC(candidate) - target);
    if (gap < bestGap) {
      best = candidate;
      bestGap = gap;
    }
  }
  return best;
}

export interface PlottedEvent {
  id: string;
  /** 1-based, chronological. Drawn on the chart and repeated in the list below it. */
  marker: number;
  label: string;
  title: string;
  date: string;
  /** Snapped to a plotted date so Recharts will render it. */
  eventX: string;
  /** Band covering the gap between the flag and the event, when there is one. */
  band: { from: string; to: string; caption: string } | null;
  /** One line of plain English for the list under the chart. */
  detail: string | null;
}

/** Events visible for this commodity within the plotted window, ready to draw. */
export function eventsForChart(slug: string, plotted: string[]): PlottedEvent[] {
  if (plotted.length === 0) return [];
  const first = toUTC(plotted[0]);
  const last = toUTC(plotted[plotted.length - 1]);

  const visible = SUPPLY_EVENTS.flatMap((event) => {
    const forSlug = event.slugs[slug];
    if (!forSlug) return [];

    const eventTime = toUTC(event.date);
    if (eventTime < first || eventTime > last) return [];

    const eventX = snapToPlotted(event.date, plotted);
    if (!eventX) return [];

    let band: PlottedEvent['band'] = null;
    let detail: string | null = null;

    if (forSlug.flaggedAt) {
      const gap = daysBetween(forSlug.flaggedAt, event.date);
      const when = gap >= 0 ? 'earlier' : 'later';
      const days = Math.abs(gap);
      const price = forSlug.flaggedPrice ? `, at $${forSlug.flaggedPrice.toFixed(2)}` : '';
      detail = `Flagged Critical ${days} ${days === 1 ? 'day' : 'days'} ${when}${price}`;

      const flagX = snapToPlotted(forSlug.flaggedAt, plotted);
      if (flagX && flagX !== eventX) {
        band = {
          from: gap >= 0 ? flagX : eventX,
          to: gap >= 0 ? eventX : flagX,
          caption: `${days}d ${gap >= 0 ? 'before' : 'after'}`,
        };
      }
    }

    return [{
      id: event.id,
      marker: 0,
      label: event.label,
      title: event.title,
      date: event.date,
      eventX,
      band,
      detail,
    }];
  });

  return visible
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((event, index) => ({ ...event, marker: index + 1 }));
}
