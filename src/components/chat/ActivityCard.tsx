'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ActivityData {
  id: string
  name: string
  description?: string
  image?: string
  rating?: number
  review_count?: number
  duration?: string
  location: {
    address?: string
    city: string
  }
  price: {
    amount: number
    currency: string
  }
  category?: string
  tags?: string[]
  group_size?: string
  availability?: string
  cancellation?: string
  booking_url?: string
}

interface ActivityCardProps {
  activity: ActivityData
  onSelect?: (activity: ActivityData) => void
  selected?: boolean
}

export function ActivityCard({ activity, onSelect, selected }: ActivityCardProps) {
  // Guard against invalid activity data
  if (!activity || !activity.location || !activity.price) {
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
          'overflow-hidden cursor-pointer transition-all hover:border-zinc-600 h-full flex flex-col',
          selected && 'border-zinc-600 bg-zinc-800/30'
        )}
        onClick={() => onSelect?.(activity)}
      >
        {/* Image - compact */}
        <div className="h-24 relative bg-muted flex-shrink-0">
          {activity.image ? (
            <img
              src={activity.image}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-800">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          {activity.category && (
            <Badge className="absolute top-1 left-1 bg-zinc-600 text-[10px] px-1.5 py-0">
              {activity.category}
            </Badge>
          )}
          {activity.rating && (
            <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/60 rounded px-1.5 py-0.5">
              <Star className="w-3 h-3 fill-zinc-400 text-zinc-400" />
              <span className="text-white text-[10px] font-medium">{activity.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content - compact */}
        <div className="flex-1 p-2 flex flex-col min-h-0">
          {/* Name */}
          <h3 className="font-semibold text-xs line-clamp-2 leading-tight">{activity.name}</h3>

          {/* Details */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
            {activity.location.city && (
              <div className="flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" />
                <span>{activity.location.city}</span>
              </div>
            )}
            {activity.duration && (
              <div className="flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                <span>{activity.duration}</span>
              </div>
            )}
          </div>

          {/* Price - bottom */}
          <div className="mt-auto pt-1.5 flex items-end justify-between">
            <div className="text-right w-full">
              <p className="text-sm font-bold text-zinc-200">
                {formatPrice(activity.price.amount, activity.price.currency)}
              </p>
              <p className="text-[10px] text-muted-foreground">per person</p>
            </div>
          </div>
        </div>

        {/* Action Bar - minimal */}
        <div className="px-2 py-1 bg-muted/50 border-t border-border">
          {activity.booking_url ? (
            <Button
              size="sm"
              variant="ghost"
              className="w-full h-6 text-[10px] gap-0.5"
              onClick={(e) => {
                e.stopPropagation()
                window.open(activity.booking_url, '_blank', 'noopener,noreferrer')
              }}
            >
              Book Now
              <ArrowRight className="w-2.5 h-2.5" />
            </Button>
          ) : (
            <Button size="sm" variant="ghost" className="w-full h-6 text-[10px] gap-0.5">
              View Details
              <ArrowRight className="w-2.5 h-2.5" />
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

interface ActivityListProps {
  activities: ActivityData[]
  onSelect?: (activity: ActivityData) => void
  selectedId?: string
}

export function ActivityList({ activities, onSelect, selectedId }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <Card className="p-6 text-center">
        <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">No activities found</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {activities.map((activity, index) => (
        <ActivityCard
          key={activity.id || index}
          activity={activity}
          onSelect={onSelect}
          selected={activity.id === selectedId}
        />
      ))}
    </div>
  )
}
