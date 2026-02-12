import { unparse } from 'papaparse';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session-org';

export async function GET() {
  const session = await requireSession();
  const risks = await prisma.risk.findMany({ where: { organizationId: session.user.organizationId } });
  const csv = unparse(
    risks.map((r) => ({
      assetProcess: r.assetProcess,
      threat: r.threat,
      vulnerability: r.vulnerability,
      impact: r.impact,
      likelihood: r.likelihood,
      riskScore: r.riskScore,
      treatment: r.treatment,
      dueDate: r.dueDate?.toISOString() ?? '',
      status: r.status
    }))
  );
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="risk-register.csv"' } });
}
