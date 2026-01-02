'use client'

import { motion } from 'framer-motion'
import { Hotel, Star, MapPin, Wifi, Car, Coffee, Dumbbell, ArrowRight } from 'lucide-react'
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
}

interface HotelCardProps {
  hotel: HotelData
  onSelect?: (hotel: HotelData) => void
  selected?: boolean
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3 h-3" />,
  parking: <Car className="w-3 h-3" />,
  breakfast: <Coffee className="w-3 h-3" />,
  gym: <Dumbbell className="w-3 h-3" />,
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
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'overflow-hidden cursor-pointer transition-all hover:border-primary/50',
          selected && 'border-primary bg-primary/5'
        )}
        onClick={() => onSelect?.(hotel)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-48 h-32 sm:h-auto relative bg-muted flex-shrink-0">
            {hotel.image ? (
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Hotel className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            {hotel.breakfast_included && (
              <Badge className="absolute top-2 left-2 bg-green-500">
                Breakfast included
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold line-clamp-1">{hotel.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: hotel.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
                {hotel.review_score && (
                  <Badge variant="secondary" className="flex-shrink-0">
                    {hotel.review_score.toFixed(1)}
                    {hotel.review_count && (
                      <span className="text-muted-foreground ml-1">
                        ({hotel.review_count})
                      </span>
                    )}
                  </Badge>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">
                  {hotel.location.address}, {hotel.location.city}
                </span>
              </div>
              {hotel.location.distance_to_center && (
                <p className="text-xs text-muted-foreground mt-1">
                  {hotel.location.distance_to_center} from city center
                </p>
              )}

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  {hotel.amenities.slice(0, 4).map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      {amenityIcons[amenity.toLowerCase()] || null}
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-3">
                <div>
                  {hotel.room_type && (
                    <p className="text-sm text-muted-foreground">{hotel.room_type}</p>
                  )}
                  {hotel.cancellation && (
                    <p className="text-xs text-green-500">{hotel.cancellation}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(hotel.price.amount, hotel.price.currency)}
                  </p>
                  {hotel.price.per_night && (
                    <p className="text-xs text-muted-foreground">per night</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center justify-end">
          <Button size="sm" variant="ghost" className="gap-1">
            View Details
            <ArrowRight className="w-3 h-3" />
          </Button>
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
    <div className="space-y-3">
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
