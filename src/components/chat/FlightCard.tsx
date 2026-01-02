'use client'

import { motion } from 'framer-motion'
import { Plane, Clock, ArrowRight, Luggage, Wifi, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FlightData {
  id: string
  airline: string
  airline_logo?: string
  flight_number: string
  departure: {
    airport: string
    city: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    city: string
    time: string
    date: string
  }
  duration: string
  stops: number
  price: {
    amount: number
    currency: string
  }
  cabin_class: string
  amenities?: string[]
  available_seats?: number
  booking_url?: string
}

interface FlightCardProps {
  flight: FlightData
  onSelect?: (flight: FlightData) => void
  selected?: boolean
}

export function FlightCard({ flight, onSelect, selected }: FlightCardProps) {
  // Guard against invalid flight data
  if (!flight || !flight.departure || !flight.arrival || !flight.price) {
    return null
  }

  const formatTime = (time: string | undefined) => {
    if (!time) return '--:--'
    return time.slice(0, 5) // Get HH:MM format
  }

  const formatPrice = (amount: number | undefined, currency: string | undefined) => {
    if (amount === undefined || !currency) return '--'
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount)
    } catch {
      return `${currency} ${amount}`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'p-4 cursor-pointer transition-all hover:border-zinc-600',
          selected && 'border-zinc-600 bg-zinc-800/30'
        )}
        onClick={() => onSelect?.(flight)}
      >
        <div className="flex flex-col gap-4">
          {/* Header: Airline and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {flight.airline_logo ? (
                <img
                  src={flight.airline_logo}
                  alt={flight.airline}
                  className="w-8 h-8 rounded"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                  <Plane className="w-4 h-4" />
                </div>
              )}
              <div>
                <p className="font-medium">{flight.airline}</p>
                <p className="text-xs text-muted-foreground">{flight.flight_number}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-zinc-200">
                {formatPrice(flight.price.amount, flight.price.currency)}
              </p>
              <p className="text-xs text-muted-foreground">{flight.cabin_class}</p>
            </div>
          </div>

          {/* Flight Route */}
          <div className="flex items-center justify-between gap-4">
            {/* Departure */}
            <div className="text-center">
              <p className="text-2xl font-bold">{formatTime(flight.departure.time)}</p>
              <p className="text-sm font-medium">{flight.departure.airport}</p>
              <p className="text-xs text-muted-foreground">{flight.departure.city}</p>
            </div>

            {/* Flight Path */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {flight.duration}
              </div>
              <div className="relative w-full h-px bg-border">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-500" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-500" />
                {flight.stops > 0 && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zinc-400" />
                )}
              </div>
              <Badge variant={flight.stops === 0 ? 'default' : 'secondary'} className="text-xs">
                {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
              </Badge>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-2xl font-bold">{formatTime(flight.arrival.time)}</p>
              <p className="text-sm font-medium">{flight.arrival.airport}</p>
              <p className="text-xs text-muted-foreground">{flight.arrival.city}</p>
            </div>
          </div>

          {/* Footer: Amenities and Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3 text-muted-foreground">
              {flight.amenities?.includes('baggage') && (
                <div className="flex items-center gap-1 text-xs">
                  <Luggage className="w-3 h-3" />
                  <span>Baggage</span>
                </div>
              )}
              {flight.amenities?.includes('wifi') && (
                <div className="flex items-center gap-1 text-xs">
                  <Wifi className="w-3 h-3" />
                  <span>WiFi</span>
                </div>
              )}
              {flight.available_seats && (
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Users className="w-3 h-3" />
                  <span>{flight.available_seats} left</span>
                </div>
              )}
            </div>
            {flight.booking_url ? (
              <Button
                size="sm"
                variant="ghost"
                className="gap-1"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(flight.booking_url, '_blank', 'noopener,noreferrer')
                }}
              >
                Book Now
                <ArrowRight className="w-3 h-3" />
              </Button>
            ) : (
              <Button size="sm" variant="ghost" className="gap-1">
                Select
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

interface FlightListProps {
  flights: FlightData[]
  onSelect?: (flight: FlightData) => void
  selectedId?: string
}

export function FlightList({ flights, onSelect, selectedId }: FlightListProps) {
  if (flights.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Plane className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">No flights found</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {flights.map((flight, index) => (
        <FlightCard
          key={flight.id || index}
          flight={flight}
          onSelect={onSelect}
          selected={flight.id === selectedId}
        />
      ))}
    </div>
  )
}
