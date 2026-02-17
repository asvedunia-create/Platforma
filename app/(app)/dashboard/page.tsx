import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await requireSession();
  const [riskCount, taskOpen, evidenceCount] = await Promise.all([
    db.risk.count({ where: { orgId: session.user.activeOrgId } }),
    db.task.count({ where: { orgId: session.user.activeOrgId, status: "OPEN" } }),
    db.evidenceItem.count({ where: { orgId: session.user.activeOrgId } }),
  ]);

  return (
    <section>
      <h1>Dashboard</h1>
      <ul>
        <li>Total risks: {riskCount}</li>
        <li>Open tasks: {taskOpen}</li>
        <li>Evidence items: {evidenceCount}</li>
      </ul>
    </section>
  );
}
