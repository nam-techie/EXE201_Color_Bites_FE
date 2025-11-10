import type {
    ApiResponse,
    PostDetail,
    PostFilters,
    PostsPageResponse
} from '../types/post'
import { adminApi } from './adminApi'

class PostsApiService {
  private baseURL = '/api/admin/posts'

  // GET /api/admin/posts - Lấy danh sách posts với pagination (tương thích với PostsList)
  async getPosts(
    page: number = 0, 
    size: number = 10,
    filters?: PostFilters
  ): Promise<ApiResponse<PostsPageResponse>> {
    try {
      console.log('📡 Fetching posts:', { page, size, filters })
      
      const response = await adminApi.axiosInstance.get<ApiResponse<PostsPageResponse>>(
        `${this.baseURL}?page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log(` Fetched ${response.data.data.content.length} posts`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách bài viết')
    } catch (error) {
      console.error('❌ Error fetching posts:', error)
      throw error
    }
  }

  // Alias cho getAllPosts
  async getAllPosts(
    page: number = 0, 
    size: number = 10
  ): Promise<ApiResponse<PostsPageResponse>> {
    return this.getPosts(page, size)
  }

  // GET /api/admin/posts/{id} - Lấy chi tiết post (tương thích với PostDetail)
  async getPostDetail(postId: string): Promise<ApiResponse<PostDetail>> {
    try {
      console.log('📡 Fetching post by id:', postId)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<PostDetail>>(
        `${this.baseURL}/${postId}`
      )
      
      if (response.data.status === 200) {
        console.log(' Post detail fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải chi tiết bài viết')
    } catch (error) {
      console.error('❌ Error fetching post detail:', error)
      throw error
    }
  }

  // Alias cho getPostDetail
  async getPostById(postId: string): Promise<ApiResponse<PostDetail>> {
    return this.getPostDetail(postId)
  }

  // DELETE /api/admin/posts/{id} - Xóa post
  async deletePost(postId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Deleting post:', postId)
      
      const response = await adminApi.axiosInstance.delete<ApiResponse<void>>(
        `${this.baseURL}/${postId}`
      )
      
      if (response.data.status === 200) {
        console.log(' Post deleted successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể xóa bài viết')
    } catch (error) {
      console.error('❌ Error deleting post:', error)
      throw error
    }
  }

  // PUT /api/admin/posts/{id}/restore - Khôi phục post đã xóa
  async restorePost(postId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Restoring post:', postId)
      
      const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
        `${this.baseURL}/${postId}/restore`
      )
      
      if (response.data.status === 200) {
        console.log(' Post restored successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể khôi phục bài viết')
    } catch (error) {
      console.error('❌ Error restoring post:', error)
      throw error
    }
  }
}

// Export singleton instance
export const postsApi = new PostsApiService()
export default postsApi
