import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  console.log("Starting page publishing test...");

  const testSlug = "test-dynamic-pasted-html";

  // Cleanup
  await prisma.page.deleteMany({
    where: { slug: testSlug }
  });

  const testHtml = `
<!DOCTYPE html>
<html>
<head><title>Test Pasted Page</title></head>
<body><h1>Hello World from Pasted HTML!</h1></body>
</html>
  `.trim();

  // Create page
  const createdPage = await prisma.page.create({
    data: {
      title: "Test Pasted Page",
      slug: testSlug,
      customHtml: testHtml,
      status: "PUBLISHED",
      sections: []
    }
  });

  console.log("Created page with ID:", createdPage.id);

  // Fetch the page
  const page = await prisma.page.findUnique({
    where: { slug: testSlug }
  });

  if (!page) {
    throw new Error("Page not found after creation!");
  }

  if (page.customHtml !== testHtml) {
    throw new Error("Page HTML mismatch!");
  }

  console.log("Database write and read successfully verified!");

  // Clean up
  await prisma.page.delete({
    where: { slug: testSlug }
  });

  console.log("All tests passed successfully!");
}

test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
