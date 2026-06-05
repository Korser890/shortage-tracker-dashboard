interface StaleDataBannerProps {
  daysSince: number;
}

export function StaleDataBanner({ daysSince }: StaleDataBannerProps) {
  return (
    <div className="rounded-lg border border-flag-risky/30 bg-flag-risky/10 px-4 py-3 text-sm text-flag-risky">
      Data may be outdated — last pipeline run was {daysSince}d ago. Prices and signals may not reflect current market conditions.
    </div>
  );
}
