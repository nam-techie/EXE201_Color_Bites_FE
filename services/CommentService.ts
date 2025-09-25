import { API_ENDPOINTS } from '@/constants'
import type { CommentResponse, CreateCommentRequest, PaginatedResponse } from '@/type'
import { apiService } from './ApiService'

export class CommentService {
   /**
    * Tạo comment mới cho bài viết
    */
   async createComment(postId: string, commentData: CreateCommentRequest): Promise<CommentResponse> {
      try {
         console.log('Creating comment for post:', postId, commentData)
         const response = await apiService.post<CommentResponse>(
            `${API_ENDPOINTS.COMMENTS.CREATE}/${postId}`,
            commentData
         )
         
         if (response.status === 201 && response.data) {
            console.log('Comment created successfully:', response.data)
            return response.data
         }
         
         throw new Error(response.message || 'Không thể tạo comment')
      } catch (error) {
         console.error('Error creating comment:', error)
         throw error
      }
   }

   /**
    * Lấy danh sách comments của bài viết
    */
   async getCommentsByPost(postId: string, page: number = 1, size: number = 20): Promise<PaginatedResponse<CommentResponse>> {
      try {
         console.log('Fetching comments for post:', postId, 'page:', page)
         const response = await apiService.get<PaginatedResponse<CommentResponse>>(
            `${API_ENDPOINTS.COMMENTS.LIST}/${postId}/all?page=${page}&size=${size}`
         )
         
         if (response.status === 200 && response.data) {
            console.log('Comments fetched successfully:', response.data.content?.length, 'comments')
            return response.data
         }
         
         throw new Error(response.message || 'Không thể tải comments')
      } catch (error) {
         console.error('Error fetching comments:', error)
         throw error
      }
   }
}

// Export singleton instance
export const commentService = new CommentService()
