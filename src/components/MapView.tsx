'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Location } from '@/types'

interface MapViewProps {
  locations: Location[]
  center?: { lat: number; lng: number }
  zoom?: number
}

export function MapView({ locations, center, zoom = 12 }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a placeholder for map integration
    // In production, you would integrate with Mapbox or Google Maps here
    console.log('Initializing map with locations:', locations)
  }, [locations])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map View</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center"
        >
          <div className="text-center text-muted-foreground">
            <p className="mb-2">Map Integration</p>
            <p className="text-sm">
              {locations.length} location{locations.length !== 1 ? 's' : ''} to display
            </p>
            <p className="text-xs mt-4">
              Integrate with Mapbox or Google Maps API
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
