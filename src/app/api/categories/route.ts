import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            services: true,
          },
        },
      },
    });

    // Formateamos para incluir serviceCount como propiedad directa
    const formatted = categories.map((category) => ({
      id: category.id,
      name: category.name,
      serviceCount: category._count.services,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json(
      { error: "Error al obtener las categorías" },
      { status: 500 }
    );
  }
}
