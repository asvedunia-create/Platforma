import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export default async function ControlPage({ params }: { params: { id: string } }) {
  const session = await requireSession();
  const control = await db.control.findFirst({ where: { id: params.id, orgId: session.user.activeOrgId } });
  if (!control) return notFound();

  return (
    <section>
      <h1>{control.id}: {control.name}</h1>
      <p><b>Domain:</b> {control.domain}</p>
      <p><b>Status:</b> {control.status}</p>
      <p>{control.guidance}</p>
    </section>
  );
}
