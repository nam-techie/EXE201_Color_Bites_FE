import { AxiosInstance } from 'axios'
import type {
    Challenge,
    ChallengeEntry,
    ChallengeListParams,
    ChallengeStats,
    CreateChallengeDto,
    UpdateChallengeDto
} from '../types/challenge'
import type { ApiResponse, PagedResponse } from '../types/user'
import { adminApi } from './adminApi'

class ChallengesApiService {
  constructor(private axiosInstance: AxiosInstance) {}

  // Lấy danh sách challenges với pagination
  async getChallenges(params: ChallengeListParams = {}): Promise<ApiResponse<PagedResponse<Challenge>>> {
    try {
      console.log('📡 Fetching challenges list:', params)
      
      const response = await this.axiosInstance.get<ApiResponse<PagedResponse<Challenge>>>(
        '/api/challenges',
        { params }
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data?.content?.length || 0} challenges`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách challenges')
    } catch (error) {
      console.error('❌ Error fetching challenges:', error)
      throw error
    }
  }

  // Lấy chi tiết challenge
  async getChallengeById(id: string): Promise<ApiResponse<Challenge>> {
    try {
      console.log('📡 Fetching challenge details:', id)
      
      const response = await this.axiosInstance.get<ApiResponse<Challenge>>(
        `/api/challenges/${id}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Fetched challenge details successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải chi tiết challenge')
    } catch (error) {
      console.error('❌ Error fetching challenge details:', error)
      throw error
    }
  }

  // Tạo challenge mới
  async createChallenge(data: CreateChallengeDto): Promise<ApiResponse<Challenge>> {
    try {
      console.log('📤 Creating new challenge:', data)
      
      const response = await this.axiosInstance.post<ApiResponse<Challenge>>(
        '/api/challenges',
        data
      )
      
      if (response.data.status === 200) {
        console.log('✅ Challenge created successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tạo challenge')
    } catch (error) {
      console.error('❌ Error creating challenge:', error)
      throw error
    }
  }

  // Cập nhật challenge
  async updateChallenge(id: string, data: UpdateChallengeDto): Promise<ApiResponse<Challenge>> {
    try {
      console.log('📤 Updating challenge:', id, data)
      
      const response = await this.axiosInstance.put<ApiResponse<Challenge>>(
        `/api/challenges/${id}`,
        data
      )
      
      if (response.data.status === 200) {
        console.log('✅ Challenge updated successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể cập nhật challenge')
    } catch (error) {
      console.error('❌ Error updating challenge:', error)
      throw error
    }
  }

  // Xóa challenge
  async deleteChallenge(id: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Deleting challenge:', id)
      
      const response = await this.axiosInstance.delete<ApiResponse<void>>(
        `/api/challenges/${id}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Challenge deleted successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể xóa challenge')
    } catch (error) {
      console.error('❌ Error deleting challenge:', error)
      throw error
    }
  }

  // Kích hoạt challenge
  async activateChallenge(id: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Activating challenge:', id)
      
      const response = await this.axiosInstance.put<ApiResponse<void>>(
        `/api/challenges/${id}/activate`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Challenge activated successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể kích hoạt challenge')
    } catch (error) {
      console.error('❌ Error activating challenge:', error)
      throw error
    }
  }

  // Vô hiệu hóa challenge
  async deactivateChallenge(id: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Deactivating challenge:', id)
      
      const response = await this.axiosInstance.put<ApiResponse<void>>(
        `/api/challenges/${id}/deactivate`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Challenge deactivated successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể vô hiệu hóa challenge')
    } catch (error) {
      console.error('❌ Error deactivating challenge:', error)
      throw error
    }
  }

  // Lấy danh sách bài nộp của challenge
  async getChallengeEntries(challengeId: string, params: { page?: number; size?: number } = {}): Promise<ApiResponse<PagedResponse<ChallengeEntry>>> {
    try {
      console.log('📡 Fetching challenge entries:', challengeId, params)
      
      const response = await this.axiosInstance.get<ApiResponse<PagedResponse<ChallengeEntry>>>(
        `/api/challenges/${challengeId}/entries`,
        { params }
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data?.content?.length || 0} entries`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách bài nộp')
    } catch (error) {
      console.error('❌ Error fetching challenge entries:', error)
      throw error
    }
  }

  // Duyệt bài nộp
  async approveEntry(entryId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Approving entry:', entryId)
      
      const response = await this.axiosInstance.put<ApiResponse<void>>(
        `/api/challenges/entries/${entryId}/approve`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Entry approved successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể duyệt bài nộp')
    } catch (error) {
      console.error('❌ Error approving entry:', error)
      throw error
    }
  }

  // Từ chối bài nộp
  async rejectEntry(entryId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Rejecting entry:', entryId)
      
      const response = await this.axiosInstance.put<ApiResponse<void>>(
        `/api/challenges/entries/${entryId}/reject`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Entry rejected successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể từ chối bài nộp')
    } catch (error) {
      console.error('❌ Error rejecting entry:', error)
      throw error
    }
  }

  // Lấy thống kê challenges
  async getChallengeStats(): Promise<ApiResponse<ChallengeStats>> {
    try {
      console.log('📡 Fetching challenge statistics')
      
      const response = await this.axiosInstance.get<ApiResponse<ChallengeStats>>(
        '/api/admin/statistics/challenges'
      )
      
      if (response.data.status === 200) {
        console.log('✅ Fetched challenge statistics successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê challenges')
    } catch (error) {
      console.error('❌ Error fetching challenge statistics:', error)
      throw error
    }
  }
}

// Export singleton instance
export const challengesApi = new ChallengesApiService(adminApi.axiosInstance)
export default challengesApi
