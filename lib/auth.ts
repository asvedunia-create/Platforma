import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";

const rolePriority = { VIEWER: 1, GRC: 2, ADMIN: 3 } as const;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      activeOrgId: string;
      role: keyof typeof rolePriority;
      email?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await db.user.findUnique({
          where: { email },
          include: { memberships: true },
        });
        if (!user || user.memberships.length === 0) return null;

        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        const activeMembership = user.memberships[0];
        return {
          id: user.id,
          email: user.email,
          activeOrgId: activeMembership.orgId,
          role: activeMembership.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.activeOrgId = (user as any).activeOrgId;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.activeOrgId = token.activeOrgId as string;
      session.user.role = token.role as keyof typeof rolePriority;
      return session;
    },
  },
};

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.activeOrgId) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(minRole: keyof typeof rolePriority) {
  const session = await requireSession();
  if (rolePriority[session.user.role] < rolePriority[minRole]) {
    throw new Error("Forbidden");
  }
  return session;
}
