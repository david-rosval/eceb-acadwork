"use server"

import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

interface SendMessageParams {
  senderId: string
  receiverId: string
  content: string
}

export async function sendMessage({ senderId, receiverId, content }: SendMessageParams) {
  try {
    // 1. Guardar mensaje en la base de datos
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


    // 2. Disparar evento Pusher en canal privado del receptor
    await pusherServer.trigger(channel, "new-message", {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      senderName: `${message.sender.firstName} ${message.sender.lastName}`,
      timestamp: message.sendAt,
    })
  } catch (error) {
    console.error("Error en sendMessage:", error)
    throw new Error("No se pudo enviar el mensaje")
  }
}