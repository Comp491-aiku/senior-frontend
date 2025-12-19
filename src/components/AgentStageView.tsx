'use client'

import { AgentActivity } from '@/types'
import {
  Brain,
  CloudRain,
  Plane,
  Hotel,
  Calendar,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react'

interface AgentStageViewProps {
  activities: AgentActivity[]
}

const AGENT_STAGES = [
  {
    name: 'NLUAgent',
    label: 'Understanding',
    icon: Brain,
    emoji: '🧠',
  },
  {
    name: 'WeatherAgent',
    label: 'Weather',
    icon: CloudRain,
    emoji: '🌤️',
  },
  {
    name: 'FlightAgent',
    label: 'Flights',
    icon: Plane,
    emoji: '✈️',
  },
  {
    name: 'AccommodationAgent',
    label: 'Hotels',
    icon: Hotel,
    emoji: '🏨',
  },
  {
    name: 'ActivityAgent',
    label: 'Activities',
    icon: Calendar,
    emoji: '🎯',
  },
  {
    name: 'OrchestratorAgent',
    label: 'Building',
    icon: Zap,
    emoji: '🎭',
  },
]

export function AgentStageView({ activities }: AgentStageViewProps) {
  const getStageStatus = (stageName: string) => {
    const activity = activities.find((a) => a.agent === stageName)
    if (!activity) return 'pending'
    return activity.status
  }

  const getStageMessage = (stageName: string) => {
    const activity = activities.find((a) => a.agent === stageName)
    return activity?.message || ''
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {AGENT_STAGES.map((stage) => {
        const status = getStageStatus(stage.name)
        const message = getStageMessage(stage.name)

        return (
          <div
            key={stage.name}
            className={`
              relative p-3 rounded-lg border-2 transition-all duration-300
              ${status === 'completed'
                ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                : ''
              }
              ${status === 'started'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 animate-pulse'
                : ''
              }
              ${status === 'error'
                ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                : ''
              }
              ${status === 'pending'
                ? 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 opacity-50'
                : ''
              }
            `}
          >
            {/* Status Indicator */}
            <div className="absolute -top-2 -right-2">
              {status === 'completed' && (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              )}
              {status === 'started' && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                </div>
              )}
              {status === 'error' && (
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="text-3xl text-center mb-2">{stage.emoji}</div>

            {/* Label */}
            <div className="text-xs text-center font-medium mb-1">{stage.label}</div>

            {/* Message */}
            {message && status !== 'pending' && (
              <div className="text-[10px] text-center text-muted-foreground line-clamp-2">
                {message}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
