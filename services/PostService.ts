import { API_BASE_URL, API_ENDPOINTS } from '@/constants'
import type {
   CreatePostRequest,
   PaginatedResponse,
   PostResponse,
   UpdatePostRequest
} from '@/type'
import { apiService } from './ApiService'

export class PostService {
   /**
    * Tạo bài viết mới với multipart/form-data
    */
   async createPost(postData: CreatePostRequest, selectedImageUris?: string[]): Promise<PostResponse> {
      try {
         console.log('=== CREATE POST DEBUG ===')
         console.log('API URL:', `${API_BASE_URL}${API_ENDPOINTS.POSTS.CREATE}`)
         console.log('Request data:', { content: postData.content, moodId: postData.moodId, imageCount: selectedImageUris?.length || 0 })
         
         // Tạo FormData cho multipart request
         const formData = new FormData()
         
         // Thêm content (required)
         formData.append('content', postData.content)
         
         // Thêm moodId (optional)
         if (postData.moodId) {
            formData.append('moodId', postData.moodId)
         }
         
         // Thêm visibility (optional)
         if ((postData as any).visibility) {
            formData.append('visibility', (postData as any).visibility)
         }
         
         // Thêm nhiều files nếu có
         if (selectedImageUris && selectedImageUris.length > 0) {
            selectedImageUris.forEach((uri, index) => {
               const filename = uri.split('/').pop() || `image_${index + 1}.jpg`
               const match = /\.(\w+)$/.exec(filename)
               const type = match ? `image/${match[1]}` : 'image/jpeg'
               const file = { uri, type, name: filename } as any
               formData.append('files', file)
               console.log(`📎 Added image file ${index + 1}:`, filename, type)
            })
         }
         
         const response = await apiService.upload<PostResponse>(
            API_ENDPOINTS.POSTS.CREATE,
            formData
         )
         
         console.log('Raw API Response:', JSON.stringify(response, null, 2))
         console.log('Response Status Code:', response.status)
         console.log('Response Message:', response.message)
         console.log('Response Data:', response.data)
         
         if (response.status === 201 && response.data) {
            console.log('✅ Post created successfully:', response.data)
            return response.data
         }
         
         // Log chi tiết lỗi
         console.error('❌ API Error Details:')
         console.error('- Status Code:', response.status)
         console.error('- Message:', response.message)
         console.error('- Data:', response.data)
         
         throw new Error(response.message || 'Không thể tạo bài viết')
      } catch (error) {
         console.error('=== CREATE POST ERROR ===')
         console.error('Error type:', typeof error)
         console.error('Error object:', error)
         
         if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
         }
         
         // Kiểm tra axios error
         if ((error as any).response) {
            const axiosError = error as any
            console.error('Axios Error Response:', axiosError.response)
            console.error('Status:', axiosError.response?.status)
            console.error('Data:', axiosError.response?.data)
            console.error('Headers:', axiosError.response?.headers)
         }
         
         throw error
      }
   }

   /**
    * Lấy danh sách tất cả bài viết (có phân trang)
    */
   async getAllPosts(page: number = 1, size: number = 10): Promise<PaginatedResponse<PostResponse>> {
      try {
         console.log(`Fetching posts - page: ${page}, size: ${size}`)
         const response = await apiService.get<PaginatedResponse<PostResponse>>(
            `${API_ENDPOINTS.POSTS.LIST}?page=${page}&size=${size}`
         )
         
         if (response.status === 200 && response.data) {
            console.log('Posts fetched successfully:', response.data.content?.length, 'posts')
            console.log('=== RAW API RESPONSE ===')
            console.log('Full response:', JSON.stringify(response, null, 2))
            console.log('=== END RAW RESPONSE ===')
            return response.data
         }
         
         throw new Error(response.message || 'Không thể tải danh sách bài viết')
      } catch (error) {
         console.error('Error fetching posts:', error)
         // Trả về empty response thay vì throw để app không crash
         console.log('🔄 Returning empty response due to API error')
         return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: size,
            number: page - 1,
            first: true,
            last: true
         }
      }
   }

   /**
    * Lấy bài viết theo quyền riêng tư (có phân trang)
    */
   async getPostsByPrivacy(page: number = 1, size: number = 10): Promise<PaginatedResponse<PostResponse>> {
      try {
         console.log(`Fetching posts by privacy - page: ${page}, size: ${size}`)
         const response = await apiService.get<PaginatedResponse<PostResponse>>(
            `${API_ENDPOINTS.POSTS.BY_PRIVACY}?page=${page}&size=${size}`
         )
         
         if (response.status === 200 && response.data) {
            console.log('Posts by privacy fetched successfully:', response.data.content?.length, 'posts')
            console.log('=== RAW API RESPONSE ===')
            console.log('Full response:', JSON.stringify(response, null, 2))
            console.log('=== END RAW RESPONSE ===')
            return response.data
         }
         
         throw new Error(response.message || 'Không thể tải bài viết theo quyền riêng tư')
      } catch (error) {
         console.error('Error fetching posts by privacy:', error)
         // Trả về empty response thay vì throw để app không crash
         console.log('🔄 Returning empty response due to API error')
         return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: size,
            number: page - 1,
            first: true,
            last: true
         }
      }
   }

   /**
    * Lấy bài viết theo ID
    */
   async getPostById(postId: string): Promise<PostResponse> {
      try {
         console.log('Fetching post by ID:', postId)
         const response = await apiService.get<PostResponse>(
            `${API_ENDPOINTS.POSTS.BY_ID}/${postId}`
         )
         
         if (response.status === 200 && response.data) {
            console.log('Post fetched successfully:', response.data.id)
            return response.data
         }
         
         throw new Error(response.message || 'Không thể tải bài viết')
      } catch (error) {
         console.error('Error fetching post by ID:', error)
         throw error
      }
   }

   /**
    * Lấy bài viết của user hiện tại
    */
   async getUserPosts(page: number = 1, size: number = 10): Promise<PaginatedResponse<PostResponse>> {
      try {
         console.log(`Fetching user posts - page: ${page}, size: ${size}`)
         const response = await apiService.get<PaginatedResponse<PostResponse>>(
            `${API_ENDPOINTS.POSTS.BY_USER}?page=${page}&size=${size}`
         )
         
         if (response.status === 200 && response.data) {
            console.log('User posts fetched successfully:', response.data.content?.length, 'posts')
            return response.data
         }
         
         throw new Error(response.message || 'Không thể tải bài viết của bạn')
      } catch (error) {
         console.error('Error fetching user posts:', error)
         throw error
      }
   }

   /**
    * Lấy bài viết theo mood
    */
   async getPostsByMood(mood: string, page: number = 1, size: number = 10): Promise<PaginatedResponse<PostResponse>> {
      try {
         console.log(`Fetching posts by mood: ${mood} - page: ${page}, size: ${size}`)
         const response = await apiService.get<PaginatedResponse<PostResponse>>(
            `${API_ENDPOINTS.POSTS.BY_MOOD}/${mood}?page=${page}&size=${size}`
         )
         
         if (response.status === 200 && response.data) {
            console.log('Posts by mood fetched successfully:', response.data.content?.length, 'posts')
            return response.data
         }
         
         throw new Error(response.message || 'Không thể tải bài viết theo mood')
      } catch (error) {
         console.error('Error fetching posts by mood:', error)
         throw error
      }
   }

   /**
    * Tìm kiếm bài viết
    */
   async searchPosts(keyword: string, page: number = 1, size: number = 10): Promise<PaginatedResponse<PostResponse>> {
      try {
         console.log(`Searching posts with keyword: ${keyword} - page: ${page}, size: ${size}`)
         const response = await apiService.get<PaginatedResponse<PostResponse>>(
            `${API_ENDPOINTS.POSTS.SEARCH}?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
         )
         
         if (response.status === 200 && response.data) {
            console.log('Search results:', response.data.content?.length, 'posts found')
            return response.data
         }
         
         throw new Error(response.message || 'Không thể tìm kiếm bài viết')
      } catch (error) {
         console.error('Error searching posts:', error)
         throw error
      }
   }

   /**
    * Cập nhật bài viết
    */
   async updatePost(postId: string, updateData: UpdatePostRequest): Promise<PostResponse> {
      try {
         console.log('Updating post:', postId, updateData)
         const response = await apiService.put<PostResponse>(
            `${API_ENDPOINTS.POSTS.UPDATE}/${postId}`,
            updateData
         )
         
         if (response.status === 200 && response.data) {
            console.log('Post updated successfully:', response.data.id)
            return response.data
         }
         
         throw new Error(response.message || 'Không thể cập nhật bài viết')
      } catch (error) {
         console.error('Error updating post:', error)
         throw error
      }
   }

   /**
    * Xóa bài viết
    */
   async deletePost(postId: string): Promise<void> {
      try {
         console.log('Deleting post:', postId)
         const response = await apiService.delete<string>(
            `${API_ENDPOINTS.POSTS.DELETE}/${postId}`
         )
         
         if (response.status === 200) {
            console.log('Post deleted successfully')
            return
         }
         
         throw new Error(response.message || 'Không thể xóa bài viết')
      } catch (error) {
         console.error('Error deleting post:', error)
         throw error
      }
   }

   /**
    * Toggle reaction bài viết (Like/Unlike)
    * Sử dụng API mới tự động detect trạng thái và toggle
    */
   async toggleReaction(postId: string): Promise<{isLiked: boolean, reactionCount: number, action: string}> {
      try {
         console.log('Toggling reaction for post:', postId)
         const response = await apiService.post<{isLiked: boolean, reactionCount: number, action: string}>(
            `${API_ENDPOINTS.POSTS.TOGGLE_REACTION}/${postId}`
         )
         
         if (response.status === 200 && response.data) {
            console.log('Reaction toggled successfully:', response.data)
            return response.data
         }
         
         throw new Error(response.message || 'Không thể cập nhật reaction')
      } catch (error) {
         console.error('Error toggling reaction:', error)
         throw error
      }
   }

   /**
    * Lấy số lượng bài viết của user
    */
   async getUserPostCount(): Promise<number> {
      try {
         console.log('Fetching user post count')
         const response = await apiService.get<number>(API_ENDPOINTS.POSTS.COUNT_USER)
         
         if (response.status === 200 && response.data !== undefined) {
            console.log('User post count:', response.data)
            return response.data
         }
         
         throw new Error(response.message || 'Không thể lấy số lượng bài viết')
      } catch (error) {
         console.error('Error fetching user post count:', error)
         throw error
      }
   }
}

// Export singleton instance
export const postService = new PostService()
export default postService
