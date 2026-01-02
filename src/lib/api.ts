import { getSupabase } from './supabase'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aiku-backend-899018378108.europe-west1.run.app'

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  if (!skipAuth) {
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.detail || error.message || 'Request failed')
  }

  return response.json()
}

// API Types
export interface Conversation {
  id: string
  user_id: string
  title: string
  summary?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
  tool_calls?: ToolCallInfo[]
  tool_call_id?: string
  created_at: string
}

export interface ToolCallInfo {
  id?: string
  name: string
  arguments?: Record<string, unknown>
  result?: string
}

export interface ChatRequest {
  message: string
  conversation_id?: string
}

export interface ChatResponse {
  conversation_id: string
  message: string
  created_at: string
}

// Stream event types - matches actual backend format
export interface StreamEvent {
  // Status messages
  message?: string
  // Progress tracking
  current?: number
  max?: number
  // Tool events
  tool?: string
  parameters?: Record<string, unknown>
  result?: unknown
  // Data events (flights, hotels, etc.)
  type?: string
  count?: number
  items?: unknown[]
  // Final content
  content?: string
}

// API response types
interface ConversationsResponse {
  conversations: Conversation[]
  total?: number
}

interface MessagesResponse {
  messages: Message[]
  total?: number
}

// API Functions
export const api = {
  // Health
  health: () => apiFetch<{ status: string }>('/health', { skipAuth: true }),

  // Conversations
  getConversations: async (limit = 50, offset = 0): Promise<Conversation[]> => {
    const response = await apiFetch<Conversation[] | ConversationsResponse>(
      `/api/v1/conversations?limit=${limit}&offset=${offset}`
    )
    // Handle both array and object responses
    if (Array.isArray(response)) {
      return response
    }
    return response.conversations || []
  },

  getConversation: (id: string) =>
    apiFetch<Conversation>(`/api/v1/conversations/${id}`),

  createConversation: (title?: string) =>
    apiFetch<Conversation>('/api/v1/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  updateConversation: (id: string, title: string) =>
    apiFetch<Conversation>(`/api/v1/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
    }),

  deleteConversation: (id: string) =>
    apiFetch<void>(`/api/v1/conversations/${id}`, { method: 'DELETE' }),

  // Messages - with pagination support
  getMessages: async (conversationId: string, limit = 20, offset = 0): Promise<{ messages: Message[], total: number }> => {
    const response = await apiFetch<Message[] | MessagesResponse>(
      `/api/v1/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`
    )
    // Handle both array and object responses
    if (Array.isArray(response)) {
      return { messages: response, total: response.length }
    }
    return { messages: response.messages || [], total: response.total || 0 }
  },

  // Get all messages (for backwards compatibility)
  getAllMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await apiFetch<Message[] | MessagesResponse>(
      `/api/v1/conversations/${conversationId}/messages`
    )
    if (Array.isArray(response)) {
      return response
    }
    return response.messages || []
  },

  // Chat
  sendMessage: (data: ChatRequest) =>
    apiFetch<ChatResponse>('/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Streaming chat function
export async function streamChat(
  conversationId: string,
  message: string,
  onEvent: (event: StreamEvent) => void,
  onError?: (error: Error) => void
): Promise<void> {
  const supabase = getSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  console.log('[StreamChat] Starting stream request to:', `${API_URL}/api/v1/chat/stream`)

  const response = await fetch(`${API_URL}/api/v1/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  })

  console.log('[StreamChat] Response status:', response.status, response.statusText)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Stream failed' }))
    console.error('[StreamChat] Error response:', error)
    throw new Error(error.detail || error.message || 'Stream failed')
  }

  const reader = response.body?.getReader()
  if (!reader) {
    console.error('[StreamChat] No response body')
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        console.log('[StreamChat] Stream completed')
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const jsonStr = line.slice(5).trim()
            if (jsonStr) {
              console.log('[StreamChat] Event received:', jsonStr.substring(0, 100))
              const eventData = JSON.parse(jsonStr)
              onEvent(eventData as StreamEvent)
            }
          } catch (e) {
            console.warn('[StreamChat] Failed to parse:', line.substring(0, 50))
          }
        }
      }
    }

    // Process remaining buffer
    if (buffer.startsWith('data:')) {
      try {
        const jsonStr = buffer.slice(5).trim()
        if (jsonStr) {
          console.log('[StreamChat] Final buffer event:', jsonStr.substring(0, 100))
          const eventData = JSON.parse(jsonStr)
          onEvent(eventData as StreamEvent)
        }
      } catch {
        // Skip invalid JSON
      }
    }
  } catch (error) {
    console.error('[StreamChat] Stream error:', error)
    onError?.(error as Error)
  }
}
