import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api'
import type { Itinerary } from '@/types'

export function useItinerary(tripId: string) {
  const queryClient = useQueryClient()

  const itinerary = useQuery({
    queryKey: ['itinerary', tripId],
    queryFn: () => apiClient.getItinerary(tripId),
    enabled: !!tripId,
  })

  const generateItinerary = useMutation({
    mutationFn: () => apiClient.generateItinerary(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] })
    },
  })

  const updateItinerary = useMutation({
    mutationFn: (data: Partial<Itinerary>) => apiClient.updateItinerary(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itinerary', tripId] })
    },
  })

  return {
    itinerary,
    generateItinerary,
    updateItinerary,
  }
}
