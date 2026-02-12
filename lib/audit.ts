import { prisma } from './prisma';

export async function writeAuditLog(input: {
  organizationId: string;
  actorId: string;
  entity: 'risk' | 'control' | 'task' | 'evidence';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  diffJson?: string;
}) {
  await prisma.auditLog.create({ data: input });
}
