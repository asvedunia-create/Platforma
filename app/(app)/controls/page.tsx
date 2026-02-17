import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { DataTable } from "@/components/ui/data-table";

export default async function ControlsPage() {
  const session = await requireSession();
  const controls = await db.control.findMany({ where: { orgId: session.user.activeOrgId }, take: 50 });

  return (
    <section>
      <h1>ISO 27002 Controls</h1>
      <DataTable
        rows={controls}
        columns={[
          { key: "id", label: "ID", render: (row) => <Link href={`/controls/${row.id}`}>{row.id}</Link> },
          { key: "domain", label: "Domain" },
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
        ]}
      />
    </section>
  );
}
