// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { id: 'rl1', name: 'PENGGUNA' },
    { id: 'rl2', name: 'ADMIN' },
    { id: 'rl3', name: 'PENGAJAR' },
    { id: 'rl4', name: 'MENTOR' },
    
    { id: 'rl5', name: 'KARYAWAN' },
    { id: 'rl6', name: 'MITRA' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: {
        id: role.id,
        name: role.name,
      },
    });
  }

  console.log('✅ Roles seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
