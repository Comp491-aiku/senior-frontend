/**
 * Authentication service and utilities
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface AuthTokens {
  access_token: string
  token_type: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  name: string
  password: string
}

class AuthService {
  private tokenKey = 'aiku_access_token'
  private demoTokenKey = 'aiku_demo_mode'

  /**
   * Login as demo user (no backend required)
   */
  async loginDemo(): Promise<AuthTokens> {
    const demoToken = 'demo_' + Math.random().toString(36).substring(2, 15)

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, demoToken)
      localStorage.setItem(this.demoTokenKey, 'true')
    }

    return {
      access_token: demoToken,
      token_type: 'Bearer'
    }
  }

  /**
   * Check if in demo mode
   */
  isDemoMode(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(this.demoTokenKey) === 'true'
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthTokens> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }

    const tokens: AuthTokens = await response.json()
    this.setToken(tokens.access_token)
    return tokens
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }

    const tokens: AuthTokens = await response.json()
    this.setToken(tokens.access_token)
    return tokens
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    // Return demo user if in demo mode
    if (this.isDemoMode()) {
      return {
        id: 'demo-user',
        email: 'demo@aiku.app',
        name: 'Demo User',
        created_at: new Date().toISOString()
      }
    }

    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.logout()
      }
      throw new Error('Failed to get user information')
    }

    return await response.json()
  }

  /**
   * Logout user
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.demoTokenKey)
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.tokenKey)
  }

  /**
   * Set token in storage
   */
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token)
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
