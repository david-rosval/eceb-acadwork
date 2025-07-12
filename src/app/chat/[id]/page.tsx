"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Send, Paperclip, MoreVertical, Phone, Video, Loader } from "lucide-react"

import { pusherClient } from "@/lib/pusher"
import { useGetOldMessages } from "@/hooks/useGetOldMessages"
import { useUserById } from "@/hooks/useUserById"
import { sendMessage } from "@/actions/message.action"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  senderName: string
  timestamp: string
  isCurrentUser: boolean
}

function formattedUserName(first?: string, last?: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`
}

export default function ChatDetailPage() {
  const { user } = useAuth()
  const senderId = user?.id

  const params = useParams()
  const receiverId = (Array.isArray(params.id) ? params.id[0] : params.id) ?? ""


  

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: chatUser, isLoading: chatUserIsLoading } = useUserById(receiverId)
  const { data: oldMessages } = useGetOldMessages({
    user1Id: senderId ?? "",
    user2Id: receiverId,
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (oldMessages) {
      const formatted = oldMessages.map((m) => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        receiverId: m.receiverId,
        senderName: `${m.sender.firstName} ${m.sender.lastName}`,
        timestamp: m.createdAt,
        isCurrentUser: m.senderId === senderId,
      }))
      setMessages(formatted)
    }
  }, [oldMessages, senderId])

  useEffect(() => {
    const channel = `chat-${[senderId, receiverId].sort().join("-")}`
    const handleNewMessage = (newMsg: Omit<Message, "isCurrentUser">) => {
      setMessages((prev) => [
        ...prev,
        { ...newMsg, isCurrentUser: newMsg.senderId === senderId },
      ])
    }

    pusherClient.subscribe(channel)
    pusherClient.bind("new-message", handleNewMessage)

    return () => {
      pusherClient.unsubscribe(channel)
      pusherClient.unbind("new-message", handleNewMessage)
    }
  }, [senderId, receiverId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !senderId) return

    await sendMessage({
      senderId,
      receiverId,
      content: newMessage.trim(),
    })

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60_000) return "Justo ahora"
    if (diff < 3_600_000) return `Hace ${Math.floor(diff / 60_000)} min`
    if (diff < 86_400_000) return `Hace ${Math.floor(diff / 3_600_000)} h`

    return date.toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  

  if (chatUserIsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Cargando mensajes...</h1>
          <Loader className="animate-spin" />
        </div>
      </div>
    )
  }

  if (!chatUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Usuario no encontrado</h1>
          <Link href="/chat">
            <Button>Volver a mensajes</Button>
          </Link>
        </div>
      </div>
    )
  }

  const avatarSrc = `https://ui-avatars.com/api/?name=${formattedUserName(chatUser.firstName, chatUser.lastName)}`

  if (!receiverId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ID de usuario no válido</h1>
          <Link href="/chat">
            <Button>Volver a mensajes</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-8rem)] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Link href="/chat">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>

              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback>{formattedUserName(chatUser.firstName, chatUser.lastName)}</AvatarFallback>
                </Avatar>
              </div>

              <div>
                <h2 className="font-semibold">
                  {chatUser.firstName} {chatUser.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">Chat directo</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[70%] ${msg.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                    {!msg.isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarSrc} />
                        <AvatarFallback>{formattedUserName(chatUser.firstName, chatUser.lastName)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        msg.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Presiona Enter para enviar. Usa Shift+Enter para salto de línea.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
