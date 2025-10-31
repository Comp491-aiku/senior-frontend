import axios, { AxiosInstance, AxiosError } from 'axios'
import type {
  Trip,
  Itinerary,
  TripFormData,
  ApiResponse,
  PaginatedResponse,
  Flight,
  Accommodation,
  WeatherInfo
} from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Trip endpoints
  async getTrips(page = 1, pageSize = 10): Promise<PaginatedResponse<Trip>> {
    const response = await this.client.get<PaginatedResponse<Trip>>('/api/trips', {
      params: { page, pageSize },
    })
    return response.data
  }

  async getTrip(id: string): Promise<Trip> {
    const response = await this.client.get<ApiResponse<Trip>>(`/api/trips/${id}`)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch trip')
    }
    return response.data.data
  }

  async createTrip(data: TripFormData): Promise<Trip> {
    const response = await this.client.post<ApiResponse<Trip>>('/api/trips', data)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create trip')
    }
    return response.data.data
  }

  async updateTrip(id: string, data: Partial<TripFormData>): Promise<Trip> {
    const response = await this.client.put<ApiResponse<Trip>>(`/api/trips/${id}`, data)
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update trip')
    }
    return response.data.data
  }

  async deleteTrip(id: string): Promise<void> {
    await this.client.delete(`/api/trips/${id}`)
  }

  // Itinerary endpoints
  async generateItinerary(tripId: string): Promise<Itinerary> {
    const response = await this.client.post<ApiResponse<Itinerary>>(
      `/api/trips/${tripId}/itinerary/generate`
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to generate itinerary')
    }
    return response.data.data
  }

  async getItinerary(tripId: string): Promise<Itinerary> {
    const response = await this.client.get<ApiResponse<Itinerary>>(
      `/api/trips/${tripId}/itinerary`
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch itinerary')
    }
    return response.data.data
  }

  async updateItinerary(tripId: string, data: Partial<Itinerary>): Promise<Itinerary> {
    const response = await this.client.put<ApiResponse<Itinerary>>(
      `/api/trips/${tripId}/itinerary`,
      data
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update itinerary')
    }
    return response.data.data
  }

  // Flight search
  async searchFlights(params: {
    origin: string
    destination: string
    departureDate: string
    returnDate?: string
    passengers: number
  }): Promise<Flight[]> {
    const response = await this.client.get<ApiResponse<Flight[]>>('/api/flights/search', {
      params,
    })
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to search flights')
    }
    return response.data.data
  }

  // Accommodation search
  async searchAccommodations(params: {
    destination: string
    checkIn: string
    checkOut: string
    guests: number
    type?: string
  }): Promise<Accommodation[]> {
    const response = await this.client.get<ApiResponse<Accommodation[]>>(
      '/api/accommodations/search',
      { params }
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to search accommodations')
    }
    return response.data.data
  }

  // Weather forecast
  async getWeatherForecast(params: {
    location: string
    startDate: string
    endDate: string
  }): Promise<WeatherInfo[]> {
    const response = await this.client.get<ApiResponse<WeatherInfo[]>>('/api/weather', {
      params,
    })
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch weather')
    }
    return response.data.data
  }
}

export const apiClient = new ApiClient()
