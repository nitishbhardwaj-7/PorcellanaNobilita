import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test pages...");

  // Delete existing
  await prisma.page.deleteMany({});

  await prisma.page.create({
    data: {
      title: "Noble Marbles",
      slug: "noble-marbles",
      status: "PUBLISHED",
      sections: []
    }
  });

  await prisma.page.create({
    data: {
      title: "Yes Website",
      slug: "yes",
      status: "PUBLISHED",
      customHtml: "<h1>Yes!</h1>",
      sections: []
    }
  });

  await prisma.page.create({
    data: {
      title: "New page",
      slug: "new-collection",
      status: "DRAFT",
      sections: []
    }
  });

  console.log("Pages seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
