import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api'
import type { Trip, TripFormData } from '@/types'

export function useTripPlanner() {
  const queryClient = useQueryClient()

  const trips = useQuery({
    queryKey: ['trips'],
    queryFn: () => apiClient.getTrips(),
  })

  const createTrip = useMutation({
    mutationFn: (data: TripFormData) => apiClient.createTrip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })

  const updateTrip = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TripFormData> }) =>
      apiClient.updateTrip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })

  const deleteTrip = useMutation({
    mutationFn: (id: string) => apiClient.deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
    },
  })

  return {
    trips,
    createTrip,
    updateTrip,
    deleteTrip,
  }
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => apiClient.getTrip(id),
    enabled: !!id,
  })
}
