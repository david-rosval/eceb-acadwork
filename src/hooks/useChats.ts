import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import axios from "axios"

export interface ChatSummary {
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

export function useChats(
  userId: string,
  options?: Omit<
    UseQueryOptions<ChatSummary[], Error, ChatSummary[], [string, string]>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<ChatSummary[], Error, ChatSummary[], [string, string]>({
    queryKey: ["chats", userId],
    queryFn: async () => {
      const response = await axios.get(`/api/chats/${userId}`)
      return response.data
    },
    enabled: !!userId,
    ...options,
  })
}
