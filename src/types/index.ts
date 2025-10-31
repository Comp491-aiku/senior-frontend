// User Types
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// Trip Types
export interface Trip {
  id: string
  userId: string
  destination: string
  startDate: Date
  endDate: Date
  budget: number
  currency: string
  travelers: number
  preferences: TripPreferences
  status: 'draft' | 'planning' | 'confirmed' | 'completed'
  itinerary?: Itinerary
  createdAt: Date
  updatedAt: Date
}

export interface TripPreferences {
  accommodation: 'budget' | 'mid-range' | 'luxury'
  activities: string[]
  pace: 'relaxed' | 'moderate' | 'fast'
  interests: string[]
  dietaryRestrictions?: string[]
  accessibility?: string[]
}

// Itinerary Types
export interface Itinerary {
  id: string
  tripId: string
  days: DayItinerary[]
  totalCost: number
  generatedAt: Date
}

export interface DayItinerary {
  date: Date
  dayNumber: number
  activities: Activity[]
  meals: Meal[]
  accommodation?: Accommodation
  transportation: Transportation[]
  weather?: WeatherInfo
}

export interface Activity {
  id: string
  name: string
  description: string
  startTime: string
  endTime: string
  duration: number // in minutes
  location: Location
  cost: number
  category: 'sightseeing' | 'adventure' | 'culture' | 'relaxation' | 'shopping' | 'entertainment'
  bookingUrl?: string
  rating?: number
  reviews?: number
}

export interface Meal {
  id: string
  name: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  time: string
  location: Location
  cuisine: string
  cost: number
  rating?: number
  reservationUrl?: string
}

export interface Accommodation {
  id: string
  name: string
  type: 'hotel' | 'hostel' | 'apartment' | 'resort'
  location: Location
  checkIn: Date
  checkOut: Date
  nights: number
  costPerNight: number
  totalCost: number
  rating?: number
  amenities: string[]
  bookingUrl?: string
  images?: string[]
}

export interface Transportation {
  id: string
  type: 'flight' | 'train' | 'bus' | 'car' | 'taxi' | 'walking'
  from: Location
  to: Location
  departureTime: string
  arrivalTime: string
  duration: number // in minutes
  cost: number
  provider?: string
  bookingUrl?: string
  bookingReference?: string
}

// Flight Types
export interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: FlightPoint
  arrival: FlightPoint
  duration: number
  stops: number
  cost: number
  class: 'economy' | 'premium-economy' | 'business' | 'first'
  bookingUrl?: string
}

export interface FlightPoint {
  airport: string
  airportCode: string
  city: string
  country: string
  time: Date
  terminal?: string
  gate?: string
}

// Location Types
export interface Location {
  name: string
  address: string
  city: string
  country: string
  coordinates: Coordinates
  placeId?: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

// Weather Types
export interface WeatherInfo {
  date: Date
  temperature: {
    min: number
    max: number
    unit: 'celsius' | 'fahrenheit'
  }
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  precipitation: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrev: boolean
}

// Form Types
export interface TripFormData {
  destination: string
  startDate: Date
  endDate: Date
  budget: number
  currency: string
  travelers: number
  preferences: TripPreferences
}

export interface SearchFilters {
  minBudget?: number
  maxBudget?: number
  startDate?: Date
  endDate?: Date
  destination?: string
  status?: Trip['status']
}

// Store Types
export interface TripStore {
  trips: Trip[]
  currentTrip: Trip | null
  loading: boolean
  error: string | null
  setTrips: (trips: Trip[]) => void
  setCurrentTrip: (trip: Trip | null) => void
  addTrip: (trip: Trip) => void
  updateTrip: (id: string, trip: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}
