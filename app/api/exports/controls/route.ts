import { unparse } from 'papaparse';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session-org';

export async function GET() {
  const session = await requireSession();
  const controls = await prisma.control.findMany({ where: { organizationId: session.user.organizationId }, orderBy: { code: 'asc' } });
  const csv = unparse(controls.map((c) => ({ code: c.code, title: c.title, status: c.status, description: c.description })));
  return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="controls.csv"' } });
}
