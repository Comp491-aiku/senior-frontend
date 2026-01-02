'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Star, Users, Calendar, Tag, ArrowRight } from 'lucide-react'
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
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'overflow-hidden cursor-pointer transition-all hover:border-primary/50',
          selected && 'border-primary bg-primary/5'
        )}
        onClick={() => onSelect?.(activity)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="sm:w-48 h-40 sm:h-auto relative bg-muted flex-shrink-0">
            {activity.image ? (
              <img
                src={activity.image}
                alt={activity.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-600/20">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            {activity.category && (
              <Badge className="absolute top-2 left-2 bg-primary">
                {activity.category}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold line-clamp-2">{activity.name}</h3>
                {activity.rating && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{activity.rating.toFixed(1)}</span>
                    {activity.review_count && (
                      <span className="text-xs text-muted-foreground">
                        ({activity.review_count})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {activity.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {activity.description}
                </p>
              )}

              {/* Details */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{activity.location.city}</span>
                </div>
                {activity.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{activity.duration}</span>
                  </div>
                )}
                {activity.group_size && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{activity.group_size}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {activity.tags && activity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {activity.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-3">
                <div className="text-xs">
                  {activity.availability && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{activity.availability}</span>
                    </div>
                  )}
                  {activity.cancellation && (
                    <p className="text-green-500 mt-1">{activity.cancellation}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(activity.price.amount, activity.price.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">per person</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center justify-end">
          <Button size="sm" variant="ghost" className="gap-1">
            Book Now
            <ArrowRight className="w-3 h-3" />
          </Button>
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
    <div className="space-y-3">
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
