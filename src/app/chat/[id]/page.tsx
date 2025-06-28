"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "next/navigation"

// Sample chat data (same as in main chat page)
const chats = [
  {
    id: "chat-1",
    participant: {
      name: "Alex Johnson",
      avatar: "https://picsum.photos/seed/alex/40/40",
      isOnline: true,
    },
    serviceTitle: "Desarrollo web con React y Node.js",
  },
  {
    id: "chat-2",
    participant: {
      name: "Maria Garcia",
      avatar: "https://picsum.photos/seed/maria/40/40",
      isOnline: false,
    },
    serviceTitle: "Diseño profesional de logotipos",
  },
  {
    id: "chat-3",
    participant: {
      name: "David Chen",
      avatar: "https://picsum.photos/seed/david/40/40",
      isOnline: true,
    },
    serviceTitle: "Escritor de contenido para sitios web",
  },
  {
    id: "chat-4",
    participant: {
      name: "Sarah Wilson",
      avatar: "https://picsum.photos/seed/sarah/40/40",
      isOnline: false,
    },
    serviceTitle: "Editora de video profesional",
  },
]

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string;
  isCurrentUser: boolean
}

// Sample messages
const messagesData: Record<string, Message[]> = {
  "chat-1": [
    {
      id: "1",
      senderId: "seller",
      senderName: "Alex Johnson",
      content: "Hola! Gracias por tu interés en mi servicio de desarrollo web. ¿Cómo puedo ayudarte hoy?",
      timestamp: "2023-10-01T12:00:00Z",
      isCurrentUser: false,
    },
    {
      id: "2",
      senderId: "user",
      senderName: "You",
      content: "Hola! Estoy buscando construir un sitio web de comercio electrónico moderno. ¿Puedes ayudar con eso?",
      timestamp: "2023-10-01T12:05:00Z",
      isCurrentUser: true,
    },
    {
      id: "3",
      senderId: "seller",
      senderName: "Alex Johnson",
      content: "Me especializo en soluciones de comercio electrónico. ¿Qué características estás buscando?",
      timestamp: "2023-10-01T12:10:00Z",
      isCurrentUser: false,
    },
    {
      id: "4",
      senderId: "user",
      senderName: "You",
      content: "Necesito catálogo de productos, carrito de compras, integración de pagos y cuentas de usuario.",
      timestamp: "2023-10-01T12:15:00Z",
      isCurrentUser: true,
    },
    {
      id: "5",
      senderId: "seller",
      senderName: "Alex Johnson",
      content: "Perfecto! Definitivamente puedo ayudar con todo eso. Déjame preparar una propuesta detallada para ti.",
      timestamp: "2023-10-01T12:20:00Z",
      isCurrentUser: false,
    },
  ],
  "chat-2": [
    {
      id: "1",
      senderId: "seller",
      senderName: "Maria Garcia",
      content: "Hola! Vi tu interés en el diseño de logotipos. ¿Para qué tipo de negocio es esto?",
      timestamp: "2023-10-01T10:00:00Z",
      isCurrentUser: false,
    },
    {
      id: "2",
      senderId: "user",
      senderName: "You",
      content: "Es para una startup tecnológica enfocada en soluciones de IA.",
      timestamp: "2023-10-01T10:05:00Z",
      isCurrentUser: true,
    },
  ],
}

export default function ChatDetailPage() {
  const params = useParams()
  const chatIdRaw = params.id
  const chatId = Array.isArray(chatIdRaw) ? chatIdRaw[0] : chatIdRaw

  const [messages, setMessages] = useState<Message[]>(chatId && messagesData[chatId] ? messagesData[chatId] : [])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chat = chats.find((c) => c.id === chatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: "user",
      senderName: "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate seller typing and response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const sellerResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: "seller",
        senderName: chat?.participant.name || "Seller",
        content: "Gracias por tu mensaje! Te responderé con más detalles en breve.",
        timestamp: new Date().toISOString(),
        isCurrentUser: false,
      }
      setMessages((prev) => [...prev, sellerResponse])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: string) => {
    const messageDate = new Date(date)
    const now = new Date()
    const diff = now.getTime() - messageDate.getTime()

    if (diff < 60 * 1000) {
      return "Just now"
    } else if (diff < 60 * 60 * 1000) {
      return `Hace ${Math.floor(diff / (60 * 1000))} minutos`
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `Hace ${Math.floor(diff / (60 * 60 * 1000))} horas`
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }
  }

  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chat no encontrado</h1>
          <Link href="/chat">
            <Button>Regresar a Mensajes</Button>
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
                  <AvatarImage src={chat.participant.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{chat.participant.name[0]}</AvatarFallback>
                </Avatar>
                {chat.participant.isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div>
                <h2 className="font-semibold">{chat.participant.name}</h2>
                <p className="text-sm text-muted-foreground">{chat.serviceTitle}</p>
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
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[70%] ${message.isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                    {!message.isCurrentUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={chat.participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{chat.participant.name[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[70%]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={chat.participant.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{chat.participant.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  placeholder="Type your message..."
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
              Presiona Enter para enviar. Usa Shift+Enter para saltar a una nueva línea.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
