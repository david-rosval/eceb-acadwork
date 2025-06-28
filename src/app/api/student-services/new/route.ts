import { getUserIdFromToken } from "@/lib/auth/getUserIdFromToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description, price, categoryId } = await req.json();

    if (!title || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
    }

    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        price,
        categoryId,
        userId,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("[SERVICE_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Error al crear servicio" }, { status: 500 });
  }
}
