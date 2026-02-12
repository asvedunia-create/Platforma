import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSession, requireWriteRole } from '@/lib/session-org';
import { evidenceSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/audit';

export async function GET(req: Request) {
  const session = await requireSession();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('pageSize') || 10);
  const items = await prisma.evidenceItem.findMany({ where: { organizationId: session.user.organizationId }, include: { risk: true, control: true, task: true }, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } });
  const total = await prisma.evidenceItem.count({ where: { organizationId: session.user.organizationId } });
  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const body = evidenceSchema.parse(await req.json());
  const item = await prisma.evidenceItem.create({ data: { ...body, fileUrl: body.fileUrl || null, organizationId: session.user.organizationId } });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'evidence', entityId: item.id, action: 'create' });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const { id, ...rest } = await req.json();
  const existing = await prisma.evidenceItem.findFirst({ where: { id, organizationId: session.user.organizationId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = evidenceSchema.partial().parse(rest);
  const item = await prisma.evidenceItem.update({ where: { id }, data: body });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'evidence', entityId: item.id, action: 'update', diffJson: JSON.stringify(body) });
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const session = await requireSession();
  requireWriteRole(session.user.role);
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const existing = await prisma.evidenceItem.findFirst({ where: { id, organizationId: session.user.organizationId } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.evidenceItem.delete({ where: { id } });
  await writeAuditLog({ organizationId: session.user.organizationId, actorId: session.user.id, entity: 'evidence', entityId: id, action: 'delete' });
  return NextResponse.json({ ok: true });
}
