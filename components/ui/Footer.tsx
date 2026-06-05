export function Footer() {
  return (
    <footer className="mt-auto border-t border-edge px-6 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Data sourced from{' '}
          <a href="https://www.eia.gov" target="_blank" rel="noopener noreferrer" className="hover:text-content transition-colors">EIA</a>
          {' · '}
          <a href="https://fred.stlouisfed.org" target="_blank" rel="noopener noreferrer" className="hover:text-content transition-colors">FRED</a>
          {' · '}
          <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="hover:text-content transition-colors">NewsAPI</a>
        </p>
        <p className="text-xs text-muted">
          For analytical purposes only — not financial advice
        </p>
      </div>
    </footer>
  );
}
