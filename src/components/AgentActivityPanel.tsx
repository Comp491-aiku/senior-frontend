'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Plane,
  Hotel,
  MapPin,
  Cloud,
  DollarSign,
  CheckCircle2,
  Loader2,
  Brain
} from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Agent {
  id: string
  name: string
  icon: any
  status: 'idle' | 'working' | 'completed'
  task: string
  progress: number
}

export function AgentActivityPanel() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'orchestrator',
      name: 'Orchestrator',
      icon: Brain,
      status: 'working',
      task: 'Coordinating travel planning workflow',
      progress: 45,
    },
    {
      id: 'flight',
      name: 'Flight Agent',
      icon: Plane,
      status: 'working',
      task: 'Searching for best flight options',
      progress: 67,
    },
    {
      id: 'hotel',
      name: 'Hotel Agent',
      icon: Hotel,
      status: 'working',
      task: 'Finding accommodation near city center',
      progress: 34,
    },
    {
      id: 'activity',
      name: 'Activity Agent',
      icon: MapPin,
      status: 'idle',
      task: 'Waiting for location confirmation',
      progress: 0,
    },
    {
      id: 'weather',
      name: 'Weather Agent',
      icon: Cloud,
      status: 'completed',
      task: 'Forecast retrieved successfully',
      progress: 100,
    },
    {
      id: 'budget',
      name: 'Budget Optimizer',
      icon: DollarSign,
      status: 'working',
      task: 'Calculating cost-effective options',
      progress: 52,
    },
  ])

  // Simulate agent progress
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          if (agent.status === 'working') {
            const newProgress = Math.min(agent.progress + Math.random() * 15, 100)
            return {
              ...agent,
              progress: newProgress,
              status: newProgress >= 100 ? 'completed' : 'working',
              task: newProgress >= 100 ? 'Task completed successfully' : agent.task,
            }
          }
          return agent
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'text-blue-500'
      case 'completed':
        return 'text-green-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
    }
  }

  return (
    <Card className="p-6 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Agents at Work</h3>
      </div>

      <div className="space-y-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-4">
                {/* Agent Icon */}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center flex-shrink-0 ${
                  agent.status === 'working' ? 'ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : ''
                }`}>
                  <Icon className={`h-5 w-5 ${getStatusColor(agent.status)}`} />
                </div>

                {/* Agent Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold">{agent.name}</h4>
                      <div className={getStatusColor(agent.status)}>
                        {getStatusIcon(agent.status)}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {agent.progress}%
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {agent.task}
                  </p>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        agent.status === 'completed'
                          ? 'bg-green-500'
                          : 'bg-gradient-to-r from-primary to-purple-600'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Animated connection line */}
              {index < agents.length - 1 && (
                <div className="ml-5 h-4 w-px bg-border/50 mt-2" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Overall Status */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-semibold">
              {Math.round(
                agents.reduce((acc, agent) => acc + agent.progress, 0) / agents.length
              )}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
