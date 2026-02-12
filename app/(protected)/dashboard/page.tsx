import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session-org';

export default async function DashboardPage() {
  const session = await requireSession();
  const orgId = session.user.organizationId;

  const [controlsTotal, controlsImplemented, openTasks, highRisks] = await Promise.all([
    prisma.control.count({ where: { organizationId: orgId } }),
    prisma.control.count({ where: { organizationId: orgId, status: 'IMPLEMENTED' } }),
    prisma.task.count({ where: { organizationId: orgId, status: { not: 'DONE' } } }),
    prisma.risk.count({ where: { organizationId: orgId, riskScore: { gte: 15 }, status: { not: 'CLOSED' } } })
  ]);

  const compliance = controlsTotal ? Math.round((controlsImplemented / controlsTotal) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card title="ISO 27002 прогрес" value={`${compliance}%`} />
      <Card title="Контролі впроваджено" value={`${controlsImplemented}/${controlsTotal}`} />
      <Card title="Відкриті задачі" value={String(openTasks)} />
      <Card title="High risks (15+)" value={String(highRisks)} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-semibold">{value}</p>
    </div>
  );
}
