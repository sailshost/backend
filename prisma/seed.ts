import { PrismaClient } from "@prisma/client";
import argon from "argon2";
import { IS_PROD } from "../src/export";
const prisma = new PrismaClient();

async function main() {
  if (IS_PROD) {
    console.log("Running seed in production is not recommended");
  } else {
    await prisma.user.deleteMany();

    const email = "@sails.host";
    const one = `kyle${email}`;
    const two = `andre${email}`;
    const pass = "ZP4SuLAtnbXJ42GEqGZvH";
    const pass2 = "dX8ZDAtFoG28renQC8pwH";
    const password = await argon.hash(pass);
    const password2 = await argon.hash(pass2);

    await prisma.user.createMany({
      data: [
        {
          email: one,
          password: password,
          firstName: "Kyle",
          lastName: "Bennett",
          username: "Kyle",
          avatar: "https://avatar.tobi.sh/kyle.jpg",
          userType: "ADMIN",
        },
        {
          email: two,
          password: password2,
          firstName: "Andre",
          username: "Andre",
          avatar: "https://avatar.tobi.sh/andre.jpg",
          userType: "ADMIN",
        },
      ],
      skipDuplicates: true,
    });
    return console.log(`Created users --->
${one}:${pass}

${two}:${pass2}`);
  }
}

main()
  .catch((err) => console.log(err))
  .finally(async () => await prisma.$disconnect());
