'use client'

import { useTripPlanner } from '@/hooks/useTripPlanner'
import { TripCard } from '@/components/TripCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Loader2 } from 'lucide-react'

export default function TripsPage() {
  const { trips } = useTripPlanner()

  if (trips.isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (trips.isError) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error loading trips</h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    )
  }

  const tripList = trips.data?.items || []

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your travel plans
          </p>
        </div>
        <Link href="/trip/create">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </Link>
      </div>

      {tripList.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No trips yet</h2>
          <p className="text-muted-foreground mb-6">
            Start planning your next adventure
          </p>
          <Link href="/trip/create">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Trip
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tripList.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  )
}
