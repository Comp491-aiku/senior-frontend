'use client'

import { motion } from 'framer-motion'
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Compass
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface WeatherData {
  location: {
    city: string
    country: string
  }
  current: {
    temperature: number
    feels_like: number
    condition: string
    humidity: number
    wind_speed: number
    wind_direction?: string
    visibility?: number
    uv_index?: number
  }
  forecast?: {
    date: string
    high: number
    low: number
    condition: string
    precipitation_chance?: number
  }[]
}

const weatherIcons: Record<string, React.ReactNode> = {
  sunny: <Sun className="w-12 h-12 text-yellow-500" />,
  clear: <Sun className="w-12 h-12 text-yellow-500" />,
  cloudy: <Cloud className="w-12 h-12 text-gray-400" />,
  overcast: <Cloud className="w-12 h-12 text-gray-500" />,
  rain: <CloudRain className="w-12 h-12 text-blue-400" />,
  rainy: <CloudRain className="w-12 h-12 text-blue-400" />,
  drizzle: <CloudRain className="w-12 h-12 text-blue-300" />,
  snow: <CloudSnow className="w-12 h-12 text-blue-200" />,
  snowy: <CloudSnow className="w-12 h-12 text-blue-200" />,
  thunder: <CloudLightning className="w-12 h-12 text-purple-500" />,
  storm: <CloudLightning className="w-12 h-12 text-purple-500" />,
}

const getWeatherIcon = (condition: string) => {
  const normalizedCondition = condition.toLowerCase()
  for (const [key, icon] of Object.entries(weatherIcons)) {
    if (normalizedCondition.includes(key)) {
      return icon
    }
  }
  return <Cloud className="w-12 h-12 text-gray-400" />
}

const getSmallWeatherIcon = (condition: string) => {
  const normalizedCondition = condition.toLowerCase()
  for (const [key] of Object.entries(weatherIcons)) {
    if (normalizedCondition.includes(key)) {
      if (key === 'sunny' || key === 'clear') return <Sun className="w-5 h-5 text-yellow-500" />
      if (key === 'cloudy' || key === 'overcast') return <Cloud className="w-5 h-5 text-gray-400" />
      if (key === 'rain' || key === 'rainy' || key === 'drizzle') return <CloudRain className="w-5 h-5 text-blue-400" />
      if (key === 'snow' || key === 'snowy') return <CloudSnow className="w-5 h-5 text-blue-200" />
      if (key === 'thunder' || key === 'storm') return <CloudLightning className="w-5 h-5 text-purple-500" />
    }
  }
  return <Cloud className="w-5 h-5 text-gray-400" />
}

interface WeatherCardProps {
  weather: WeatherData
  className?: string
}

export function WeatherCard({ weather, className }: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn('p-4', className)}>
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {weather.location.city}, {weather.location.country}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {weather.current.condition}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {getWeatherIcon(weather.current.condition)}
            <div className="text-right">
              <p className="text-4xl font-bold">{weather.current.temperature}°</p>
              <p className="text-sm text-muted-foreground">
                Feels like {weather.current.feels_like}°
              </p>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-medium">{weather.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-medium">{weather.current.wind_speed} km/h</p>
            </div>
          </div>
          {weather.current.visibility && (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-muted-foreground">Visibility</p>
                <p className="font-medium">{weather.current.visibility} km</p>
              </div>
            </div>
          )}
          {weather.current.uv_index !== undefined && (
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-xs text-muted-foreground">UV Index</p>
                <p className="font-medium">{weather.current.uv_index}</p>
              </div>
            </div>
          )}
        </div>

        {/* Forecast */}
        {weather.forecast && weather.forecast.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-medium mb-3">Forecast</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {weather.forecast.slice(0, 5).map((day, index) => (
                <div
                  key={index}
                  className="text-center p-2 rounded-lg bg-muted/50"
                >
                  <p className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <div className="flex justify-center my-1">
                    {getSmallWeatherIcon(day.condition)}
                  </div>
                  <p className="text-sm font-medium">{day.high}°</p>
                  <p className="text-xs text-muted-foreground">{day.low}°</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
