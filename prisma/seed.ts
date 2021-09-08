import { PrismaClient } from "@prisma/client";
import argon from "argon2";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  console.log("Deleted all users");

  const password = await argon.hash("uwu");
  const password2 = await argon.hash("imposedisdaddy");

  await prisma.user.create({
    data: {
      email: "kyle@sails.host",
      password: password,
    },
  });
  await prisma.user.create({
    data: {
      email: "andre@sails.host",
      password: password2,
    },
  });
  return console.log("Created users");
}

main()
  .catch((err) => console.log(err))
  .finally(async () => await prisma.$disconnect());
