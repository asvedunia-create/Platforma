import Link from 'next/link';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  return (
    <div className="min-h-screen">
      <nav className="flex gap-4 border-b bg-white p-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/risks">Risks</Link>
        <Link href="/controls">Controls</Link>
        <Link href="/tasks">Tasks</Link>
        <Link href="/evidence">Evidence</Link>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}
