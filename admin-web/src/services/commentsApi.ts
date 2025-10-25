import {
    BulkDeleteCommentsRequest,
    Comment,
    CommentFilters,
    CommentListResponse,
    CommentUpdateStatusRequest
} from '../types/comment'
import { adminApi } from './adminApi'

// Comments API service for admin dashboard
export const commentsApi = {
  // Get paginated list of comments with filters
  async getComments(filters: CommentFilters = {}): Promise<CommentListResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.status) params.append('status', filters.status)
      if (filters.userId) params.append('userId', filters.userId)
      if (filters.postId) params.append('postId', filters.postId)
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end)

      const response = await adminApi.get(`/comments?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  },

  // Get single comment by ID
  async getCommentById(id: string): Promise<Comment> {
    try {
      const response = await adminApi.get(`/comments/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching comment:', error)
      throw error
    }
  },

  // Update comment status
  async updateCommentStatus(id: string, data: CommentUpdateStatusRequest): Promise<Comment> {
    try {
      const response = await adminApi.patch(`/comments/${id}/status`, data)
      return response.data
    } catch (error) {
      console.error('Error updating comment status:', error)
      throw error
    }
  },

  // Delete single comment
  async deleteComment(id: string): Promise<void> {
    try {
      await adminApi.delete(`/comments/${id}`)
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  },

  // Bulk delete comments
  async bulkDeleteComments(data: BulkDeleteCommentsRequest): Promise<void> {
    try {
      await adminApi.post('/comments/bulk-delete', data)
    } catch (error) {
      console.error('Error bulk deleting comments:', error)
      throw error
    }
  }
}
