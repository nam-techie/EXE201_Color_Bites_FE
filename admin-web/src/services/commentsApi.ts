import {
    Comment,
    CommentFilters,
    CommentListResponse
} from '../types/comment'
import { adminApi } from './adminApi'
import type { ApiResponse } from '../types/user'

// Comments API service for admin dashboard - Updated theo backend document
class CommentsApiService {
  private baseURL = '/api/admin/comments'

  // GET /api/admin/comments - Lấy danh sách comments với pagination (tương thích với CommentsList)
  async getComments(filters: CommentFilters = {}): Promise<CommentListResponse> {
    try {
      console.log('📡 Fetching comments:', filters)
      
      const page = filters.page || 0
      const limit = filters.limit || 10
      
      const response = await adminApi.axiosInstance.get<ApiResponse<any>>(
        `${this.baseURL}?page=${page}&size=${limit}`
      )
      
      if (response.data.status === 200) {
        // Convert từ Page format sang CommentListResponse format
        const pageData = response.data.data
        
        // Handle both Page format and direct array format
        let comments: any[] = []
        
        if (pageData && typeof pageData === 'object' && 'content' in pageData) {
          // Spring Page format
          comments = pageData.content || []
          return {
            data: comments.map((raw: any) => ({
              ...raw,
              userId: raw.accountId || raw.userId, // Alias
              status: raw.isDeleted === false ? 'active' : raw.isDeleted === true ? 'deleted' : raw.status || 'active'
            })),
            total: pageData.totalElements || 0,
            page: pageData.number || 0,
            limit: pageData.size || limit,
            totalPages: pageData.totalPages || 0
          }
        } else if (Array.isArray(pageData)) {
          // Direct array format
          comments = pageData
          return {
            data: comments.map((raw: any) => ({
              ...raw,
              userId: raw.accountId || raw.userId, // Alias
              status: raw.isDeleted === false ? 'active' : raw.isDeleted === true ? 'deleted' : raw.status || 'active'
            })),
            total: pageData.length,
            page: 0,
            limit: limit,
            totalPages: 1
          }
        } else {
          // Fallback
          return {
            data: [],
            total: 0,
            page: 0,
            limit: limit,
            totalPages: 0
          }
        }
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách comment')
    } catch (error: any) {
      console.error('❌ Error fetching comments:', error)
      // Return empty response instead of throwing to prevent page crash
      return {
        data: [],
        total: 0,
        page: 0,
        limit: 10,
        totalPages: 0
      }
    }
  }

  // Alias cho getAllComments
  async getAllComments(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<CommentListResponse>> {
    const result = await this.getComments({ page, limit: size })
    return {
      status: 200,
      message: 'Success',
      data: result as any
    }
  }

  // GET /api/admin/comments/{id} - Lấy chi tiết comment
  async getCommentById(id: string): Promise<ApiResponse<Comment>> {
    try {
      console.log('📡 Fetching comment by id:', id)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<Comment>>(
        `${this.baseURL}/${id}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Comment detail fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải chi tiết comment')
    } catch (error) {
      console.error('❌ Error fetching comment:', error)
      throw error
    }
  }

  // DELETE /api/admin/comments/{id} - Xóa comment
  async deleteComment(id: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Deleting comment:', id)
      
      const response = await adminApi.axiosInstance.delete<ApiResponse<void>>(
        `${this.baseURL}/${id}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Comment deleted successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể xóa comment')
    } catch (error) {
      console.error('❌ Error deleting comment:', error)
      throw error
    }
  }

  // PUT /api/admin/comments/{id}/restore - Khôi phục comment đã xóa
  async restoreComment(id: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Restoring comment:', id)
      
      const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
        `${this.baseURL}/${id}/restore`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Comment restored successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể khôi phục comment')
    } catch (error) {
      console.error('❌ Error restoring comment:', error)
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
      console.log('📡 Fetching comments by post:', { postId, page, size })
      
      const response = await adminApi.axiosInstance.get<ApiResponse<CommentListResponse>>(
        `${this.baseURL}/post/${postId}?page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Comments by post fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải comment theo bài viết')
    } catch (error) {
      console.error('❌ Error fetching comments by post:', error)
      throw error
    }
  }

  // PUT /api/admin/comments/{id}/status - Cập nhật status comment (tương thích với CommentsList)
  async updateCommentStatus(id: string, data: CommentUpdateStatusRequest): Promise<Comment> {
    try {
      console.log('📤 Updating comment status:', id, data)
      
      // Note: Backend không có endpoint này, nhưng giữ lại để tương thích
      // Có thể cần implement ở backend hoặc xử lý khác
      throw new Error('Method not implemented - backend endpoint missing')
    } catch (error) {
      console.error('❌ Error updating comment status:', error)
      throw error
    }
  }

  // GET /api/admin/comments/statistics - Lấy thống kê comments
  async getCommentStatistics(): Promise<ApiResponse<{ [key: string]: any }>> {
    try {
      console.log('📡 Fetching comment statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<{ [key: string]: any }>>(
        `${this.baseURL}/statistics`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Comment statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê comment')
    } catch (error) {
      console.error('❌ Error fetching comment statistics:', error)
      throw error
    }
  }
}

// Export singleton instance
export const commentsApi = new CommentsApiService()
export default commentsApi
