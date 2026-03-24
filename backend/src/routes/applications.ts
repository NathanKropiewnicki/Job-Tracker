import { NextFunction, Request, Response, Router } from 'express';
import { ZodError, z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../lib/async-handler';
import { applicationStatuses } from '../types/application';

const router = Router();

const applicationBodySchema = z.object({
  company: z.string().trim().min(1, 'Company is required'),
  role: z.string().trim().min(1, 'Role is required'),
  status: z.enum(applicationStatuses).optional(),
  location: z.string().trim().min(1).nullable().optional(),
  link: z.string().trim().url('Link must be a valid URL').nullable().optional(),
  notes: z.string().trim().nullable().optional(),
  appliedAt: z.string().datetime().nullable().optional(),
});

const applicationUpdateSchema = applicationBodySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required',
);

const idParamsSchema = z.object({
  id: z.string().trim().min(1),
});

function normalizeNullableString(value?: string | null) {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toApplicationData(input: z.infer<typeof applicationBodySchema> | z.infer<typeof applicationUpdateSchema>) {
  return {
    company: input.company,
    role: input.role,
    status: input.status,
    location: normalizeNullableString(input.location),
    link: normalizeNullableString(input.link),
    notes: input.notes === undefined ? undefined : input.notes,
    appliedAt: input.appliedAt === undefined ? undefined : input.appliedAt ? new Date(input.appliedAt) : null,
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: applications });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    const application = await prisma.application.findUnique({ where: { id } });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    return res.json({ data: application });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = applicationBodySchema.parse(req.body);
    const application = await prisma.application.create({
      data: toApplicationData(parsed),
    });

    res.status(201).json({ data: application });
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    const parsed = applicationUpdateSchema.parse(req.body);

    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = await prisma.application.update({
      where: { id },
      data: toApplicationData(parsed),
    });

    return res.json({ data: application });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = idParamsSchema.parse(req.params);
    const existing = await prisma.application.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await prisma.application.delete({ where: { id } });
    return res.status(204).send();
  }),
);

router.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.flatten(),
    });
  }

  return next(err);
});

export const applicationsRouter = router;
