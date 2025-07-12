import { prisma } from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher"
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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { senderId, receiverId, content } = body

    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
      },
    })

    const channel = `chat-${[senderId, receiverId].sort().join("-")}`

    await pusherServer.trigger(channel, "new-message", {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      senderName: `${message.sender.firstName} ${message.sender.lastName}`,
      timestamp: message.sendAt,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en sendMessage:", error)
    return NextResponse.json({ error: "No se pudo enviar el mensaje" }, { status: 500 })
  }
}
