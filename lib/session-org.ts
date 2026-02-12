import { Role } from '@prisma/client';
import { getAuthSession } from './auth';

export async function requireSession() {
  const session = await getAuthSession();
  if (!session?.user) throw new Error('Unauthorized');
  return session;
}

export function requireWriteRole(role: Role) {
  if (role === 'VIEWER') throw new Error('Forbidden');
}
