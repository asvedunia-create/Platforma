import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email }, include: { memberships: true } });
        if (!user?.passwordHash) return null;
        const match = await compare(credentials.password, user.passwordHash);
        if (!match || !user.memberships[0]) return null;
        return { id: user.id, email: user.email, name: user.name };
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : [])
  ],
  callbacks: {
    async session({ session, user }) {
      const membership = await prisma.membership.findFirst({ where: { userId: user.id } });
      if (session.user && membership) {
        session.user.id = user.id;
        session.user.organizationId = membership.organizationId;
        session.user.role = membership.role;
      }
      return session;
    }
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' }
    }
  }
};

export const getAuthSession = () => getServerSession(authOptions);
