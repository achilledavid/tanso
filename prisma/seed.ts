import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      username: "test-user",
      email: "test-user@example.com",
      profile: {
        create: {
          language: "fr",
          theme: "dark",
          defaultBpm: 120,
        },
      },
    },
  });

  console.log({
    users: user
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
