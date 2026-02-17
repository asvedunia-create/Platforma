import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { DataTable } from "@/components/ui/data-table";

export default async function EvidencePage() {
  const session = await requireSession();
  const evidence = await db.evidenceItem.findMany({ where: { orgId: session.user.activeOrgId }, take: 50 });

  return (
    <section>
      <h1>Evidence</h1>
      <DataTable
        rows={evidence}
        columns={[
          { key: "title", label: "Title" },
          { key: "type", label: "Type" },
          { key: "externalLink", label: "Link" },
        ]}
      />
    </section>
  );
}
