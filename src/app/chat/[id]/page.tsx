'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowLeft,
  Send,
  Loader2,
  User,
  Settings,
  Plane,
  Hotel,
  MapPin,
  Cloud,
  DollarSign,
  Clock,
  Wrench,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api, Message, streamChat, StreamEvent } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Tool icon mapping
const toolIcons: Record<string, React.ReactNode> = {
  search_flights: <Plane className="w-4 h-4" />,
  search_hotels: <Hotel className="w-4 h-4" />,
  search_activities: <MapPin className="w-4 h-4" />,
  get_weather: <Cloud className="w-4 h-4" />,
  get_currency: <DollarSign className="w-4 h-4" />,
  get_city_time: <Clock className="w-4 h-4" />,
  default: <Wrench className="w-4 h-4" />,
}

// Get tool icon by name
function getToolIcon(toolName: string): React.ReactNode {
  // Check for partial matches
  for (const [key, icon] of Object.entries(toolIcons)) {
    if (toolName.toLowerCase().includes(key.replace('_', ''))) {
      return icon
    }
  }
  return toolIcons.default
}

// Format tool name for display
function formatToolName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

interface ToolCall {
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  result?: string
}

interface ChatMessage extends Message {
  isStreaming?: boolean
  streamingContent?: string
  toolCalls?: ToolCall[]
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [currentToolCalls, setCurrentToolCalls] = useState<ToolCall[]>([])
  const [streamingContent, setStreamingContent] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent, currentToolCalls, scrollToBottom])

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await api.getMessages(conversationId)
        // Ensure we always have an array
        setMessages(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load messages:', error)
        toast.error('Failed to load conversation')
        setMessages([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [conversationId])

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || isSending) return

    const userMessage = input.trim()
    setInput('')
    setIsSending(true)
    setCurrentToolCalls([])
    setStreamingContent('')

    // Add user message immediately
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      // Start streaming
      await streamChat(
        conversationId,
        userMessage,
        (event: StreamEvent) => {
          switch (event.type) {
            case 'tool_start':
              if (event.data.name) {
                setCurrentToolCalls(prev => [
                  ...prev,
                  { name: event.data.name!, status: 'running' }
                ])
              }
              break

            case 'tool_result':
              setCurrentToolCalls(prev =>
                prev.map(tc =>
                  tc.name === event.data.name
                    ? { ...tc, status: 'completed', result: event.data.result }
                    : tc
                )
              )
              break

            case 'text_delta':
              setStreamingContent(prev => prev + (event.data.content || ''))
              break

            case 'message_complete':
              // Add the complete assistant message
              const assistantMessage: ChatMessage = {
                id: event.data.message_id || `msg-${Date.now()}`,
                conversation_id: conversationId,
                role: 'assistant',
                content: event.data.content || '',
                created_at: new Date().toISOString(),
                tool_calls: event.data.tool_calls,
              }
              setMessages(prev => [...prev, assistantMessage])
              setStreamingContent('')
              setCurrentToolCalls([])
              break

            case 'error':
              toast.error(event.data.message || 'An error occurred')
              break
          }
        }
      )
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
      // Remove the temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
    } finally {
      setIsSending(false)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl flex-shrink-0">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">AIKU</span>
            </Link>
          </div>

          <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="container mx-auto max-w-3xl space-y-6 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 && !streamingContent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Start Planning Your Trip</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tell me where you want to go, when, and what you&apos;re looking for.
                I&apos;ll help you find flights, hotels, and activities.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {[
                  'Plan a trip to Paris for 5 days',
                  'Find flights from Istanbul to London',
                  'What hotels are available in Tokyo?',
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(suggestion)
                      textareaRef.current?.focus()
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted rounded-tl-none'
                    )}
                  >
                    {/* Tool calls display */}
                    {message.tool_calls && message.tool_calls.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {message.tool_calls.map((tc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs bg-background/50 rounded-lg px-2 py-1.5"
                          >
                            {getToolIcon(tc.name)}
                            <span className="font-medium">{formatToolName(tc.name)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Streaming response */}
              {(streamingContent || currentToolCalls.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>

                  <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-muted px-4 py-3">
                    {/* Active tool calls */}
                    {currentToolCalls.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {currentToolCalls.map((tc, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'flex items-center gap-2 text-xs rounded-lg px-2 py-1.5',
                              tc.status === 'running'
                                ? 'bg-primary/10 text-primary'
                                : tc.status === 'completed'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-destructive/10 text-destructive'
                            )}
                          >
                            {tc.status === 'running' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : tc.status === 'error' ? (
                              <AlertCircle className="w-4 h-4" />
                            ) : (
                              getToolIcon(tc.name)
                            )}
                            <span className="font-medium">{formatToolName(tc.name)}</span>
                            {tc.status === 'running' && (
                              <span className="text-muted-foreground">Running...</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {streamingContent ? (
                      <p className="whitespace-pre-wrap">{streamingContent}</p>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border/40 bg-background/80 backdrop-blur-xl p-4 flex-shrink-0">
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell me about your trip plans..."
                className="min-h-[52px] max-h-[200px] resize-none pr-12"
                disabled={isSending}
                rows={1}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              size="icon"
              className="h-[52px] w-[52px]"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AIKU can search flights, hotels, activities, weather, and more.
          </p>
        </div>
      </div>
    </div>
  )
}
