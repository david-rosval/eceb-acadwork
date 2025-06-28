import { PrismaClient, Prisma } from "../src/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: "johndoe@test.edu.pe",
    password: "johndoetest",
    firstName: "John",
    lastName: "Doe",
    college: "UNTELS",
    major: "Ing. de Sistemas", 
    description: "Test description 1",
    semester: 5,
    linkedinUrl: "https://www.linkedin.com/in/johndoe",
    status: "active",
    rating: 3.5,
  },
  {
    email: "janedoe@test.edu.pe",
    password: "janedoetest",
    firstName: "Jane",
    lastName: "Doe",
    college: "UNTELS",
    major: "Ing. Ambiental",
    description: "Test description 2",
    semester: 5,
    linkedinUrl: "https://www.linkedin.com/in/johndoe",
    status: "active",
    rating: 4.5,
  },
];


export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
