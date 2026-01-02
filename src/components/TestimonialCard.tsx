'use client'

import { Card } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'
import { ParallaxCard } from './ParallaxCard'

interface TestimonialCardProps {
  name: string
  role: string
  image: string
  rating: number
  text: string
  trip: string
}

export function TestimonialCard({ name, role, image, rating, text, trip }: TestimonialCardProps) {
  return (
    <ParallaxCard intensity={5}>
      <Card className="p-6 h-full hover:shadow-xl transition-shadow">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-200 font-bold text-lg flex-shrink-0">
            {name.charAt(0)}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating ? 'fill-zinc-400 text-zinc-400' : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <Quote className="h-8 w-8 text-zinc-600" />
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{text}</p>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">Trip to <span className="font-semibold text-foreground">{trip}</span></p>
        </div>
      </Card>
    </ParallaxCard>
  )
}
