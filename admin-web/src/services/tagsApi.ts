import {
    BulkDeleteTagsRequest,
    Tag,
    TagFilters,
    TagListResponse
} from '../types/tag'
import { adminApi } from './adminApi'

// Tags API service for admin dashboard - Updated theo backend document
export const tagsApi = {
  // Get paginated list of tags with filters
  async getTags(filters: TagFilters = {}): Promise<TagListResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.isDeleted !== undefined) params.append('isDeleted', filters.isDeleted.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.order) params.append('order', filters.order)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await adminApi.get(`/api/admin/tags?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching tags:', error)
      throw error
    }
  },

  // Get single tag by ID
  async getTagById(id: string): Promise<Tag> {
    try {
      const response = await adminApi.get(`/api/admin/tags/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching tag:', error)
      throw error
    }
  },

  // Create new tag - Using query params theo document
  async createTag(name: string, description?: string): Promise<Tag> {
    try {
      const params = new URLSearchParams({ name })
      if (description) params.append('description', description)
      
      const response = await adminApi.post(`/api/admin/tags?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error creating tag:', error)
      throw error
    }
  },

  // Update existing tag - Using query params theo document
  async updateTag(id: string, name: string, description?: string): Promise<Tag> {
    try {
      const params = new URLSearchParams({ name })
      if (description) params.append('description', description)
      
      const response = await adminApi.put(`/api/admin/tags/${id}?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error updating tag:', error)
      throw error
    }
  },

  // Delete single tag (soft delete)
  async deleteTag(id: string): Promise<void> {
    try {
      await adminApi.delete(`/api/admin/tags/${id}`)
    } catch (error) {
      console.error('Error deleting tag:', error)
      throw error
    }
  },

  // Get tag statistics
  async getTagStatistics(): Promise<any> {
    try {
      const response = await adminApi.get('/api/admin/tags/statistics')
      return response.data
    } catch (error) {
      console.error('Error fetching tag statistics:', error)
      throw error
    }
  },

  // Bulk delete tags
  async bulkDeleteTags(data: BulkDeleteTagsRequest): Promise<void> {
    try {
      await adminApi.post('/api/admin/tags/bulk-delete', data)
    } catch (error) {
      console.error('Error bulk deleting tags:', error)
      throw error
    }
  },

  // Restore deleted tag
  async restoreTag(id: string): Promise<void> {
    try {
      await adminApi.put(`/api/admin/tags/${id}/restore`)
    } catch (error) {
      console.error('Error restoring tag:', error)
      throw error
    }
  }
}
