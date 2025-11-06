import { apiRequest } from './api'

// Types
export interface User {
  id: string
  name: string
  email: string
  rating: number
  reviews: number
  itemsShared: number
  itemsBorrowed: number
  location: string
  bio: string
  joinedDate: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  token?: string
}

class AuthService {
  private readonly TOKEN_KEY = "borrow_auth_token"
  private readonly USER_KEY = "borrow_user"

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Call backend login endpoint
      const data = await apiRequest<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      // Save token and user to localStorage
      localStorage.setItem(this.TOKEN_KEY, data.token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user))

      return {
        success: true,
        user: data.user,
        token: data.token,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      }
    }
  }

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      // Call backend signup endpoint
      const data = await apiRequest<{ user: User; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })

      // Save token and user to localStorage
      localStorage.setItem(this.TOKEN_KEY, data.token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user))

      return {
        success: true,
        user: data.user,
        token: data.token,
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed',
      }
    }
  }

  logout(): void {
    // Clear localStorage
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem(this.USER_KEY)
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(this.TOKEN_KEY)
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }
}

export const authService = new AuthService()