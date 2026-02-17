"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createRiskForOrg, riskSchema } from "@/lib/services/risk-service";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/audit";

export async function createRiskAction(formData: FormData) {
  const session = await requireRole("GRC");
  const payload = {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    owner: String(formData.get("owner") ?? ""),
    likelihood: Number(formData.get("likelihood") ?? 1),
    impact: Number(formData.get("impact") ?? 1),
    status: String(formData.get("status") ?? "OPEN"),
  };

  await createRiskForOrg(session.user.activeOrgId, session.user.id, payload);
  revalidatePath("/risks");
}

export async function updateRiskAction(id: string, payload: unknown) {
  const session = await requireRole("GRC");
  const input = riskSchema.partial().parse(payload);

  const before = await db.risk.findFirst({ where: { id, orgId: session.user.activeOrgId } });
  const updated = await db.risk.update({ where: { id }, data: input });

  await auditLog({
    actorUserId: session.user.id,
    orgId: session.user.activeOrgId,
    entityType: "Risk",
    entityId: id,
    action: "RISK_UPDATED",
    metadata: { before, after: updated },
  });

  revalidatePath("/risks");
}

export async function deleteRiskAction(id: string) {
  const session = await requireRole("GRC");
  await db.risk.delete({ where: { id } });
  await auditLog({
    actorUserId: session.user.id,
    orgId: session.user.activeOrgId,
    entityType: "Risk",
    entityId: id,
    action: "RISK_DELETED",
  });
  revalidatePath("/risks");
}
