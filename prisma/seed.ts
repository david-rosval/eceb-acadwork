import { PrismaClient, Prisma } from "../src/generated/prisma";

const prisma = new PrismaClient();

const categoryData: Prisma.CategoryCreateInput[] = [
  { name: "Programación" },
  { name: "Diseño Gráfico" },
  { name: "Cálculo" },
  { name: "Física"  },
  { name: "Química"  },
  { name: "Estadística"  },
  { name: "IoT"  },
  { name: "Dibujo técnico" },
];

export async function main() {
  for (const u of categoryData) {
    await prisma.category.create({ data: u });
  }
}

main();
