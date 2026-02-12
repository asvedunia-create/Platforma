import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      organizationId: string;
      role: 'ADMIN' | 'GRC' | 'VIEWER';
    } & DefaultSession['user'];
  }
}
