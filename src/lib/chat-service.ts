/**
 * Chat service for conversational trip planning
 */

import { authService } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface AgentActivity {
  agent: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  message: string
  progress?: number
  data?: any
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  planning_mode?: string
  agent_activity?: AgentActivity[]
  created_at: string
}

export interface SendMessageRequest {
  message: string
  planning_mode: 'plan' | 'auto-pay' | 'edit'
  trip_id?: string
  voice_input?: boolean
}

export interface SendMessageResponse {
  message_id: string
  role: string
  content: string
  agent_activity: AgentActivity[]
  trip_id?: string
  created_at: string
}

class ChatService {
  /**
   * Send a chat message
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to send message')
    }

    return await response.json()
  }

  /**
   * Get chat history
   */
  async getChatHistory(tripId?: string, limit = 50, offset = 0): Promise<{ messages: ChatMessage[], total: number }> {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    if (tripId) {
      params.append('trip_id', tripId)
    }

    const response = await fetch(`${API_URL}/api/chat/history?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get chat history')
    }

    return await response.json()
  }

  /**
   * Stream agent activity using SSE
   */
  streamAgentActivity(
    message: string,
    planningMode: string,
    tripId?: string,
    onActivity?: (activity: AgentActivity) => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): EventSource {
    const token = authService.getToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const params = new URLSearchParams({
      message,
      planning_mode: planningMode,
    })

    if (tripId) {
      params.append('trip_id', tripId)
    }

    // Note: EventSource doesn't support custom headers, so we need to pass token in query
    // In production, consider using WebSocket for better security
    const eventSource = new EventSource(
      `${API_URL}/api/stream/agent-activity?${params}`,
      // Note: EventSource doesn't support authorization header
      // For production, implement WebSocket with proper auth or use a different approach
    )

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.status === 'completed') {
          onComplete?.()
          eventSource.close()
        } else if (data.status === 'error') {
          onError?.(new Error(data.message))
          eventSource.close()
        } else {
          onActivity?.(data)
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      onError?.(new Error('Connection error'))
      eventSource.close()
    }

    return eventSource
  }
}

export const chatService = new ChatService()
