import {
    BulkDeleteTagsRequest,
    Tag,
    TagFilters,
    TagFormData,
    TagListResponse
} from '../types/tag'
import { adminApi } from './adminApi'

// Tags API service for admin dashboard
export const tagsApi = {
  // Get paginated list of tags with filters
  async getTags(filters: TagFilters = {}): Promise<TagListResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.order) params.append('order', filters.order)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await adminApi.get(`/tags?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching tags:', error)
      throw error
    }
  },

  // Get single tag by ID
  async getTagById(id: string): Promise<Tag> {
    try {
      const response = await adminApi.get(`/tags/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching tag:', error)
      throw error
    }
  },

  // Create new tag
  async createTag(data: TagFormData): Promise<Tag> {
    try {
      const response = await adminApi.post('/tags', data)
      return response.data
    } catch (error) {
      console.error('Error creating tag:', error)
      throw error
    }
  },

  // Update existing tag
  async updateTag(id: string, data: TagFormData): Promise<Tag> {
    try {
      const response = await adminApi.put(`/tags/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating tag:', error)
      throw error
    }
  },

  // Delete single tag
  async deleteTag(id: string): Promise<void> {
    try {
      await adminApi.delete(`/tags/${id}`)
    } catch (error) {
      console.error('Error deleting tag:', error)
      throw error
    }
  },

  // Bulk delete tags
  async bulkDeleteTags(data: BulkDeleteTagsRequest): Promise<void> {
    try {
      await adminApi.post('/tags/bulk-delete', data)
    } catch (error) {
      console.error('Error bulk deleting tags:', error)
      throw error
    }
  }
}
