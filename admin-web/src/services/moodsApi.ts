import { AxiosInstance } from 'axios'
import type {
    CreateMoodDto,
    Mood,
    MoodListParams,
    MoodStats,
    UpdateMoodDto
} from '../types/mood'
import type { ApiResponse, PagedResponse } from '../types/user'
import { adminApi } from './adminApi'

class MoodsApiService {
  constructor(private axiosInstance: AxiosInstance) {}

  // Lấy danh sách moods với pagination
  async getMoods(params: MoodListParams = {}): Promise<ApiResponse<PagedResponse<Mood>>> {
    try {
      console.log('📡 Fetching moods list:', params)
      
      const response = await this.axiosInstance.get<ApiResponse<PagedResponse<Mood>>>(
        '/api/moods/list',
        { params }
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data?.content?.length || 0} moods`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách moods')
    } catch (error) {
      console.error('❌ Error fetching moods:', error)
      throw error
    }
  }

  // Lấy chi tiết mood
  async getMoodById(id: string): Promise<ApiResponse<Mood>> {
    try {
      console.log('📡 Fetching mood details:', id)
      
      const response = await this.axiosInstance.get<ApiResponse<Mood>>(
        `/api/moods/${id}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Fetched mood details successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải chi tiết mood')
    } catch (error) {
      console.error('❌ Error fetching mood details:', error)
      throw error
    }
  }

  // Tạo mood mới
  async createMood(data: CreateMoodDto): Promise<ApiResponse<Mood>> {
    try {
      console.log('📤 Creating new mood:', data)
      
      const response = await this.axiosInstance.post<ApiResponse<Mood>>(
        '/api/moods/create',
        data
      )
      
      if (response.data.status === 200) {
        console.log('✅ Mood created successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tạo mood')
    } catch (error) {
      console.error('❌ Error creating mood:', error)
      throw error
    }
  }

  // Cập nhật mood
  async updateMood(id: string, data: UpdateMoodDto): Promise<ApiResponse<Mood>> {
    try {
      console.log('📤 Updating mood:', id, data)
      
      const response = await this.axiosInstance.put<ApiResponse<Mood>>(
        `/api/moods/edit/${id}`,
        data
      )
      
      if (response.data.status === 200) {
        console.log('✅ Mood updated successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể cập nhật mood')
    } catch (error) {
      console.error('❌ Error updating mood:', error)
      throw error
    }
  }

  // Xóa mood
  async deleteMood(id: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Deleting mood:', id)
      
      const response = await this.axiosInstance.delete<ApiResponse<void>>(
        `/api/moods/delete/${id}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Mood deleted successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể xóa mood')
    } catch (error) {
      console.error('❌ Error deleting mood:', error)
      throw error
    }
  }

  // Lấy thống kê moods
  async getMoodStats(): Promise<ApiResponse<MoodStats>> {
    try {
      console.log('📡 Fetching mood statistics')
      
      const response = await this.axiosInstance.get<ApiResponse<MoodStats>>(
        '/api/moods/statistics'
      )
      
      if (response.data.status === 200) {
        console.log('✅ Fetched mood statistics successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê moods')
    } catch (error) {
      console.error('❌ Error fetching mood statistics:', error)
      throw error
    }
  }
}

// Export singleton instance
export const moodsApi = new MoodsApiService(adminApi.axiosInstance)
export default moodsApi
