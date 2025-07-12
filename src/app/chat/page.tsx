"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MoreVertical, MessageCircle, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { useChats } from "@/hooks/useChats"
import { useAuth } from "@/context/AuthContext"
import { formattedUserName } from "@/lib/utils"

export default function ChatPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const { data: chats, isLoading } = useChats(user?.id ?? "", {
    enabled: !!user?.id,
  })


  const filteredChats = chats?.filter(
    (chat) =>
      `${chat.firstName} ${chat.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  ) ?? []

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate)
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
        <div className="mb-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Regresar al inicio
          </Link>
        </div>

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
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">Cargando conversaciones...</div>
              ) : (
                filteredChats.map((chat, index) => {
                  const fullName = `${chat.firstName} ${chat.lastName}`
                  const avatarSrc = `https://ui-avatars.com/api/?name=${formattedUserName(
                    chat.firstName,
                    chat.lastName
                  )}`
                  const chatLink = `/chat/${chat.id}`

                  return (
                    <Link key={chat.id ?? index} href={chatLink}>
                      <div className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={avatarSrc} />
                            <AvatarFallback>{formattedUserName(chat.firstName, chat.lastName)}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium truncate">{fullName}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(chat.lastMessage.timestamp)}
                                </span>
                                {!chat.lastMessage.isRead && (
                                  <Badge className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                                    1
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p
                              className={`text-sm truncate ${
                                chat.lastMessage.isRead ? "text-muted-foreground" : "font-medium"
                              }`}
                            >
                              {chat.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
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
