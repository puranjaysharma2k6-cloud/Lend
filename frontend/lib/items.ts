import { apiRequest } from './api'

// Types
export interface Item {
  id: string
  name: string
  description: string
  category: string
  condition: string
  status: "available" | "borrowed"
  ownerId: string
  ownerEmail: string
  ownerName: string
  ownerRating: number
  ownerRatingCount: number
  location: string
  image: string
  createdAt: string
  borrowedBy?: string
  borrowedAt?: string
  returnBy?: string
}

export interface ItemsResponse {
  success: boolean
  message?: string
  item?: Item
  items?: Item[]
}

class ItemsService {
  async getAllItems(): Promise<ItemsResponse> {
    try {
      const items = await apiRequest<Item[]>('/items')
      return { success: true, items }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch items',
      }
    }
  }

  async getItemsByUserId(userId: string): Promise<ItemsResponse> {
    try {
      const items = await apiRequest<Item[]>(`/items/user/${userId}`)
      return { success: true, items }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch user items',
      }
    }
  }

  async getItemById(itemId: string): Promise<ItemsResponse> {
    try {
      const item = await apiRequest<Item>(`/items/${itemId}`)
      return { success: true, item }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch item',
      }
    }
  }

  async createItem(
    itemData: Omit<Item, "id" | "createdAt" | "status" | "ownerRating" | "ownerRatingCount">
  ): Promise<ItemsResponse> {
    try {
      const item = await apiRequest<Item>('/items', {
        method: 'POST',
        body: JSON.stringify(itemData),
      })
      return { success: true, item, message: 'Item created successfully' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create item',
      }
    }
  }

  async updateItem(itemId: string, updates: Partial<Item>): Promise<ItemsResponse> {
    try {
      const item = await apiRequest<Item>(`/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
      return { success: true, item, message: 'Item updated successfully' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update item',
      }
    }
  }

  async deleteItem(itemId: string): Promise<ItemsResponse> {
    try {
      await apiRequest(`/items/${itemId}`, {
        method: 'DELETE',
      })
      return { success: true, message: 'Item deleted successfully' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete item',
      }
    }
  }

  async toggleItemStatus(itemId: string): Promise<ItemsResponse> {
    try {
      const item = await apiRequest<Item>(`/items/${itemId}/toggle-status`, {
        method: 'PATCH',
      })
      return { success: true, item, message: 'Item status updated' }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update status',
      }
    }
  }

  async searchItems(query: string, category?: string): Promise<ItemsResponse> {
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (category && category !== 'all') params.append('category', category)
      
      const items = await apiRequest<Item[]>(`/items/search?${params.toString()}`)
      return { success: true, items }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search items',
      }
    }
  }
}

export const itemsService = new ItemsService()