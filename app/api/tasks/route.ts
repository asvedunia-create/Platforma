import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession, requireWriteRole } from '@/lib/session-org';
import { taskSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/audit';

export async function GET(req: Request) {
  const session = await requireSession();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);
  const items = await prisma.task.findMany({
    where: { organizationId: session.user.organizationId },
    include: { risk: true, control: true, assignee: true, comments: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' }
  });
  const total = await prisma.task.count({ where: { organizationId: session.user.organizationId } });
  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const body = taskSchema.parse(await req.json());
  const item = await prisma.task.create({ data: { ...body, dueDate: body.dueDate ? new Date(body.dueDate) : null, organizationId: session.user.organizationId } });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'task', entityId: item.id, action: 'create' });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const { id, ...rest } = await req.json();
  const existing = await prisma.task.findFirst({ where: { id, organizationId: session.user.organizationId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = taskSchema.partial().parse(rest);
  const item = await prisma.task.update({ where: { id }, data: { ...body, dueDate: body.dueDate ? new Date(body.dueDate) : undefined } });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'task', entityId: item.id, action: 'update', diffJson: JSON.stringify(body) });
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const existing = await prisma.task.findFirst({ where: { id, organizationId: session.user.organizationId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.task.delete({ where: { id } });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'task', entityId: id, action: 'delete' });
  return NextResponse.json({ ok: true });
}
