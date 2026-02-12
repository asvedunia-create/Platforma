import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const controls = [
  ['5.1', 'Policies for information security'], ['5.2', 'Information security roles'], ['5.3', 'Segregation of duties'],
  ['5.4', 'Management responsibilities'], ['5.7', 'Threat intelligence'], ['5.8', 'Security in project management'],
  ['5.9', 'Inventory of information assets'], ['5.10', 'Acceptable use of information'], ['5.12', 'Classification of information'],
  ['5.15', 'Access control'], ['5.16', 'Identity management'], ['5.17', 'Authentication information'],
  ['5.18', 'Access rights'], ['5.23', 'Information security for use of cloud services'], ['5.24', 'Incident management planning'],
  ['5.26', 'Response to incidents'], ['5.28', 'Collection of evidence'], ['5.30', 'ICT readiness for business continuity'],
  ['7.1', 'Physical security perimeters'], ['7.4', 'Physical security monitoring'], ['8.1', 'User endpoint devices'],
  ['8.9', 'Configuration management'], ['8.11', 'Data masking'], ['8.15', 'Logging'], ['8.16', 'Monitoring activities']
];

async function main() {
  const email = 'admin@grclite.local';
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      name: 'Demo Admin',
      email,
      passwordHash: await hash('Admin1234!', 10),
      memberships: {
        create: {
          role: 'ADMIN',
          organization: {
            create: { name: 'Demo LLC', industry: 'IT Services', size: '11-50', edrpou: '12345678' }
          }
        }
      }
    },
    include: { memberships: true }
  });

  const orgId = user.memberships[0].organizationId;
  await prisma.control.createMany({ data: controls.map(([code, title]) => ({ code, title, description: title, status: 'NOT_STARTED', organizationId: orgId })), skipDuplicates: true });

  const risk = await prisma.risk.create({
    data: {
      organizationId: orgId,
      assetProcess: 'Payment processing',
      threat: 'Credential theft',
      vulnerability: 'Weak MFA enforcement',
      impact: 5,
      likelihood: 3,
      riskScore: 15,
      treatment: 'MITIGATE',
      status: 'OPEN',
      ownerId: user.id
    }
  });

  await prisma.task.create({ data: { organizationId: orgId, title: 'Enable mandatory MFA', status: 'IN_PROGRESS', riskId: risk.id, assigneeId: user.id } });
}

main().finally(() => prisma.$disconnect());
