'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Itinerary, DayItinerary } from '@/types'
import { format } from 'date-fns'

interface ItineraryViewProps {
  itinerary: Itinerary
}

export function ItineraryView({ itinerary }: ItineraryViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Itinerary</CardTitle>
          <CardDescription>
            Generated on {format(new Date(itinerary.generatedAt), 'PPP')} • Total Cost: $
            {itinerary.totalCost.toFixed(2)}
          </CardDescription>
        </CardHeader>
      </Card>

      {itinerary.days.map((day) => (
        <DayCard key={day.dayNumber} day={day} />
      ))}
    </div>
  )
}

function DayCard({ day }: { day: DayItinerary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Day {day.dayNumber}</CardTitle>
        <CardDescription>{format(new Date(day.date), 'EEEE, MMMM d, yyyy')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {day.weather && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{day.weather.icon}</span>
              <div>
                <p className="font-medium">{day.weather.condition}</p>
                <p className="text-sm text-muted-foreground">
                  {day.weather.temperature.min}° - {day.weather.temperature.max}°{' '}
                  {day.weather.temperature.unit === 'celsius' ? 'C' : 'F'}
                </p>
              </div>
            </div>
          </div>
        )}

        {day.activities.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Activities</h4>
            {day.activities.map((activity) => (
              <div key={activity.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">{activity.name}</h5>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-sm mt-1">
                      {activity.startTime} - {activity.endTime} ({activity.duration} min)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.location.name}, {activity.location.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${activity.cost}</p>
                    {activity.rating && (
                      <p className="text-sm text-muted-foreground">
                        ⭐ {activity.rating.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {day.meals.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Meals</h4>
            {day.meals.map((meal) => (
              <div key={meal.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">
                      {meal.name} <span className="text-sm text-muted-foreground">({meal.type})</span>
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {meal.cuisine} • {meal.time}
                    </p>
                  </div>
                  <p className="font-medium">${meal.cost}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {day.accommodation && (
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Accommodation</h4>
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-medium">{day.accommodation.name}</h5>
                <p className="text-sm text-muted-foreground">
                  {day.accommodation.type} • {day.accommodation.location.address}
                </p>
                {day.accommodation.rating && (
                  <p className="text-sm">⭐ {day.accommodation.rating.toFixed(1)}</p>
                )}
              </div>
              <p className="font-medium">${day.accommodation.costPerNight}/night</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
