import {
    BulkDeleteCommentsRequest,
    Comment,
    CommentFilters,
    CommentListResponse
} from '../types/comment'
import { adminApi } from './adminApi'

// Comments API service for admin dashboard - Updated theo backend document
export const commentsApi = {
  // Get paginated list of comments with filters
  async getComments(filters: CommentFilters = {}): Promise<CommentListResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.isDeleted !== undefined) params.append('isDeleted', filters.isDeleted.toString())
      if (filters.accountId) params.append('accountId', filters.accountId)
      if (filters.postId) params.append('postId', filters.postId)
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end)

      const response = await adminApi.get(`/api/admin/comments?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  },

  // Get single comment by ID
  async getCommentById(id: string): Promise<Comment> {
    try {
      const response = await adminApi.get(`/api/admin/comments/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching comment:', error)
      throw error
    }
  },

  // Delete single comment (soft delete)
  async deleteComment(id: string): Promise<void> {
    try {
      await adminApi.delete(`/api/admin/comments/${id}`)
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  },

  // Restore deleted comment
  async restoreComment(id: string): Promise<void> {
    try {
      await adminApi.put(`/api/admin/comments/${id}/restore`)
    } catch (error) {
      console.error('Error restoring comment:', error)
      throw error
    }
  },

  // Get comments by post
  async getCommentsByPost(postId: string, page: number = 0, size: number = 10): Promise<CommentListResponse> {
    try {
      const response = await adminApi.get(`/api/admin/comments/post/${postId}?page=${page}&size=${size}`)
      return response.data
    } catch (error) {
      console.error('Error fetching comments by post:', error)
      throw error
    }
  },

  // Get comment statistics
  async getCommentStatistics(): Promise<any> {
    try {
      const response = await adminApi.get('/api/admin/comments/statistics')
      return response.data
    } catch (error) {
      console.error('Error fetching comment statistics:', error)
      throw error
    }
  },

  // Bulk delete comments
  async bulkDeleteComments(data: BulkDeleteCommentsRequest): Promise<void> {
    try {
      await adminApi.post('/api/admin/comments/bulk-delete', data)
    } catch (error) {
      console.error('Error bulk deleting comments:', error)
      throw error
    }
  }
}
