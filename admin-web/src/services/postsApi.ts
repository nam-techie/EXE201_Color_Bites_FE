import type {
    ApiResponse,
    PostDetail,
    PostFilters,
    PostsPageResponse,
    PostStatistics
} from '../types/post'
import { adminApi } from './adminApi'

class PostsApiService {
  private baseURL = '/api/admin/posts'

  // Lấy danh sách posts với pagination và filters
  async getPosts(
    page: number = 0, 
    size: number = 20, 
    filters?: PostFilters
  ): Promise<ApiResponse<PostsPageResponse>> {
    try {
      console.log('📡 Fetching posts:', { page, size, filters })
      
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })

      // Add filters to params
      if (filters?.search) {
        params.append('search', filters.search)
      }
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status)
      }
      if (filters?.moodId) {
        params.append('moodId', filters.moodId)
      }
      if (filters?.authorId) {
        params.append('authorId', filters.authorId)
      }
      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start)
        params.append('endDate', filters.dateRange.end)
      }

      const response = await adminApi.axiosInstance.get<ApiResponse<PostsPageResponse>>(
        `${this.baseURL}?${params.toString()}`
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data.content.length} posts`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách bài viết')
    } catch (error) {
      console.error('❌ Error fetching posts:', error)
      throw error
    }
  }

  // Lấy chi tiết post
  async getPostDetail(postId: string): Promise<ApiResponse<PostDetail>> {
    try {
      console.log('📡 Fetching post detail:', postId)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<PostDetail>>(
        `${this.baseURL}/${postId}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Post detail fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải chi tiết bài viết')
    } catch (error) {
      console.error('❌ Error fetching post detail:', error)
      throw error
    }
  }

  // Xóa post (soft delete)
  async deletePost(postId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Deleting post:', postId)
      
      const response = await adminApi.axiosInstance.delete<ApiResponse<void>>(
        `${this.baseURL}/${postId}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Post deleted successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể xóa bài viết')
    } catch (error) {
      console.error('❌ Error deleting post:', error)
      throw error
    }
  }

  // Khôi phục post đã xóa
  async restorePost(postId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Restoring post:', postId)
      
      const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
        `${this.baseURL}/${postId}/restore`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Post restored successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể khôi phục bài viết')
    } catch (error) {
      console.error('❌ Error restoring post:', error)
      throw error
    }
  }

  // Lấy thống kê posts
  async getPostStatistics(): Promise<ApiResponse<PostStatistics>> {
    try {
      console.log('📡 Fetching post statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<PostStatistics>>(
        '/api/admin/statistics/posts'
      )
      
      if (response.data.status === 200) {
        console.log('✅ Post statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê bài viết')
    } catch (error) {
      console.error('❌ Error fetching post statistics:', error)
      throw error
    }
  }

  // Lấy posts theo author
  async getPostsByAuthor(
    authorId: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<ApiResponse<PostsPageResponse>> {
    try {
      console.log('📡 Fetching posts by author:', authorId)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<PostsPageResponse>>(
        `${this.baseURL}/author/${authorId}?page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data.content.length} posts by author`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải bài viết của tác giả')
    } catch (error) {
      console.error('❌ Error fetching posts by author:', error)
      throw error
    }
  }

  // Lấy posts theo mood
  async getPostsByMood(
    moodId: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<ApiResponse<PostsPageResponse>> {
    try {
      console.log('📡 Fetching posts by mood:', moodId)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<PostsPageResponse>>(
        `${this.baseURL}/mood/${moodId}?page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data.content.length} posts by mood`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải bài viết theo tâm trạng')
    } catch (error) {
      console.error('❌ Error fetching posts by mood:', error)
      throw error
    }
  }

  // Tìm kiếm posts
  async searchPosts(
    query: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<ApiResponse<PostsPageResponse>> {
    try {
      console.log('📡 Searching posts:', query)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<PostsPageResponse>>(
        `${this.baseURL}/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Found ${response.data.data.content.length} posts`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tìm kiếm bài viết')
    } catch (error) {
      console.error('❌ Error searching posts:', error)
      throw error
    }
  }
}

// Export singleton instance
export const postsApi = new PostsApiService()
export default postsApi
