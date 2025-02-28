import { useQuery } from '@tanstack/react-query'
import axiosClient from "../lib/axios"

export function useUser(userId: number | undefined) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null
      const response = await axiosClient.get(`/api/users/${userId}`)
      return response.data as User
    },
    enabled: !!userId,
  })
}