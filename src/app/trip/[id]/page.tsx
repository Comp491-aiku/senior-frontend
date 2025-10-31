'use client'

import { use } from 'react'
import { useTrip } from '@/hooks/useTripPlanner'
import { useItinerary } from '@/hooks/useItinerary'
import { ItineraryView } from '@/components/ItineraryView'
import { BudgetTracker } from '@/components/BudgetTracker'
import { MapView } from '@/components/MapView'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Calendar, MapPin, Users, Sparkles } from 'lucide-react'
import { format } from 'date-fns'

interface TripPageProps {
  params: Promise<{ id: string }>
}

export default function TripPage({ params }: TripPageProps) {
  const resolvedParams = use(params)
  const { data: trip, isLoading: tripLoading } = useTrip(resolvedParams.id)
  const { itinerary, generateItinerary } = useItinerary(resolvedParams.id)

  if (tripLoading || !trip) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const hasItinerary = itinerary.data

  return (
    <div className="container py-8">
      {/* Trip Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{trip.destination}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{trip.destination}</span>
              </div>
            </div>
          </div>
          <Badge className="bg-primary">{trip.status}</Badge>
        </div>

        {!hasItinerary && (
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">Ready to plan your trip?</h3>
                <p className="text-muted-foreground text-sm">
                  Generate an AI-powered itinerary with personalized recommendations
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => generateItinerary.mutate()}
                disabled={generateItinerary.isPending}
              >
                {generateItinerary.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Itinerary
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {hasItinerary ? (
        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="space-y-6">
            <ItineraryView itinerary={itinerary.data} />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetTracker
              totalBudget={trip.budget}
              spentBudget={itinerary.data?.totalCost || 0}
              currency={trip.currency}
            />
          </TabsContent>

          <TabsContent value="map">
            <MapView
              locations={itinerary.data?.days.flatMap(day =>
                day.activities.map(activity => activity.location)
              ) || []}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Trip Details</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Budget</dt>
                <dd className="font-medium">{trip.currency} {trip.budget.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Accommodation</dt>
                <dd className="font-medium capitalize">{trip.preferences.accommodation}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Pace</dt>
                <dd className="font-medium capitalize">{trip.preferences.pace}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Preferences</h3>
            <div className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground mb-1">Interests</dt>
                <dd className="flex flex-wrap gap-2">
                  {trip.preferences.interests?.map((interest, i) => (
                    <Badge key={i} variant="secondary">{interest}</Badge>
                  ))}
                </dd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
