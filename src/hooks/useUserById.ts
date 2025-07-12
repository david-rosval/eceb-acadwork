import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export interface ChatUser {
  id: string
  firstName: string
  lastName: string
}

export function useUserById(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await axios.get(`/api/users/${userId}`)
      return res.data as ChatUser
    },
    enabled: !!userId,
  })
}
