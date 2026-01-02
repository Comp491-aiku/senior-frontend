'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import type { Trip } from '@/types'

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  const statusColors = {
    draft: 'bg-zinc-600',
    planning: 'bg-zinc-500',
    confirmed: 'bg-zinc-400',
    completed: 'bg-zinc-700',
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{trip.destination}</CardTitle>
            <CardDescription className="mt-1">
              {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
            </CardDescription>
          </div>
          <Badge className={statusColors[trip.status]}>
            {trip.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{trip.destination}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span>
            {trip.currency} {trip.budget.toLocaleString()}
          </span>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Link href={`/trip/${trip.id}`} className="flex-1">
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </Link>
        <Link href={`/trip/edit/${trip.id}`}>
          <Button variant="outline">
            Edit
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
