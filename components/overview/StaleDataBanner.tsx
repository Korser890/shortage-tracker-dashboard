interface StaleDataBannerProps {
  daysSince: number;
}

export function StaleDataBanner({ daysSince }: StaleDataBannerProps) {
  return (
    <div role="status" aria-live="polite" className="rounded-lg border border-flag-risky/30 bg-flag-risky/10 px-4 py-3 text-sm text-flag-risky">
      Data may be outdated. The latest price is {daysSince} days old, so signals may not reflect current market conditions.
    </div>
  );
}
