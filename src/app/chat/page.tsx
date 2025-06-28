"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MoreVertical, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Sample chat data
const chats = [
  {
    id: "chat-1",
    participant: {
      name: "Alex Johnson",
      avatar: "https://picsum.photos/seed/alex/40/40",
      isOnline: true,
    },
    lastMessage: {
      content: "Gracias por tu interés en mi servicio de desarrollo web. ¿Cómo puedo ayudarte?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false,
    },
    serviceTitle: "Desarrollo web con React y Node.js",
    unreadCount: 2,
  },
  {
    id: "chat-2",
    participant: {
      name: "Maria Garcia",
      avatar: "https://picsum.photos/seed/maria/40/40",
      isOnline: false,
    },
    lastMessage: {
      content: "Te enviaré los conceptos del logotipo mañana por la mañana.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: true,
    },
    serviceTitle: "Diseño de logotipos personalizados",
    unreadCount: 0,
  },
  {
    id: "chat-3",
    participant: {
      name: "David Chen",
      avatar: "https://picsum.photos/seed/david/40/40",
      isOnline: true,
    },
    lastMessage: {
      content: "Perfecto! Comenzaré a trabajar en tu contenido de inmediato.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
    },
    serviceTitle: "Escritor de contenido SEO",
    unreadCount: 0,
  },
  {
    id: "chat-4",
    participant: {
      name: "Sarah Wilson",
      avatar: "https://picsum.photos/seed/sarah/40/40",
      isOnline: false,
    },
    lastMessage: {
      content: "El montaje de video está casi completo. ¿Te gustaría ver una vista previa?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: false,
    },
    serviceTitle: "Editora de video profesional",
    unreadCount: 1,
  },
]

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = chats.filter(
    (chat) =>
      chat.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `Hace ${minutes}m`
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)}h`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `Hace ${days}d`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Mensajes</h1>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto h-[calc(100%-120px)]">
              {filteredChats.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No se encontraron conversaciones</div>
              ) : (
                filteredChats.map((chat) => (
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <div className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={chat.participant.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{chat.participant.name[0]}</AvatarFallback>
                          </Avatar>
                          {chat.participant.isOnline && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium truncate">{chat.participant.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(chat.lastMessage.timestamp)}
                              </span>
                              {chat.unreadCount > 0 && (
                                <Badge className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-1 truncate">{chat.serviceTitle}</p>

                          <p
                            className={`text-sm truncate ${chat.lastMessage.isRead ? "text-muted-foreground" : "font-medium"}`}
                          >
                            {chat.lastMessage.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Selecciona una conversación</h2>
              <p className="text-muted-foreground">
                Escoge una conversación de la lista a la izquierda para ver los mensajes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
