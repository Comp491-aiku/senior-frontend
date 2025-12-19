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
import { AgentActivityVisualization } from '@/components/AgentActivityVisualization'
import { AgentStageView } from '@/components/AgentStageView'
import { AnimatedTravelChat } from '@/components/AnimatedTravelChat'
import { TravelAgentTaskPanel } from '@/components/TravelAgentTaskPanel'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { AgentActivity } from '@/types'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  Loader2,
  User,
  Zap,
  Clock,
  Share2,
  Layers,
} from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  agentActivity?: AgentActivity[]
  suggestions?: string[]
}

type ViewMode = 'stages' | 'timeline'

export default function TripPlanPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()

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
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
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
    // Add small delay to ensure DOM has updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
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
        planning_mode: 'plan',
        trip_id: tripId,
      })

      if (response.trip_id) {
        setTripId(response.trip_id)
      }

      // Parse agent activities from backend response
      const agentActivity: AgentActivity[] = (response.agent_activity || []).map((activity: any) => ({
        agent: activity.agent,
        status: activity.status,
        message: activity.message,
        progress: activity.progress || 0,
        data: activity.data,
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
    <div className="container mx-auto h-[calc(100vh-4rem)] flex flex-col py-8">
      {/* Hero Section with Animated Chat */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-pink-600"
            >
              Plan Your Dream Trip
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              Let AI agents handle everything - from flights to activities
            </motion.p>
          </div>

          <AnimatedTravelChat onSendMessage={async (message) => {
            const userMessage: Message = {
              id: Date.now().toString(),
              role: 'user',
              content: message,
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, userMessage])
            setIsLoading(true)
            setShowAgentActivity(true)
            setError('')
            setCurrentAgentActivity([])

            try {
              const response = await chatService.sendMessage({
                message: message,
                planning_mode: 'plan',
                trip_id: tripId,
              })

              if (response.trip_id) {
                setTripId(response.trip_id)
              }

              const agentActivity: AgentActivity[] = (response.agent_activity || []).map((activity: any) => ({
                agent: activity.agent,
                status: activity.status,
                message: activity.message,
                progress: activity.progress || 0,
                data: activity.data,
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
          }} />
        </motion.div>
      )}

      {/* Header with Mode Selector (shown after first message) */}
      {messages.length > 1 && (
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

          </div>
        </div>
      )}

      {/* Error Alert */}
      {messages.length > 1 && error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <div className={`flex-1 ${messages.length > 1 ? 'grid lg:grid-cols-3 gap-4' : ''} min-h-0`}>
        {/* Chat Area - Only show after first message */}
        {messages.length > 1 && (
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
        )}

        {/* Right Sidebar - Only show after first message */}
        {messages.length > 1 && (
        <div className="space-y-4 overflow-y-auto">
          {/* New Agent Activity Panel with Task Hierarchy */}
          {(showAgentActivity || isLoading) && messages.length > 1 && <TravelAgentTaskPanel />}

          {/* Legacy Agent Activity (optional fallback) */}
          {!showAgentActivity && !isLoading && currentAgentActivity.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Agent Activity
                </h3>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'timeline' ? 'stages' : 'timeline')}
                  className="text-xs"
                >
                  <Layers className="h-4 w-4 mr-1" />
                  {viewMode === 'timeline' ? 'Stages' : 'Timeline'}
                </Button>
              </div>

              <div className="space-y-4">
                {viewMode === 'stages' ? (
                  <AgentStageView activities={currentAgentActivity} />
                ) : (
                  <AgentActivityVisualization
                    activities={currentAgentActivity}
                    showDetails={true}
                  />
                )}
              </div>
            </Card>
          )}

          {/* Empty state when no activity */}
          {!showAgentActivity && !isLoading && currentAgentActivity.length === 0 && (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Agent activity will appear here</p>
                <p className="text-xs">when you start planning</p>
              </div>
            </Card>
          )}

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
        )}
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
