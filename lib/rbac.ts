import { Role } from '@prisma/client';

const permissions: Record<Role, string[]> = {
  ADMIN: ['read', 'write', 'delete'],
  GRC: ['read', 'write'],
  VIEWER: ['read']
};

export function can(role: Role, action: 'read' | 'write' | 'delete') {
  return permissions[role].includes(action);
}
