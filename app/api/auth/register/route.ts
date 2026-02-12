import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { organizationSchema } from '@/lib/validations';
import { sanitizeInput } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  organization: organizationSchema
});

export async function POST(req: Request) {
  try {
    const body = registerSchema.parse(await req.json());
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return NextResponse.json({ error: 'User exists' }, { status: 409 });

    const user = await prisma.user.create({
      data: {
        name: sanitizeInput(body.name),
        email: body.email.toLowerCase(),
        passwordHash: await hash(body.password, 12),
        memberships: {
          create: {
            role: 'ADMIN',
            organization: {
              create: {
                name: sanitizeInput(body.organization.name),
                edrpou: body.organization.edrpou,
                industry: sanitizeInput(body.organization.industry),
                size: body.organization.size
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload', detail: (e as Error).message }, { status: 400 });
  }
}
