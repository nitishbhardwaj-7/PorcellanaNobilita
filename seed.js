const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let settings = await prisma.settings.findUnique({ where: { id: 'global' } });
  if (!settings) {
    await prisma.settings.create({
      data: {
        id: 'global',
        siteName: 'Porcellana Nobilita',
        contactEmail: 'info@nobilita.com',
      }
    });
    console.log('Created global settings');
  } else {
    console.log('Global settings exist');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
