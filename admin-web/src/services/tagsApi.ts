import {
    Tag,
    TagFilters,
    TagListResponse
} from '../types/tag'
import { adminApi } from './adminApi'
import type { ApiResponse } from '../types/user'

// Tags API service for admin dashboard
class TagsApiService {
  private baseURL = '/api/admin/tags'

  // GET /api/admin/tags - Lấy danh sách tags với pagination (tương thích với TagsList)
  async getTags(filters: TagFilters = {}): Promise<TagListResponse> {
    try {
      console.log('📡 Fetching tags:', filters)
      
      const page = filters.page || 0
      const limit = filters.limit || 10
      
      const response = await adminApi.axiosInstance.get<ApiResponse<any>>(
        `${this.baseURL}?page=${page}&size=${limit}`
      )
      
      if (response.data.status === 200) {
        // Convert từ Page format sang TagListResponse format
        const pageData = response.data.data
        return {
          data: pageData.content || [],
          total: pageData.totalElements || 0,
          page: pageData.number || 0,
          limit: pageData.size || limit,
          totalPages: pageData.totalPages || 0
        }
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách tag')
    } catch (error) {
      console.error('❌ Error fetching tags:', error)
      throw error
    }
  }

  // Alias cho getAllTags
  async getAllTags(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<TagListResponse>> {
    const result = await this.getTags({ page, limit: size })
    return {
      status: 200,
      message: 'Success',
      data: result as any
    }
  }

  // GET /api/admin/tags/{id} - Lấy chi tiết tag
  async getTagById(id: string): Promise<ApiResponse<Tag>> {
    try {
      console.log('📡 Fetching tag by id:', id)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<Tag>>(
        `${this.baseURL}/${id}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Tag detail fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải chi tiết tag')
    } catch (error) {
      console.error('❌ Error fetching tag:', error)
      throw error
    }
  }

  // POST /api/admin/tags - Tạo tag mới (tương thích với TagForm) - Using query params theo document
  async createTag(name: string, description?: string): Promise<Tag> {
    try {
      console.log('📤 Creating tag:', data)
      
      const params = new URLSearchParams()
      params.append('name', data.name)
      if (data.description) {
        params.append('description', data.description)
      }
      
      const response = await adminApi.axiosInstance.post<ApiResponse<Tag>>(
        `${this.baseURL}?${params.toString()}`
      )
      
      if (response.data.status === 201) {
        console.log('✅ Tag created successfully')
        return response.data.data
      }
      
      throw new Error(response.data.message || 'Không thể tạo tag')
    } catch (error) {
      console.error('❌ Error creating tag:', error)
      throw error
    }
  }

  // Overload cho createTag với name và description (tương thích với backend)
  async createTagWithParams(
    name: string,
    description?: string
  ): Promise<ApiResponse<Tag>> {
    const tag = await this.createTag({ name, description, color: '#4299e1' })
    return {
      status: 201,
      message: 'Success',
      data: tag
    }
  }

  // PUT /api/admin/tags/{id} - Cập nhật tag (tương thích với TagForm)
  async updateTag(id: string, data: TagFormData): Promise<Tag> {
    try {
      console.log('📤 Updating tag:', { id, data })
      
      const params = new URLSearchParams()
      params.append('name', data.name)
      if (data.description) {
        params.append('description', data.description)
      }
      
      const response = await adminApi.axiosInstance.put<ApiResponse<Tag>>(
        `${this.baseURL}/${id}?${params.toString()}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Tag updated successfully')
        return response.data.data
      }
      
      throw new Error(response.data.message || 'Không thể cập nhật tag')
    } catch (error) {
      console.error('❌ Error updating tag:', error)
      throw error
    }
  }

  // Overload cho updateTag với name và description (tương thích với backend)
  async updateTagWithParams(
    id: string,
    name: string,
    description?: string
  ): Promise<ApiResponse<Tag>> {
    const tag = await this.updateTag(id, { name, description, color: '#4299e1' })
    return {
      status: 200,
      message: 'Success',
      data: tag
    }
  }

  // DELETE /api/admin/tags/{id} - Xóa tag (tương thích với TagsList)
  async deleteTag(id: string): Promise<void> {
    try {
      console.log('📤 Deleting tag:', id)
      
      const response = await adminApi.axiosInstance.delete<ApiResponse<void>>(
        `${this.baseURL}/${id}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Tag deleted successfully')
        return
      }
      
      throw new Error(response.data.message || 'Không thể xóa tag')
    } catch (error) {
      console.error('❌ Error deleting tag:', error)
      throw error
    }
  }

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

  // GET /api/admin/tags/statistics - Lấy thống kê tags
  async getTagStatistics(): Promise<ApiResponse<{ [key: string]: any }>> {
    try {
      console.log('📡 Fetching tag statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<{ [key: string]: any }>>(
        `${this.baseURL}/statistics`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Tag statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê tag')
    } catch (error) {
      console.error('❌ Error fetching tag statistics:', error)
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

// Export singleton instance
export const tagsApi = new TagsApiService()
export default tagsApi
