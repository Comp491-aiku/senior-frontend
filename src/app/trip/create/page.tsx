'use client'

import { useRouter } from 'next/navigation'
import { TripForm } from '@/components/TripForm'
import { useTripPlanner } from '@/hooks/useTripPlanner'
import type { TripFormData } from '@/types'

export default function CreateTripPage() {
  const router = useRouter()
  const { createTrip } = useTripPlanner()

  const handleSubmit = async (data: TripFormData) => {
    try {
      const trip = await createTrip.mutateAsync(data)
      router.push(`/trip/${trip.id}`)
    } catch (error) {
      console.error('Failed to create trip:', error)
    }
  }

  return (
    <div className="container py-8">
      <TripForm onSubmit={handleSubmit} isLoading={createTrip.isPending} />
    </div>
  )
}
