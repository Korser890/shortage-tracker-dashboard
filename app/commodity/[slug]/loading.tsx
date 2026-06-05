import { Card } from '@/components/ui/Card';

export default function Loading() {
  return (
    <main className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8 animate-pulse">

        <div className="h-3 w-20 rounded bg-edge" />

        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-edge" />
          <div className="h-8 w-48 rounded bg-edge" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card><div className="h-52 rounded bg-edge" /></Card>
          <Card><div className="h-52 rounded bg-edge" /></Card>
        </div>

        <Card><div className="h-52 rounded bg-edge" /></Card>

      </div>
    </main>
  );
}
