import { z } from "zod";
import { db } from "@/lib/db";
import { auditLog } from "@/lib/audit";

export const riskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  owner: z.string().optional(),
  likelihood: z.number().int().min(1).max(5),
  impact: z.number().int().min(1).max(5),
  status: z.enum(["OPEN", "MITIGATED", "ACCEPTED", "CLOSED"]).default("OPEN"),
});

export async function createRiskForOrg(orgId: string, actorUserId: string, payload: unknown) {
  const input = riskSchema.parse(payload);
  const riskScore = input.impact * input.likelihood;

  const risk = await db.risk.create({
    data: { ...input, orgId, riskScore },
  });

  await auditLog({
    actorUserId,
    orgId,
    entityType: "Risk",
    entityId: risk.id,
    action: "RISK_CREATED",
    metadata: { riskScore },
  });

  return risk;
}
