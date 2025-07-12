import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const user1Id = searchParams.get("user1Id")
  const user2Id = searchParams.get("user2Id")

  if (!user1Id || !user2Id) {
    return NextResponse.json({ error: "Faltan parámetros de usuario" }, { status: 400 })
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error("[GET_MESSAGES_ERROR]", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}
