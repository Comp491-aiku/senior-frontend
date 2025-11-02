'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { chatService } from '@/lib/chat-service'
import { VoiceInputModal } from '@/components/VoiceInputModal'
import { AlternativeFinderModal } from '@/components/AlternativeFinderModal'
import { ShareTripModal } from '@/components/ShareTripModal'
import { CommentsPanel } from '@/components/CommentsPanel'
import { VotingPanel } from '@/components/VotingPanel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert } from '@/components/ui/alert'
import {
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  Loader2,
  User,
  Zap,
  Plane,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  Settings,
  Hotel,
  CloudRain,
  Share2,
  Search,
  ThumbsUp,
  RefreshCw,
} from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  agentActivity?: AgentActivity[]
  suggestions?: string[]
}

type AgentActivity = {
  agent: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  message: string
  icon: typeof Plane
}

type PlanningMode = 'plan' | 'auto-pay' | 'edit'

export default function TripPlanPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, user } = useAuth()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI travel assistant. Tell me about your dream trip - where do you want to go, when, and what's your budget? You can type or use voice input! 🎤",
      timestamp: new Date(),
      suggestions: [
        'Plan a trip to Paris for 5 days',
        'Find cheap flights to Tokyo',
        'Show me luxury hotels in Dubai',
      ],
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<PlanningMode>('plan')
  const [showAgentActivity, setShowAgentActivity] = useState(false)
  const [currentAgentActivity, setCurrentAgentActivity] = useState<AgentActivity[]>([])
  const [tripId, setTripId] = useState<string | undefined>()
  const [error, setError] = useState<string>('')

  // Modals
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [alternativeModalOpen, setAlternativeModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageText = input
    setInput('')
    setIsLoading(true)
    setShowAgentActivity(true)
    setError('')
    setCurrentAgentActivity([])

    try {
      const response = await chatService.sendMessage({
        message: messageText,
        planning_mode: mode,
        trip_id: tripId,
      })

      if (response.trip_id) {
        setTripId(response.trip_id)
      }

      const agentActivity: AgentActivity[] = response.agent_activity.map((activity) => ({
        agent: activity.agent,
        status: activity.status,
        message: activity.message,
        icon: getAgentIcon(activity.agent),
      }))

      const aiMessage: Message = {
        id: response.message_id,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(response.created_at),
        agentActivity,
        suggestions: ['Find alternatives', 'Share trip', 'Add to favorites'],
      }

      setMessages((prev) => [...prev, aiMessage])
      setCurrentAgentActivity(agentActivity)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      console.error('Error sending message:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getAgentIcon = (agentName: string) => {
    const name = agentName.toLowerCase()
    if (name.includes('flight')) return Plane
    if (name.includes('hotel') || name.includes('accommodation')) return Hotel
    if (name.includes('activity')) return Calendar
    if (name.includes('weather')) return CloudRain
    if (name.includes('orchestrator')) return Zap
    return Settings
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
    inputRef.current?.focus()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col py-4">
      {/* Header with Mode Selector */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Trip Planner
          </h1>
          <p className="text-sm text-muted-foreground">
            Chat with AI to plan your perfect trip
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tripId && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareModalOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCollaboration(!showCollaboration)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {showCollaboration ? 'Hide' : 'Show'} Collaboration
              </Button>
            </>
          )}

          <Tabs value={mode} onValueChange={(v) => setMode(v as PlanningMode)}>
            <TabsList>
              <TabsTrigger value="plan" className="gap-2">
                <Settings className="h-4 w-4" />
                Plan
              </TabsTrigger>
              <TabsTrigger value="auto-pay" className="gap-2">
                <Zap className="h-4 w-4" />
                Auto-Pay
              </TabsTrigger>
              <TabsTrigger value="edit" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Edit
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Mode Description */}
      <Card className="mb-4 p-3 bg-muted/50">
        <div className="flex items-center gap-2 text-sm">
          {mode === 'plan' && (
            <>
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>
                <strong>Plan Mode:</strong> Get recommendations, edit freely, no commitments. Share
                with friends!
              </span>
            </>
          )}
          {mode === 'auto-pay' && (
            <>
              <Zap className="h-4 w-4 text-primary" />
              <span>
                <strong>Auto-Pay Mode:</strong> AI will automatically book everything for you.
                Fastest way to travel!
              </span>
            </>
          )}
          {mode === 'edit' && (
            <>
              <Settings className="h-4 w-4 text-primary" />
              <span>
                <strong>Edit Mode:</strong> Modify existing plans, find alternatives, replace items.
              </span>
            </>
          )}
        </div>
      </Card>

      <div className="flex-1 grid lg:grid-cols-3 gap-4 min-h-0">
        {/* Chat Area */}
        <Card className={`${showCollaboration ? 'lg:col-span-2' : 'lg:col-span-2'} flex flex-col`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'bg-primary/10' : 'bg-primary'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 text-primary" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 max-w-[80%]">
                    <div
                      className={`rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Suggestions */}
                {message.suggestions && message.role === 'assistant' && (
                  <div className="flex flex-wrap gap-2 ml-14">
                    {message.suggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          suggestion.includes('alternative')
                            ? setAlternativeModalOpen(true)
                            : suggestion.includes('Share')
                            ? setShareModalOpen(true)
                            : handleSuggestionClick(suggestion)
                        }
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-primary-foreground animate-spin" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-none p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or click the mic to speak..."
                  className="w-full resize-none rounded-2xl border bg-muted/50 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 bottom-2"
                  onClick={() => setVoiceModalOpen(true)}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="rounded-full h-12 w-12"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-4 overflow-y-auto">
          {/* Agent Activity */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Agent Activity
            </h3>

            {showAgentActivity && currentAgentActivity.length > 0 ? (
              <div className="space-y-4">
                {currentAgentActivity.map((activity, idx) => {
                  const Icon = activity.icon
                  return (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.status === 'completed'
                            ? 'bg-green-500/10'
                            : activity.status === 'running'
                            ? 'bg-primary/10'
                            : activity.status === 'failed'
                            ? 'bg-red-500/10'
                            : 'bg-muted'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            activity.status === 'completed'
                              ? 'text-green-500'
                              : activity.status === 'running'
                              ? 'text-primary'
                              : activity.status === 'failed'
                              ? 'text-red-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.agent}</p>
                        <p className="text-xs text-muted-foreground">{activity.message}</p>
                        {activity.status === 'running' && (
                          <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                            <div className="bg-primary h-1.5 rounded-full animate-pulse w-2/3" />
                          </div>
                        )}
                        {activity.status === 'completed' && (
                          <div className="flex items-center gap-1 mt-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-500">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Agent activity will appear here</p>
                <p className="text-xs">when you start planning</p>
              </div>
            )}
          </Card>

          {/* Collaboration Panel (when enabled) */}
          {showCollaboration && tripId && (
            <>
              <CommentsPanel tripId={tripId} />
              <VotingPanel
                tripId={tripId}
                itemType="flight"
                options={[]}
                onVote={(optionId, vote) => console.log('Vote:', optionId, vote)}
              />
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <VoiceInputModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onTranscriptComplete={handleVoiceTranscript}
      />

      <AlternativeFinderModal
        isOpen={alternativeModalOpen}
        onClose={() => setAlternativeModalOpen(false)}
        itemType="flight"
        onSelectAlternative={(alt) => {
          console.log('Selected alternative:', alt)
          setAlternativeModalOpen(false)
        }}
      />

      {tripId && (
        <ShareTripModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          tripId={tripId}
          tripName="My Trip"
        />
      )}
    </div>
  )
}
