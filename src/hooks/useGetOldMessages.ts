import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { Message } from "@/types"

interface UseGetOldMessagesProps {
  user1Id: string
  user2Id: string
}

export function useGetOldMessages({ user1Id, user2Id }: UseGetOldMessagesProps) {
  return useQuery({
    queryKey: ["messages", user1Id, user2Id],
    queryFn: async () => {
      const res = await axios.get(`/api/messages`, {
        params: { user1Id, user2Id },
      })
      return res.data as Message[]
    },
    enabled: !!user1Id && !!user2Id,
  })
}
