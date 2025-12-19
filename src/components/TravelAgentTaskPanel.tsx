'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  CircleDotDashed,
  XCircle,
  Plane,
  Hotel,
  MapPin,
  Cloud,
  DollarSign,
  Brain,
} from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Subtask {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'pending' | 'need-help' | 'failed'
  tools?: string[]
}

interface Task {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'pending' | 'need-help' | 'failed'
  icon: any
  subtasks: Subtask[]
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Trip Orchestrator',
    description: 'Coordinating all travel planning agents',
    status: 'in-progress',
    icon: Brain,
    subtasks: [
      {
        id: '1.1',
        title: 'Analyze user requirements',
        description: 'Understanding destination, dates, budget, and preferences',
        status: 'completed',
        tools: ['nlp-analyzer', 'preference-extractor'],
      },
      {
        id: '1.2',
        title: 'Create travel plan structure',
        description: 'Building the framework for the complete itinerary',
        status: 'in-progress',
        tools: ['itinerary-builder', 'timeline-generator'],
      },
      {
        id: '1.3',
        title: 'Coordinate sub-agents',
        description: 'Delegating tasks to specialized travel agents',
        status: 'pending',
        tools: ['agent-orchestrator'],
      },
    ],
  },
  {
    id: '2',
    title: 'Flight Search Agent',
    description: 'Finding the best flight options',
    status: 'in-progress',
    icon: Plane,
    subtasks: [
      {
        id: '2.1',
        title: 'Search available flights',
        description: 'Querying multiple airlines and booking platforms',
        status: 'in-progress',
        tools: ['amadeus-api', 'skyscanner-api', 'google-flights'],
      },
      {
        id: '2.2',
        title: 'Compare prices and routes',
        description: 'Analyzing different options for best value',
        status: 'pending',
        tools: ['price-comparator', 'route-optimizer'],
      },
      {
        id: '2.3',
        title: 'Check seat availability',
        description: 'Verifying seat options and preferences',
        status: 'pending',
        tools: ['seat-checker'],
      },
    ],
  },
  {
    id: '3',
    title: 'Hotel Search Agent',
    description: 'Finding accommodation options',
    status: 'in-progress',
    icon: Hotel,
    subtasks: [
      {
        id: '3.1',
        title: 'Search hotels in area',
        description: 'Finding hotels near desired location',
        status: 'in-progress',
        tools: ['booking-api', 'hotels-api', 'airbnb-api'],
      },
      {
        id: '3.2',
        title: 'Filter by amenities',
        description: 'Matching hotels with user preferences',
        status: 'pending',
        tools: ['amenity-filter', 'review-analyzer'],
      },
    ],
  },
  {
    id: '4',
    title: 'Activity Planner',
    description: 'Planning activities and attractions',
    status: 'pending',
    icon: MapPin,
    subtasks: [
      {
        id: '4.1',
        title: 'Find popular attractions',
        description: 'Discovering must-see places and activities',
        status: 'pending',
        tools: ['attractions-api', 'tripadvisor-api'],
      },
      {
        id: '4.2',
        title: 'Create daily itinerary',
        description: 'Organizing activities by day and location',
        status: 'pending',
        tools: ['route-planner', 'schedule-optimizer'],
      },
    ],
  },
  {
    id: '5',
    title: 'Weather Analyst',
    description: 'Checking weather conditions',
    status: 'completed',
    icon: Cloud,
    subtasks: [
      {
        id: '5.1',
        title: 'Get weather forecast',
        description: 'Retrieving weather data for travel dates',
        status: 'completed',
        tools: ['weather-api'],
      },
      {
        id: '5.2',
        title: 'Provide packing suggestions',
        description: 'Recommending what to pack based on weather',
        status: 'completed',
        tools: ['packing-advisor'],
      },
    ],
  },
  {
    id: '6',
    title: 'Budget Optimizer',
    description: 'Optimizing trip costs',
    status: 'in-progress',
    icon: DollarSign,
    subtasks: [
      {
        id: '6.1',
        title: 'Calculate total costs',
        description: 'Estimating overall trip expenses',
        status: 'in-progress',
        tools: ['cost-calculator', 'currency-converter'],
      },
      {
        id: '6.2',
        title: 'Find cost-saving options',
        description: 'Identifying ways to reduce expenses',
        status: 'pending',
        tools: ['deal-finder', 'discount-aggregator'],
      },
    ],
  },
]

export function TravelAgentTaskPanel() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [expandedTasks, setExpandedTasks] = useState<string[]>(['1', '2', '3'])
  const [expandedSubtasks, setExpandedSubtasks] = useState<{ [key: string]: boolean }>({})

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Simulate agent progress
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.status === 'in-progress') {
            const updatedSubtasks = task.subtasks.map((subtask) => {
              if (subtask.status === 'in-progress' && Math.random() > 0.7) {
                return { ...subtask, status: 'completed' as const }
              }
              if (subtask.status === 'pending' && Math.random() > 0.8) {
                return { ...subtask, status: 'in-progress' as const }
              }
              return subtask
            })

            const allCompleted = updatedSubtasks.every((s) => s.status === 'completed')
            return {
              ...task,
              subtasks: updatedSubtasks,
              status: allCompleted ? ('completed' as const) : task.status,
            }
          }
          if (task.status === 'pending' && Math.random() > 0.9) {
            return { ...task, status: 'in-progress' as const }
          }
          return task
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
  }

  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`
    setExpandedSubtasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <CircleDotDashed className="h-4 w-4 text-blue-500" />
      case 'need-help':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const taskVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: prefersReducedMotion ? 'tween' as const : 'spring' as const,
        stiffness: 500,
        damping: 30,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
  }

  const subtaskListVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' as const },
    visible: {
      height: 'auto' as const,
      opacity: 1,
      overflow: 'visible' as const,
      transition: {
        duration: 0.25,
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        when: 'beforeChildren' as const,
        ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number],
      },
    },
  }

  const subtaskVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: prefersReducedMotion ? 'tween' as const : 'spring' as const,
        stiffness: 500,
        damping: 25,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
  }

  const subtaskDetailsVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' as const },
    visible: {
      opacity: 1,
      height: 'auto' as const,
      overflow: 'visible' as const,
      transition: { duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number] },
    },
  }

  return (
    <Card className="p-4 bg-background/80 backdrop-blur-xl">
      <LayoutGroup>
        <div className="overflow-hidden">
          <ul className="space-y-1 overflow-hidden">
            {tasks.map((task) => {
              const isExpanded = expandedTasks.includes(task.id)
              const Icon = task.icon

              return (
                <motion.li
                  key={task.id}
                  className="pt-2"
                  initial="hidden"
                  animate="visible"
                  variants={taskVariants}
                >
                  <motion.div
                    className="group flex items-center px-3 py-2 rounded-md cursor-pointer"
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                    onClick={() => toggleTaskExpansion(task.id)}
                  >
                    <motion.div className="mr-3 flex-shrink-0" whileTap={{ scale: 0.9 }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={task.status}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getStatusIcon(task.status)}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>

                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center mr-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{task.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {task.description}
                      </div>
                    </div>

                    <motion.span
                      className={`ml-2 rounded px-2 py-1 text-xs ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : task.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-muted text-muted-foreground'
                      }`}
                      key={task.status}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 0.35 }}
                    >
                      {task.status}
                    </motion.span>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {isExpanded && task.subtasks.length > 0 && (
                      <motion.div
                        className="relative overflow-hidden"
                        variants={subtaskListVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <div className="absolute top-0 bottom-0 left-[28px] border-l-2 border-dashed border-muted-foreground/30" />
                        <ul className="mt-1 ml-6 space-y-0.5">
                          {task.subtasks.map((subtask) => {
                            const subtaskKey = `${task.id}-${subtask.id}`
                            const isSubtaskExpanded = expandedSubtasks[subtaskKey]

                            return (
                              <motion.li
                                key={subtask.id}
                                className="group flex flex-col py-1 pl-8"
                                variants={subtaskVariants}
                              >
                                <motion.div
                                  className="flex items-center rounded-md p-1 cursor-pointer"
                                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                                  onClick={() => toggleSubtaskExpansion(task.id, subtask.id)}
                                >
                                  <motion.div className="mr-2 flex-shrink-0" whileTap={{ scale: 0.9 }}>
                                    <AnimatePresence mode="wait">
                                      <motion.div
                                        key={subtask.status}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        {getStatusIcon(subtask.status)}
                                      </motion.div>
                                    </AnimatePresence>
                                  </motion.div>

                                  <span
                                    className={`text-sm flex-1 ${subtask.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}
                                  >
                                    {subtask.title}
                                  </span>
                                </motion.div>

                                <AnimatePresence mode="wait">
                                  {isSubtaskExpanded && (
                                    <motion.div
                                      className="text-muted-foreground border-foreground/20 mt-1 ml-7 border-l border-dashed pl-4 text-xs overflow-hidden"
                                      variants={subtaskDetailsVariants}
                                      initial="hidden"
                                      animate="visible"
                                      exit="hidden"
                                    >
                                      <p className="py-1">{subtask.description}</p>
                                      {subtask.tools && subtask.tools.length > 0 && (
                                        <div className="mt-1 mb-1 flex flex-wrap items-center gap-1.5">
                                          <span className="text-muted-foreground font-medium">
                                            Tools:
                                          </span>
                                          <div className="flex flex-wrap gap-1">
                                            {subtask.tools.map((tool, idx) => (
                                              <motion.span
                                                key={idx}
                                                className="bg-secondary/40 text-secondary-foreground rounded px-1.5 py-0.5 text-[10px] font-medium"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                whileHover={{ y: -1 }}
                                              >
                                                {tool}
                                              </motion.span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.li>
                            )
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </LayoutGroup>
    </Card>
  )
}
