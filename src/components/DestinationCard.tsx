'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, DollarSign, Calendar, ArrowRight } from 'lucide-react'
import { ParallaxCard } from './ParallaxCard'
import Link from 'next/link'
import Image from 'next/image'

interface DestinationCardProps {
  name: string
  country: string
  image: string
  price: string
  duration: string
  description: string
  tags: string[]
  gradient: string
}

export function DestinationCard({
  name,
  country,
  image,
  price,
  duration,
  description,
  tags,
  gradient
}: DestinationCardProps) {
  return (
    <ParallaxCard intensity={8}>
      <Card className="overflow-hidden h-full group cursor-pointer hover:shadow-2xl transition-all duration-300">
        {/* Image with gradient overlay */}
        <div className="relative h-48 overflow-hidden">
          {/* Background Image */}
          <Image
            src={image}
            alt={`${name}, ${country}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {/* Gradient overlay for better text readability */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 group-hover:opacity-30 transition-opacity`} />
          {/* Dark overlay at bottom for text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white z-10">
              <MapPin className="h-8 w-8 mx-auto mb-2 group-hover:scale-110 transition-transform drop-shadow-lg" />
              <h3 className="text-2xl font-bold drop-shadow-lg">{name}</h3>
              <p className="text-sm opacity-90 drop-shadow-md">{country}</p>
            </div>
          </div>
          {/* Animated overlay on hover */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-3 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="font-semibold text-foreground">{price}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          </div>

          <Link href="/trip/plan">
            <Button className="w-full group/btn" variant="outline">
              Plan Trip
              <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </Card>
    </ParallaxCard>
  )
}
