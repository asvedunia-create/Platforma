import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { DataTable } from "@/components/ui/data-table";
import { DueDateChip, StatusBadge } from "@/components/ui/chips";

export default async function TasksPage() {
  const session = await requireSession();
  const tasks = await db.task.findMany({ where: { orgId: session.user.activeOrgId }, take: 50 });

  return (
    <section>
      <h1>Tasks</h1>
      <DataTable
        rows={tasks}
        columns={[
          { key: "title", label: "Title" },
          { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "dueDate", label: "Due", render: (row) => <DueDateChip dueDate={row.dueDate?.toISOString()} /> },
        ]}
      />
    </section>
  );
}
