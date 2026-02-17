import { db } from "@/lib/db";

type AuditInput = {
  actorUserId: string;
  orgId: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata?: Record<string, unknown>;
};

export async function auditLog(input: AuditInput) {
  await db.auditLog.create({ data: input });
}
