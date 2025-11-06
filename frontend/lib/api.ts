// Base API configuration and request handler
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get token from localStorage if it exists
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('borrow_auth_token') 
    : null

  // Set up headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    // Make the API request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Handle non-OK responses
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    // Return the JSON data
    return response.json()
  } catch (error) {
    console.error('API Request Error:', error)
    throw error
  }
}