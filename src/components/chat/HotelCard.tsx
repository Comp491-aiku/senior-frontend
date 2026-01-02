'use client'

import { motion } from 'framer-motion'
import { Hotel, Star, MapPin, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface HotelData {
  id: string
  name: string
  image?: string
  rating: number
  review_score?: number
  review_count?: number
  location: {
    address: string
    city: string
    distance_to_center?: string
  }
  price: {
    amount: number
    currency: string
    per_night: boolean
  }
  amenities?: string[]
  room_type?: string
  cancellation?: string
  breakfast_included?: boolean
  booking_url?: string
}

interface HotelCardProps {
  hotel: HotelData
  onSelect?: (hotel: HotelData) => void
  selected?: boolean
}

export function HotelCard({ hotel, onSelect, selected }: HotelCardProps) {
  // Guard against invalid hotel data
  if (!hotel || !hotel.location || !hotel.price) {
    return null
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
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={cn(
          'overflow-hidden cursor-pointer transition-all hover:border-primary/50 h-full flex flex-col',
          selected && 'border-primary bg-primary/5'
        )}
        onClick={() => onSelect?.(hotel)}
      >
        {/* Image - compact height */}
        <div className="h-28 relative bg-muted flex-shrink-0">
          {hotel.image ? (
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-600/10">
              <Hotel className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          {hotel.breakfast_included && (
            <Badge className="absolute top-1 left-1 bg-green-500 text-[10px] px-1.5 py-0">
              Breakfast
            </Badge>
          )}
          {/* Rating badge */}
          <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/60 rounded px-1.5 py-0.5">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span className="text-white text-xs font-medium">{hotel.rating}</span>
          </div>
        </div>

        {/* Content - compact */}
        <div className="flex-1 p-2.5 flex flex-col">
          {/* Name */}
          <h3 className="font-semibold text-sm line-clamp-1">{hotel.name}</h3>

          {/* Location */}
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{hotel.location.city}</span>
          </div>

          {/* Price - bottom */}
          <div className="mt-auto pt-2 flex items-end justify-between">
            <div>
              {hotel.cancellation && (
                <p className="text-[10px] text-green-500">{hotel.cancellation}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-primary">
                {formatPrice(hotel.price.amount, hotel.price.currency)}
              </p>
              {hotel.price.per_night && (
                <p className="text-[10px] text-muted-foreground">per night</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar - minimal */}
        <div className="px-2.5 py-1.5 bg-muted/50 border-t border-border">
          {hotel.booking_url ? (
            <Button
              size="sm"
              variant="ghost"
              className="w-full h-7 text-xs gap-1"
              onClick={(e) => {
                e.stopPropagation()
                window.open(hotel.booking_url, '_blank', 'noopener,noreferrer')
              }}
            >
              Book Now
              <ArrowRight className="w-3 h-3" />
            </Button>
          ) : (
            <Button size="sm" variant="ghost" className="w-full h-7 text-xs gap-1">
              View Details
              <ArrowRight className="w-3 h-3" />
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

interface HotelListProps {
  hotels: HotelData[]
  onSelect?: (hotel: HotelData) => void
  selectedId?: string
}

export function HotelList({ hotels, onSelect, selectedId }: HotelListProps) {
  if (hotels.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Hotel className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">No hotels found</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {hotels.map((hotel, index) => (
        <HotelCard
          key={hotel.id || index}
          hotel={hotel}
          onSelect={onSelect}
          selected={hotel.id === selectedId}
        />
      ))}
    </div>
  )
}
