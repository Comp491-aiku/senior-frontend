'use client'

import { AgentActivity } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  ChevronRight,
  Info,
} from 'lucide-react'
import { useState } from 'react'

interface AgentActivityVisualizationProps {
  activities: AgentActivity[]
  showDetails?: boolean
}

const AGENT_INFO = {
  NLUAgent: {
    icon: Brain,
    label: 'Understanding',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500',
    description: 'Parsing your travel request',
  },
  WeatherAgent: {
    icon: CloudRain,
    label: 'Weather',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
    description: 'Fetching weather forecast',
  },
  FlightAgent: {
    icon: Plane,
    label: 'Flights',
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500',
    description: 'Searching for flights',
  },
  AccommodationAgent: {
    icon: Hotel,
    label: 'Hotels',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500',
    description: 'Finding accommodations',
  },
  ActivityAgent: {
    icon: Calendar,
    label: 'Activities',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500',
    description: 'Planning daily activities',
  },
  OrchestratorAgent: {
    icon: Zap,
    label: 'Finalizing',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500',
    description: 'Building your itinerary',
  },
}

export function AgentActivityVisualization({
  activities,
  showDetails = false,
}: AgentActivityVisualizationProps) {
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set())

  const toggleExpand = (agentName: string) => {
    const newExpanded = new Set(expandedAgents)
    if (newExpanded.has(agentName)) {
      newExpanded.delete(agentName)
    } else {
      newExpanded.add(agentName)
    }
    setExpandedAgents(newExpanded)
  }

  const getAgentInfo = (agentName: string) => {
    return AGENT_INFO[agentName as keyof typeof AGENT_INFO] || {
      icon: Zap,
      label: agentName,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500',
      description: 'Processing...',
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'started':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Loader2 className="h-4 w-4 text-gray-400" />
    }
  }

  const currentProgress = activities.length > 0
    ? activities[activities.length - 1].progress
    : 0

  // Group parallel agents (same progress range)
  const groupedActivities: { activities: AgentActivity[]; isParallel: boolean }[] = []
  let currentGroup: AgentActivity[] = []

  activities.forEach((activity, idx) => {
    if (currentGroup.length === 0) {
      currentGroup.push(activity)
    } else {
      const prevActivity = currentGroup[0]
      // Check if activities are parallel (similar progress range)
      const isParallel =
        Math.abs(activity.progress - prevActivity.progress) < 10 &&
        activity.status === 'started' && prevActivity.status === 'started'

      if (isParallel) {
        currentGroup.push(activity)
      } else {
        groupedActivities.push({
          activities: [...currentGroup],
          isParallel: currentGroup.length > 1,
        })
        currentGroup = [activity]
      }
    }

    // Push last group
    if (idx === activities.length - 1) {
      groupedActivities.push({
        activities: currentGroup,
        isParallel: currentGroup.length > 1,
      })
    }
  })

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Overall Progress</span>
          <span className="text-muted-foreground">{currentProgress}%</span>
        </div>
        <Progress value={currentProgress} className="h-2" />
      </div>

      {/* Agent Timeline */}
      <div className="space-y-3">
        {groupedActivities.map((group, groupIdx) => (
          <div key={groupIdx}>
            {group.isParallel ? (
              // Parallel agents - show side by side
              <div className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  {group.activities.map((activity, idx) => (
                    <AgentCard
                      key={idx}
                      activity={activity}
                      info={getAgentInfo(activity.agent)}
                      isExpanded={expandedAgents.has(activity.agent)}
                      onToggle={() => toggleExpand(activity.agent)}
                      showDetails={showDetails}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Sequential agents
              <>
                {group.activities.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <AgentCard
                      activity={activity}
                      info={getAgentInfo(activity.agent)}
                      isExpanded={expandedAgents.has(activity.agent)}
                      onToggle={() => toggleExpand(activity.agent)}
                      showDetails={showDetails}
                      getStatusIcon={getStatusIcon}
                    />
                  </div>
                ))}
              </>
            )}

            {/* Connection Arrow */}
            {groupIdx < groupedActivities.length - 1 && (
              <div className="flex justify-center my-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface AgentCardProps {
  activity: AgentActivity
  info: {
    icon: any
    label: string
    color: string
    bgColor: string
    borderColor: string
    description: string
  }
  isExpanded: boolean
  onToggle: () => void
  showDetails: boolean
  getStatusIcon: (status: string) => JSX.Element
}

function AgentCard({
  activity,
  info,
  isExpanded,
  onToggle,
  showDetails,
  getStatusIcon,
}: AgentCardProps) {
  const Icon = info.icon

  return (
    <Card
      className={`p-3 border-2 transition-all ${
        activity.status === 'completed'
          ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
          : activity.status === 'started'
          ? `${info.borderColor} ${info.bgColor} animate-pulse`
          : activity.status === 'error'
          ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
          : 'border-gray-200 bg-gray-50 dark:bg-gray-900/20'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${info.bgColor}`}
        >
          <Icon className={`h-5 w-5 ${info.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm">{info.label}</h4>
            {getStatusIcon(activity.status)}
          </div>

          <p className="text-xs text-muted-foreground mb-2">{activity.message}</p>

          {/* Progress Bar for running agents */}
          {activity.status === 'started' && (
            <div className="mb-2">
              <Progress value={activity.progress} className="h-1.5" />
            </div>
          )}

          {/* Status Badge */}
          <Badge
            variant={
              activity.status === 'completed'
                ? 'default'
                : activity.status === 'error'
                ? 'destructive'
                : 'secondary'
            }
            className="text-xs"
          >
            {activity.status === 'completed'
              ? 'Completed'
              : activity.status === 'error'
              ? 'Error'
              : 'Running'}
          </Badge>

          {/* Agent Data Details */}
          {showDetails && activity.data && Object.keys(activity.data).length > 0 && (
            <button
              onClick={onToggle}
              className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
            >
              <Info className="h-3 w-3" />
              {isExpanded ? 'Hide' : 'Show'} details
            </button>
          )}

          {/* Expanded Details */}
          {isExpanded && activity.data && (
            <div className="mt-2 p-2 bg-background/50 rounded border text-xs space-y-1">
              {Object.entries(activity.data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="font-medium">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
