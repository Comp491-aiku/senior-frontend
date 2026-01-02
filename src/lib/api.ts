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

// Stream event types
export interface StreamEvent {
  type: 'tool_start' | 'tool_result' | 'text_delta' | 'message_complete' | 'error' | 'stream_start' | 'stream_end'
  data: {
    name?: string
    result?: string
    content?: string
    message_id?: string
    tool_calls?: ToolCallInfo[]
    message?: string
    conversation_id?: string
  }
}

// API Functions
export const api = {
  // Health
  health: () => apiFetch<{ status: string }>('/health', { skipAuth: true }),

  // Conversations
  getConversations: (limit = 50, offset = 0) =>
    apiFetch<Conversation[]>(`/api/v1/conversations?limit=${limit}&offset=${offset}`),

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

  // Messages
  getMessages: (conversationId: string) =>
    apiFetch<Message[]>(`/api/v1/conversations/${conversationId}/messages`),

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

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Stream failed' }))
    throw new Error(error.detail || error.message || 'Stream failed')
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const eventData = JSON.parse(line.slice(5).trim())
            onEvent(eventData as StreamEvent)
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    // Process remaining buffer
    if (buffer.startsWith('data:')) {
      try {
        const eventData = JSON.parse(buffer.slice(5).trim())
        onEvent(eventData as StreamEvent)
      } catch {
        // Skip invalid JSON
      }
    }
  } catch (error) {
    onError?.(error as Error)
  }
}
