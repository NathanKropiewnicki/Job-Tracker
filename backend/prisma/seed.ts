import { PrismaClient, ApplicationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.application.createMany({
    data: [
      {
        company: 'Example Co',
        role: 'Frontend Engineer',
        status: ApplicationStatus.APPLIED,
        location: 'Remote',
        link: 'https://example.com/jobs/frontend-engineer',
        notes: 'Seed data for local development',
        appliedAt: new Date(),
      },
      {
        company: 'Acme Labs',
        role: 'Full Stack Developer',
        status: ApplicationStatus.SAVED,
        location: 'New York, NY',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
