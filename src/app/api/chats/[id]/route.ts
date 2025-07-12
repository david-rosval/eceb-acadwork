import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

interface ChatPreview {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string | null
  lastMessage: {
    content: string
    timestamp: string
    isRead: boolean
  }
  unreadCount: number
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    })

    const chatsMap = new Map<string, ChatPreview>()

    for (const msg of messages) {
      const isSender = msg.senderId === userId
      const participant = isSender ? msg.receiver : msg.sender
      const participantId = participant.id

      if (!chatsMap.has(participantId)) {
        chatsMap.set(participantId, {
          id: participant.id,
          firstName: participant.firstName,
          lastName: participant.lastName,
          lastMessage: {
            content: msg.content,
            timestamp: msg.sendAt.toISOString(),
            isRead: msg.readStatus
          },
          unreadCount: 0
        })
      }

      if (!msg.readStatus && msg.senderId === participantId) {
        const chat = chatsMap.get(participantId)
        if (chat) {
          chat.unreadCount++
        }
      }
    }

    const chats: ChatPreview[] = Array.from(chatsMap.values())

    return NextResponse.json(chats, { status: 200 })
  } catch (error) {
    console.error("Error loading chats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
