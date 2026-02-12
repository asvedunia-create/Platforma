import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(2),
  edrpou: z.string().max(20).optional(),
  industry: z.string().min(2),
  size: z.string().min(1)
});

export const riskSchema = z.object({
  assetProcess: z.string().min(2),
  threat: z.string().min(2),
  vulnerability: z.string().min(2),
  impact: z.coerce.number().int().min(1).max(5),
  likelihood: z.coerce.number().int().min(1).max(5),
  ownerId: z.string().optional().nullable(),
  treatment: z.enum(['AVOID', 'MITIGATE', 'TRANSFER', 'ACCEPT']),
  dueDate: z.string().optional().nullable(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED'])
});

export const controlSchema = z.object({
  code: z.string().min(2),
  title: z.string().min(2),
  description: z.string().min(2),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'IMPLEMENTED', 'NOT_APPLICABLE'])
});

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  riskId: z.string().optional().nullable(),
  controlId: z.string().optional().nullable()
});

export const evidenceSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['POLICY', 'SCREENSHOT', 'TICKET', 'LOG', 'CONTRACT', 'OTHER']),
  fileName: z.string().optional(),
  fileUrl: z.string().url().optional().or(z.literal('')),
  metadataJson: z.string().optional(),
  riskId: z.string().optional().nullable(),
  controlId: z.string().optional().nullable(),
  taskId: z.string().optional().nullable()
});
