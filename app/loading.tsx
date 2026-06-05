import { Card } from '@/components/ui/Card';

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-edge bg-card p-5 space-y-3 animate-pulse">
      <div className="h-3 w-24 rounded bg-edge" />
      <div className="h-7 w-20 rounded bg-edge" />
      <div className="h-3 w-16 rounded bg-edge" />
    </div>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">

        <div className="h-8 w-64 rounded bg-edge animate-pulse" />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </section>

        <Card className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-5 rounded bg-edge" />
          ))}
        </Card>

      </div>
    </main>
  );
}
