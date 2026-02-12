import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession, requireWriteRole } from '@/lib/session-org';
import { controlSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/audit';

export async function GET(req: Request) {
  const session = await requireSession();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);
  const items = await prisma.control.findMany({ where: { organizationId: session.user.organizationId }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { code: 'asc' } });
  const total = await prisma.control.count({ where: { organizationId: session.user.organizationId } });
  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const body = controlSchema.parse(await req.json());
  const item = await prisma.control.create({ data: { ...body, organizationId: session.user.organizationId } });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'control', entityId: item.id, action: 'create' });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const { id, ...rest } = await req.json();
  const existing = await prisma.control.findFirst({ where: { id, organizationId: session.user.organizationId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = controlSchema.partial().parse(rest);
  const item = await prisma.control.update({ where: { id }, data: body });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'control', entityId: item.id, action: 'update', diffJson: JSON.stringify(body) });
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const existing = await prisma.control.findFirst({ where: { id, organizationId: session.user.organizationId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.control.delete({ where: { id } });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'control', entityId: id, action: 'delete' });
  return NextResponse.json({ ok: true });
}
