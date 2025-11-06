import { apiRequest } from './api'

// Types
export interface BorrowRequest {
  id: string
  itemId: string
  itemName: string
  requesterId: string
  requesterName: string
  requesterEmail: string
  ownerId: string
  ownerName: string
  ownerEmail: string
  status: "pending" | "approved" | "rejected" | "completed"
  rating: number
  createdAt: string
  approvedAt?: string
  completedAt?: string
}

export interface RequestsResponse {
  success: boolean
  message?: string
  request?: BorrowRequest
  requests?: BorrowRequest[]
}

class RequestsService {
  async getAllRequests(): Promise<RequestsResponse> {
    try {
      const requests = await apiRequest<BorrowRequest[]>('/requests')
      return { success: true, requests }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch requests',
      }
    }
  }

  async getRequestsByOwnerId(ownerId: string): Promise<RequestsResponse> {
    try {
      const requests = await apiRequest<BorrowRequest[]>(`/requests/owner/${ownerId}`)
      return { success: true, requests }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch owner requests',
      }
    }
  }

  async getRequestsByRequesterId(requesterId: string): Promise<RequestsResponse> {
    try {
      const requests = await apiRequest<BorrowRequest[]>(`/requests/requester/${requesterId}`)
      return { success: true, requests }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch requester requests',
      }
    }
  }

  async getRequestById(requestId: string): Promise<RequestsResponse> {
    try {
      const request = await apiRequest<BorrowRequest>(`/requests/${requestId}`)
      return { success: true, request }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch request',
      }
    }
  }

  async createRequest(
    requestData: Omit<BorrowRequest, "id" | "status" | "createdAt">
  ): Promise<RequestsResponse> {
    try {
      const request = await apiRequest<BorrowRequest>('/requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })
      return { success: true, request, message: 'Request created successfully' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create request',
      }
    }
  }

  async approveRequest(requestId: string): Promise<RequestsResponse> {
    try {
      const request = await apiRequest<BorrowRequest>(`/requests/${requestId}/approve`, {
        method: 'PATCH',
      })
      return { success: true, request, message: 'Request approved' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to approve request',
      }
    }
  }

  async rejectRequest(requestId: string): Promise<RequestsResponse> {
    try {
      await apiRequest(`/requests/${requestId}`, {
        method: 'DELETE',
      })
      return { success: true, message: 'Request rejected' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reject request',
      }
    }
  }

  async completeRequest(requestId: string): Promise<RequestsResponse> {
    try {
      const request = await apiRequest<BorrowRequest>(`/requests/${requestId}/complete`, {
        method: 'PATCH',
      })
      return { success: true, request, message: 'Request completed' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to complete request',
      }
    }
  }

  async deleteRequest(requestId: string): Promise<RequestsResponse> {
    try {
      await apiRequest(`/requests/${requestId}`, {
        method: 'DELETE',
      })
      return { success: true, message: 'Request deleted' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete request',
      }
    }
  }

  async getPendingRequestsCount(ownerId: string): Promise<number> {
    try {
      const response = await apiRequest<{ count: number }>(`/requests/owner/${ownerId}/pending-count`)
      return response.count
    } catch (error) {
      return 0
    }
  }
}

export const requestsService = new RequestsService()