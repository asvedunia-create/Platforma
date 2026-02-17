import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { DataTable } from "@/components/ui/data-table";
import { RiskScorePill, StatusBadge } from "@/components/ui/chips";

export default async function RisksPage() {
  const session = await requireSession();
  const risks = await db.risk.findMany({
    where: { orgId: session.user.activeOrgId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <section>
      <h1>Risk Register</h1>
      <DataTable
        rows={risks}
        columns={[
          { key: "title", label: "Title" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "riskScore", label: "Score", render: (row) => <RiskScorePill score={row.riskScore} /> },
          { key: "owner", label: "Owner" },
        ]}
      />
    </section>
  );
}
