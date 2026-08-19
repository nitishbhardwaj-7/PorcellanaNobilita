const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  
  await prisma.user.update({
    where: { email: 'admin@nobilita.com' },
    data: { password: hashedPassword }
  });
  
  console.log("Password reset successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
