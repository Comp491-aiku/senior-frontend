'use client'

import { useState, useEffect, useRef } from 'react'
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
  AlertCircle,
  ChevronDown,
  Bot,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { api, Message, streamChat, StreamEvent } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FlightCard, FlightData } from '@/components/chat/FlightCard'
import { HotelCard, HotelData } from '@/components/chat/HotelCard'
import { ActivityCard, ActivityData } from '@/components/chat/ActivityCard'

// Transform backend activity data to ActivityCard format
function transformActivity(item: Record<string, unknown>): ActivityData | null {
  if (!item || typeof item !== 'object') return null

  const pictures = item.pictures as string[] | undefined
  const price = item.price as { amount?: number; currency?: string } | undefined
  const geoCode = item.geo_code as { latitude?: number; longitude?: number } | undefined

  return {
    id: String(item.id || ''),
    name: String(item.name || 'Unknown Activity'),
    description: item.description ? String(item.description).replace(/<[^>]*>/g, '').substring(0, 200) : undefined,
    image: pictures?.[0],
    duration: item.duration ? String(item.duration) : undefined,
    location: {
      city: 'Barcelona', // Default, could extract from geo_code
      address: geoCode ? `${geoCode.latitude?.toFixed(4)}, ${geoCode.longitude?.toFixed(4)}` : undefined,
    },
    price: {
      amount: price?.amount || 0,
      currency: price?.currency || 'EUR',
    },
    category: item.type ? String(item.type) : undefined,
  }
}

// Transform backend flight data to FlightCard format
// Backend may send multiple formats:
// 1. { itineraries: [{ segments: [...] }], price: {...} } - flight-agent.vercel.app
// 2. { segments: [...], price: {...} } - fast-flights-api
// 3. Flat structure with direct departure/arrival fields
function transformFlight(item: Record<string, unknown>): FlightData | null {
  if (!item || typeof item !== 'object') return null

  // Handle nested itineraries structure (flight-agent.vercel.app format)
  const itineraries = item.itineraries as Array<Record<string, unknown>> | undefined
  const outboundItinerary = itineraries?.find(it => it.direction === 'outbound') || itineraries?.[0]

  // Get segments from itinerary or directly from item
  let segments = item.segments as Array<Record<string, unknown>> | undefined
  if (!segments && outboundItinerary) {
    segments = outboundItinerary.segments as Array<Record<string, unknown>> | undefined
  }

  const firstSegment = segments?.[0]
  const lastSegment = segments?.[segments.length - 1]

  // Get departure/arrival from segments or direct fields
  const departure = (firstSegment?.departure || item.departure) as Record<string, unknown> | undefined
  const arrival = (lastSegment?.arrival || item.arrival) as Record<string, unknown> | undefined

  // Get price - may be nested or direct
  const priceData = item.price as Record<string, unknown> | undefined
  const price = {
    amount: Number(priceData?.total || priceData?.amount || priceData?.per_person || item.total_price || 0),
    currency: String(priceData?.currency || 'EUR')
  }

  // Calculate stops from segments or use segment's stops field
  let stops = 0
  if (segments && segments.length > 1) {
    stops = segments.length - 1
  } else if (firstSegment?.stops !== undefined) {
    stops = Number(firstSegment.stops)
  } else if (item.stops !== undefined) {
    stops = Number(item.stops)
  }

  // Get airline from segment carrier or direct fields
  const carrierName = firstSegment?.carrier_name || firstSegment?.carrier
  const carrier = typeof carrierName === 'object' ? carrierName as Record<string, unknown> : null

  // Extract time from datetime string (e.g., "2026-02-15T11:05:00")
  const extractTime = (dt: unknown): string => {
    if (!dt) return ''
    const str = String(dt)
    if (str.includes('T')) {
      return str.split('T')[1]?.slice(0, 5) || ''
    }
    return str
  }

  const extractDate = (dt: unknown): string => {
    if (!dt) return ''
    const str = String(dt)
    if (str.includes('T')) {
      return str.split('T')[0] || ''
    }
    return str
  }

  // Get duration from itinerary or item
  const duration = String(outboundItinerary?.duration || item.duration || item.total_duration || firstSegment?.duration || '')

  return {
    id: String(item.id || item.flight_id || `flight-${Date.now()}`),
    airline: String(carrier?.name || carrierName || item.airline || item.validating_carrier || 'Unknown Airline'),
    airline_logo: carrier?.logo ? String(carrier.logo) : undefined,
    flight_number: String(firstSegment?.flight_number || item.flight_number || ''),
    departure: {
      airport: String(departure?.iata || departure?.airport || departure?.code || ''),
      city: String(departure?.city || departure?.name || ''),
      time: extractTime(departure?.time || departure?.at),
      date: extractDate(departure?.time || departure?.at || departure?.date),
    },
    arrival: {
      airport: String(arrival?.iata || arrival?.airport || arrival?.code || ''),
      city: String(arrival?.city || arrival?.name || ''),
      time: extractTime(arrival?.time || arrival?.at),
      date: extractDate(arrival?.time || arrival?.at || arrival?.date),
    },
    duration: duration,
    stops: stops,
    price: price,
    cabin_class: String(item.cabin_class || item.cabin || 'Economy'),
    amenities: item.amenities as string[] | undefined,
  }
}

// Transform backend hotel data to HotelCard format
// Backend sends nested structure: { hotel: {...}, offers: [...], booking_links: {...} }
function transformHotel(item: Record<string, unknown>): HotelData | null {
  if (!item || typeof item !== 'object') return null

  // Handle nested structure from backend
  const hotelData = (item.hotel as Record<string, unknown>) || item
  const offers = item.offers as Array<Record<string, unknown>> | undefined
  const firstOffer = offers?.[0]
  const offerPrice = firstOffer?.price as Record<string, unknown> | undefined
  const geoCode = hotelData.geo_code as { latitude?: number; longitude?: number } | undefined
  const address = hotelData.address as Record<string, unknown> | undefined
  const bookingLinks = item.booking_links as Record<string, string> | undefined

  // Get price from offer or direct price field
  const price = offerPrice || (item.price as Record<string, unknown> | undefined)

  return {
    id: String(hotelData.hotel_id || hotelData.id || item.id || ''),
    name: String(hotelData.name || item.name || 'Unknown Hotel'),
    image: hotelData.image ? String(hotelData.image) : undefined,
    rating: Number(hotelData.rating || hotelData.stars || item.rating || 4),
    review_score: hotelData.review_score ? Number(hotelData.review_score) : undefined,
    location: {
      address: address?.city_name ? String(address.city_name) :
               geoCode ? `${geoCode.latitude?.toFixed(4)}, ${geoCode.longitude?.toFixed(4)}` : '',
      city: String(address?.city_name || hotelData.city || 'Paris'),
      distance_to_center: hotelData.distance_to_center ? String(hotelData.distance_to_center) : undefined,
    },
    price: {
      amount: Number(price?.per_night || price?.total || price?.amount || 0),
      currency: String(price?.currency || 'EUR'),
      per_night: true,
    },
    room_type: firstOffer?.room ? String((firstOffer.room as Record<string, unknown>).type || '') : undefined,
    cancellation: offerPrice ? undefined : undefined,
  }
}

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
function getToolIcon(toolName: string | undefined): React.ReactNode {
  if (!toolName) return toolIcons.default
  // Check for partial matches
  for (const [key, icon] of Object.entries(toolIcons)) {
    if (toolName.toLowerCase().includes(key.replace('_', ''))) {
      return icon
    }
  }
  return toolIcons.default
}

// Format tool name for display
function formatToolName(name: string | undefined): string {
  if (!name) return 'Tool'
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

interface ToolCall {
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  result?: string
  rawData?: unknown
  agent?: string
}

// Travel data collected during streaming
interface TravelData {
  flights: FlightData[]
  hotels: HotelData[]
  activities: ActivityData[]
}

interface ChatMessage extends Message {
  isStreaming?: boolean
  streamingContent?: string
  toolCalls?: ToolCall[]
  travelData?: TravelData
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [currentToolCalls, setCurrentToolCalls] = useState<ToolCall[]>([])
  const [streamingContent, setStreamingContent] = useState('')
  const [currentTravelData, setCurrentTravelData] = useState<TravelData>({
    flights: [],
    hotels: [],
    activities: []
  })

  // Pagination state
  const [hasMore, setHasMore] = useState(false)
  const [totalMessages, setTotalMessages] = useState(0)
  const MESSAGES_PER_PAGE = 20

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom - simplified to prevent loops
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 100)
    return () => clearTimeout(timer)
  }, [messages.length, streamingContent])

  // Sanitize message to prevent freezing from large content
  const sanitizeMessage = (msg: Message): ChatMessage => ({
    ...msg,
    // Truncate very large content
    content: msg.content && msg.content.length > 50000
      ? msg.content.substring(0, 50000) + '\n\n[Content truncated due to size...]'
      : msg.content,
    // Don't load tool_calls from API to prevent large data issues
    tool_calls: undefined,
    toolCalls: undefined,
    travelData: undefined,
  })

  // Load initial messages with pagination
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { messages: data, total } = await api.getMessages(conversationId, MESSAGES_PER_PAGE, 0)
        const sanitizedMessages = data.map(sanitizeMessage)

        setMessages(sanitizedMessages)
        setTotalMessages(total)
        setHasMore(total > MESSAGES_PER_PAGE)
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

  // Load more messages (older messages)
  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    try {
      const offset = messages.length
      const { messages: olderMessages } = await api.getMessages(conversationId, MESSAGES_PER_PAGE, offset)
      const sanitizedOlder = olderMessages.map(sanitizeMessage)

      // Prepend older messages
      setMessages(prev => [...sanitizedOlder, ...prev])
      setHasMore(messages.length + olderMessages.length < totalMessages)
    } catch (error) {
      console.error('Failed to load more messages:', error)
      toast.error('Failed to load older messages')
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || isSending) return

    const userMessage = input.trim()
    setInput('')
    setIsSending(true)
    setCurrentToolCalls([])
    setStreamingContent('')
    setCurrentTravelData({ flights: [], hotels: [], activities: [] })

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
      let finalContent = ''
      const toolCallsUsed: ToolCall[] = []
      const travelDataCollected: TravelData = { flights: [], hotels: [], activities: [] }

      await streamChat(
        conversationId,
        userMessage,
        (event: StreamEvent) => {
          // Tool starting (has tool name but no result yet)
          if (event.tool && !event.result) {
            const existingTool = toolCallsUsed.find(tc => tc.name === event.tool)
            if (!existingTool) {
              // Detect agent from tool name (case-insensitive)
              const toolLower = event.tool.toLowerCase()
              let agent = 'Travel Agent'
              if (toolLower.includes('flight')) agent = 'Flight Agent'
              else if (toolLower.includes('hotel')) agent = 'Hotel Agent'
              else if (toolLower.includes('activit')) agent = 'Activity Agent'
              else if (toolLower.includes('weather')) agent = 'Weather Agent'
              else if (toolLower.includes('currency') || toolLower.includes('exchange')) agent = 'Currency Agent'
              else if (toolLower.includes('iata') || toolLower.includes('city')) agent = 'Travel Agent'
              else if (toolLower.includes('time') || toolLower.includes('date')) agent = 'Time Agent'

              const newTool: ToolCall = {
                name: event.tool,
                status: 'running' as const,
                agent
              }
              toolCallsUsed.push(newTool)
              setCurrentToolCalls([...toolCallsUsed])
            }
          }

          // Tool completed (has both tool name and result)
          if (event.tool && event.result) {
            const toolIndex = toolCallsUsed.findIndex(tc => tc.name === event.tool)
            if (toolIndex >= 0) {
              toolCallsUsed[toolIndex] = {
                ...toolCallsUsed[toolIndex],
                status: 'completed',
                result: typeof event.result === 'string'
                  ? event.result.substring(0, 100)
                  : JSON.stringify(event.result).substring(0, 100),
                rawData: event.result
              }
              setCurrentToolCalls([...toolCallsUsed])
            }

            // Extract travel data from tool results
            const resultData = event.result as Record<string, unknown>
            const toolNameLower = event.tool.toLowerCase()

            console.log('[TravelData] Tool completed:', event.tool, 'Keys:', Object.keys(resultData || {}))

            if (resultData && typeof resultData === 'object') {
              // Hotels from search_hotels tool
              if (toolNameLower.includes('hotel') && resultData.hotels) {
                console.log('[TravelData] Found hotels:', (resultData.hotels as unknown[]).length)
                const rawHotels = resultData.hotels as Record<string, unknown>[]
                const hotels = rawHotels
                  .map((h, i) => {
                    const transformed = transformHotel(h)
                    if (!transformed) console.log('[TravelData] Hotel transform failed for index', i, h)
                    return transformed
                  })
                  .filter((h): h is HotelData => h !== null)
                console.log('[TravelData] Transformed hotels:', hotels.length)
                if (hotels.length > 0) {
                  travelDataCollected.hotels = [...travelDataCollected.hotels, ...hotels]
                  setCurrentTravelData({ ...travelDataCollected })
                }
              }

              // Flights from search_flights tool
              if (toolNameLower.includes('flight') && (resultData.flights || resultData.outbound)) {
                const rawFlights = (resultData.flights || resultData.outbound || []) as Record<string, unknown>[]
                console.log('[TravelData] Found flights:', rawFlights.length)
                if (rawFlights.length > 0) {
                  console.log('[TravelData] First flight structure:', JSON.stringify(rawFlights[0]).substring(0, 500))
                }
                const flights = rawFlights
                  .map((f, i) => {
                    const transformed = transformFlight(f)
                    if (!transformed) console.log('[TravelData] Flight transform failed for index', i)
                    return transformed
                  })
                  .filter((f): f is FlightData => f !== null)
                console.log('[TravelData] Transformed flights:', flights.length)
                if (flights.length > 0) {
                  console.log('[TravelData] First transformed flight:', JSON.stringify(flights[0]))
                  travelDataCollected.flights = [...travelDataCollected.flights, ...flights]
                  setCurrentTravelData({ ...travelDataCollected })
                }
              }

              // Activities from search_activities tool
              if (toolNameLower.includes('activit') && resultData.activities) {
                const rawActivities = resultData.activities as Record<string, unknown>[]
                console.log('[TravelData] Found activities:', rawActivities.length)
                const activities = rawActivities
                  .map(transformActivity)
                  .filter((a): a is ActivityData => a !== null)
                console.log('[TravelData] Transformed activities:', activities.length)
                if (activities.length > 0) {
                  travelDataCollected.activities = [...travelDataCollected.activities, ...activities]
                  setCurrentTravelData({ ...travelDataCollected })
                }
              }
            }
          }

          // Handle travel data events (flights, hotels, activities)
          // Transform backend format to card component format
          if (event.type === 'flights' && event.items) {
            const rawItems = event.items as Record<string, unknown>[]
            const flights = rawItems
              .map(transformFlight)
              .filter((f): f is FlightData => f !== null)
            if (flights.length > 0) {
              travelDataCollected.flights = [...travelDataCollected.flights, ...flights]
              setCurrentTravelData({ ...travelDataCollected })
            }
          }

          if (event.type === 'hotels' && event.items) {
            const rawItems = event.items as Record<string, unknown>[]
            const hotels = rawItems
              .map(transformHotel)
              .filter((h): h is HotelData => h !== null)
            if (hotels.length > 0) {
              travelDataCollected.hotels = [...travelDataCollected.hotels, ...hotels]
              setCurrentTravelData({ ...travelDataCollected })
            }
          }

          if (event.type === 'activities' && event.items) {
            const rawItems = event.items as Record<string, unknown>[]
            const activities = rawItems
              .map(transformActivity)
              .filter((a): a is ActivityData => a !== null)
            if (activities.length > 0) {
              travelDataCollected.activities = [...travelDataCollected.activities, ...activities]
              setCurrentTravelData({ ...travelDataCollected })
            }
          }

          // Final content
          if (event.content) {
            finalContent = event.content
            setStreamingContent(event.content)
          }

          // Stream complete
          if (event.message === 'Done' && finalContent) {
            const assistantMessage: ChatMessage = {
              id: `msg-${Date.now()}`,
              conversation_id: conversationId,
              role: 'assistant',
              content: finalContent,
              created_at: new Date().toISOString(),
              toolCalls: toolCallsUsed,
              travelData: travelDataCollected,
            }
            setMessages(prev => [...prev, assistantMessage])
            setStreamingContent('')
            setCurrentToolCalls([])
            setCurrentTravelData({ flights: [], hotels: [], activities: [] })
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
      <ScrollArea className="flex-1 p-4">
        <div className="container mx-auto max-w-5xl space-y-6 pb-4">
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
              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadMoreMessages}
                    disabled={isLoadingMore}
                    className="gap-2"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>Load older messages ({totalMessages - messages.length} more)</>
                    )}
                  </Button>
                </div>
              )}
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
                      'max-w-[95%] rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted rounded-tl-none'
                    )}
                  >
                    {/* Tool calls display with collapsible raw data */}
                    {message.toolCalls && message.toolCalls.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {message.toolCalls.map((tc, idx) => (
                          <Collapsible key={idx}>
                            <div className="flex items-center gap-2 text-xs bg-background/50 rounded-lg px-3 py-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              {getToolIcon(tc.name)}
                              <div className="flex-1">
                                <span className="font-medium">{formatToolName(tc.name)}</span>
                                {tc.agent && (
                                  <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4">
                                    <Bot className="w-2.5 h-2.5 mr-1" />
                                    {tc.agent}
                                  </Badge>
                                )}
                              </div>
                              {tc.rawData !== undefined && (
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    <ChevronDown className="w-3 h-3 mr-1" />
                                    Raw Data
                                  </Button>
                                </CollapsibleTrigger>
                              )}
                            </div>
                            {tc.rawData !== undefined && (
                              <CollapsibleContent>
                                <div className="mt-1 p-2 bg-background/80 rounded text-xs font-mono overflow-x-auto max-h-40 overflow-y-auto">
                                  <pre>{(() => {
                                    const jsonStr = JSON.stringify(tc.rawData, null, 2)
                                    // Limit display to prevent performance issues
                                    return jsonStr.length > 5000
                                      ? jsonStr.substring(0, 5000) + '\n... (truncated)'
                                      : jsonStr
                                  })()}</pre>
                                </div>
                              </CollapsibleContent>
                            )}
                          </Collapsible>
                        ))}
                      </div>
                    )}

                    {/* Travel data cards */}
                    {message.travelData && (
                      <>
                        {/* Flights: 1 per row, 3 visible, scrollable */}
                        {message.travelData.flights.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Plane className="w-4 h-4" />
                              Flights Found ({message.travelData.flights.length})
                            </h4>
                            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                              {message.travelData.flights.map((flight, idx) => (
                                <FlightCard key={flight.id || idx} flight={flight} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Hotels: 2x2 grid, scrollable */}
                        {message.travelData.hotels.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Hotel className="w-4 h-4" />
                              Hotels Found ({message.travelData.hotels.length})
                            </h4>
                            <div className="max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
                              <div className="grid grid-cols-2 gap-2">
                                {message.travelData.hotels.map((hotel, idx) => (
                                  <HotelCard key={hotel.id || idx} hotel={hotel} />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Activities: 3x2 grid, scrollable */}
                        {message.travelData.activities.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Activities Found ({message.travelData.activities.length})
                            </h4>
                            <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                              <div className="grid grid-cols-3 gap-2">
                                {message.travelData.activities.map((activity, idx) => (
                                  <ActivityCard key={activity.id || idx} activity={activity} />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {message.content && (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Streaming response */}
              {(streamingContent || currentToolCalls.length > 0 || currentTravelData.flights.length > 0 || currentTravelData.hotels.length > 0 || currentTravelData.activities.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>

                  <div className="max-w-[95%] rounded-2xl rounded-tl-none bg-muted px-4 py-3">
                    {/* Active tool calls with agent info */}
                    {currentToolCalls.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {currentToolCalls.map((tc, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'flex items-center gap-2 text-xs rounded-lg px-3 py-2',
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
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                            {getToolIcon(tc.name)}
                            <div className="flex-1">
                              <span className="font-medium">{formatToolName(tc.name)}</span>
                              {tc.agent && (
                                <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4 border-current">
                                  <Bot className="w-2.5 h-2.5 mr-1" />
                                  {tc.agent}
                                </Badge>
                              )}
                            </div>
                            {tc.status === 'running' && (
                              <span className="text-muted-foreground">Searching...</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Live travel data cards */}
                    {currentTravelData.flights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Plane className="w-4 h-4" />
                          Flights Found ({currentTravelData.flights.length})
                        </h4>
                        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                          {currentTravelData.flights.map((flight, idx) => (
                            <FlightCard key={flight.id || idx} flight={flight} />
                          ))}
                        </div>
                      </div>
                    )}

                    {currentTravelData.hotels.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Hotel className="w-4 h-4" />
                          Hotels Found ({currentTravelData.hotels.length})
                        </h4>
                        <div className="max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
                          <div className="grid grid-cols-2 gap-2">
                            {currentTravelData.hotels.map((hotel, idx) => (
                              <HotelCard key={hotel.id || idx} hotel={hotel} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentTravelData.activities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Activities Found ({currentTravelData.activities.length})
                        </h4>
                        <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                          <div className="grid grid-cols-3 gap-2">
                            {currentTravelData.activities.map((activity, idx) => (
                              <ActivityCard key={activity.id || idx} activity={activity} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {streamingContent ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {streamingContent}
                        </ReactMarkdown>
                      </div>
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
          {/* Scroll anchor */}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border/40 bg-background/80 backdrop-blur-xl p-4 flex-shrink-0">
        <div className="container mx-auto max-w-5xl">
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
