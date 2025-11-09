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

  // GET /api/admin/moods - Lấy toàn bộ moods (tương thích với MoodsList)
  async getMoods(params: MoodListParams = {}): Promise<ApiResponse<PagedResponse<Mood>>> {
    try {
      console.log('📡 Fetching all moods:', params)
      
      const response = await this.axiosInstance.get<ApiResponse<Mood[]>>(
        '/api/admin/moods'
      )
      
      if (response.data.status === 200) {
        // Backend trả về List<AdminMoodResponse>, convert sang PagedResponse
        const moods = response.data.data || []
        
        // Apply client-side filtering if needed
        let filteredMoods = moods
        
        if (params.search) {
          const searchLower = params.search.toLowerCase()
          filteredMoods = filteredMoods.filter(m => 
            m.name?.toLowerCase().includes(searchLower) ||
            m.emoji?.includes(searchLower)
          )
        }
        
        // Client-side sorting
        if (params.sortBy) {
          filteredMoods.sort((a, b) => {
            let aVal: any = a[params.sortBy as keyof Mood]
            let bVal: any = b[params.sortBy as keyof Mood]
            
            if (aVal == null) aVal = ''
            if (bVal == null) bVal = ''
            
            if (typeof aVal === 'string') {
              aVal = aVal.toLowerCase()
              bVal = bVal.toLowerCase()
            }
            
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
            return params.order === 'desc' ? -comparison : comparison
          })
        }
        
        // Client-side pagination
        const page = params.page || 0
        const size = params.size || 10
        const startIndex = page * size
        const endIndex = startIndex + size
        const paginatedData = filteredMoods.slice(startIndex, endIndex)
        
        const pagedResponse: PagedResponse<Mood> = {
          content: paginatedData,
          totalElements: filteredMoods.length,
          totalPages: Math.ceil(filteredMoods.length / size),
          size: size,
          number: page
        }
        
        console.log(`✅ Fetched ${paginatedData.length} moods (${filteredMoods.length} total)`)
        return {
          status: 200,
          message: 'Success',
          data: pagedResponse
        }
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách moods')
    } catch (error: any) {
      console.error('❌ Error fetching moods:', error)
      // Return empty response instead of throwing to prevent page crash
      return {
        status: 200,
        message: 'Success',
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: params.size || 10,
          number: params.page || 0
        }
      }
    }
  }

  // GET /api/admin/moods/{id} - Lấy chi tiết mood
  async getMoodById(id: string): Promise<ApiResponse<Mood>> {
    try {
      console.log('📡 Fetching mood details:', id)
      
      const response = await this.axiosInstance.get<ApiResponse<Mood>>(
        `/api/admin/moods/${id}`
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
