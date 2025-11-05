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

    // Demo mode: return mock response
    if (authService.isDemoMode()) {
      return this.getMockResponse(request)
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
   * Get mock response for demo mode
   */
  private getMockResponse(request: SendMessageRequest): Promise<SendMessageResponse> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const message = request.message.toLowerCase()
        let responseContent = ''
        const agentActivity: AgentActivity[] = []

        // Parse user intent and generate appropriate response
        if (message.includes('paris') || message.includes('fransa')) {
          responseContent = `Harika! Paris'e 3 günlük bir tatil planlıyorum. İşte size özel hazırladığım öneri:

**Uçuş Seçenekleri:**
- Turkish Airlines: İstanbul → Paris CDG
- Tarih: 21 Aralık 2024, 10:30 - 14:45
- Dönüş: 24 Aralık 2024, 16:00 - 22:15
- Fiyat: ~4,500 TL (kişi başı)

**Konaklama Önerisi:**
- Hotel Le Marais (4★)
- Merkezi konum, Louvre'a 10 dk yürüme
- 3 gece: ~8,000 TL

**Günlük Program:**
📅 **Gün 1 (21 Aralık):**
- Eiffel Kulesi ziyareti
- Seine nehir gezisi
- Akşam yemeği: Le Jules Verne

📅 **Gün 2 (22 Aralık):**
- Louvre Müzesi
- Champs-Élysées'de alışveriş
- Notre-Dame Katedrali

📅 **Gün 3 (23 Aralık):**
- Versailles Sarayı günübirlik tur
- Montmartre & Sacré-Cœur
- Son akşam: Moulin Rouge gösterisi

**Toplam Tahmini Bütçe:** ~15,000-18,000 TL (kişi başı)

Planı beğendiniz mi? İsterseniz alternatif seçeneklere bakabiliriz! ✨`

          agentActivity.push(
            { agent: 'Flight Agent', status: 'completed', message: 'Uçuş seçenekleri bulundu', progress: 100 },
            { agent: 'Accommodation Agent', status: 'completed', message: 'Oteller bulundu', progress: 100 },
            { agent: 'Activity Agent', status: 'completed', message: 'Aktiviteler önerildi', progress: 100 },
            { agent: 'Weather Agent', status: 'completed', message: 'Hava durumu kontrol edildi: 5-8°C, kar olasılığı', progress: 100 }
          )
        } else if (message.includes('tokyo') || message.includes('japan')) {
          responseContent = `Tokyo seyahati harika bir seçim! Size özel bir plan hazırlayabilirim. Tarih ve bütçe tercihiniz nedir?`
          agentActivity.push(
            { agent: 'Orchestrator', status: 'completed', message: 'İstek analiz ediliyor', progress: 50 }
          )
        } else if (message.includes('alternative') || message.includes('alternatif')) {
          responseContent = `Alternatif seçenekler hazırlanıyor! "Find alternatives" butonuna tıklayarak farklı otel, uçuş ve aktivite seçeneklerini görebilirsiniz.`
          agentActivity.push(
            { agent: 'Alternative Agent', status: 'completed', message: 'Alternatifler hazır', progress: 100 }
          )
        } else {
          responseContent = `Anlıyorum! Size nasıl yardımcı olabilirim? Hangi şehre, kaç gün ve ne zaman seyahat etmek istersiniz? Bütçeniz de varsa belirtin, size özel bir plan hazırlayayım! ✈️`
          agentActivity.push(
            { agent: 'Orchestrator', status: 'completed', message: 'Hazır', progress: 100 }
          )
        }

        resolve({
          message_id: 'demo_' + Date.now(),
          role: 'assistant',
          content: responseContent,
          agent_activity: agentActivity,
          trip_id: request.trip_id || 'demo_trip_' + Date.now(),
          created_at: new Date().toISOString()
        })
      }, 1500) // 1.5 second delay to simulate real API
    })
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
