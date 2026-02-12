import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession, requireWriteRole } from '@/lib/session-org';
import { riskSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/audit';

export async function GET(req: Request) {
  const session = await requireSession();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);
  const status = searchParams.get('status') || undefined;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  const where = { organizationId: session.user.organizationId, ...(status ? { status: status as any } : {}) };
  const [total, items] = await Promise.all([
    prisma.risk.count({ where }),
    prisma.risk.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { [sortBy]: order } as any })
  ]);

  return NextResponse.json({ total, page, pageSize, items });
}

export async function POST(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const body = riskSchema.parse(await req.json());
  const risk = await prisma.risk.create({
    data: {
      ...body,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      ownerId: body.ownerId || null,
      riskScore: body.impact * body.likelihood,
      organizationId: session.user.organizationId
    }
  });

  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'risk', entityId: risk.id, action: 'create' });
  return NextResponse.json(risk, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const { id, ...rest } = await req.json();
  const existing = await prisma.risk.findFirst({ where: { id, organizationId: session.user.organizationId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = riskSchema.partial().parse(rest);
  const risk = await prisma.risk.update({
    where: { id },
    data: {
      ...body,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      riskScore: body.impact && body.likelihood ? body.impact * body.likelihood : undefined
    }
  });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'risk', entityId: risk.id, action: 'update', diffJson: JSON.stringify(body) });
  return NextResponse.json(risk);
}

export async function DELETE(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const existing = await prisma.risk.findFirst({ where: { id, organizationId: session.user.organizationId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.risk.delete({ where: { id } });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'risk', entityId: id, action: 'delete' });
  return NextResponse.json({ ok: true });
}
