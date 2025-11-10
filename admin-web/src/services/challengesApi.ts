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
  private baseURL = '/api/admin/challenges'

  // GET /api/admin/challenges - Lấy toàn bộ challenges (tương thích với ChallengesList)
  async getChallenges(params: ChallengeListParams = {}): Promise<ApiResponse<PagedResponse<Challenge>>> {
    try {
      console.log('📡 Fetching all challenges:', params)
      
      // Gọi API giống như postsApi - interceptor sẽ tự động thêm token
      const response = await adminApi.axiosInstance.get<ApiResponse<any[]>>(
        this.baseURL
      )
      
      if (response.data.status === 200) {
        // Backend trả về List<ChallengeDefinitionResponse>, map sang Challenge interface
        const rawChallenges = response.data.data || []
        
        // Map từ ChallengeDefinitionResponse sang Challenge
        const challenges: Challenge[] = rawChallenges.map((raw: any) => {
          // Map challengeType sang type (nếu cần)
          let mappedType: 'FOOD_CHALLENGE' | 'PHOTO_CHALLENGE' | 'REVIEW_CHALLENGE' | 'SOCIAL_CHALLENGE' = 'FOOD_CHALLENGE'
          if (raw.challengeType) {
            // Map các challengeType từ backend sang type trong frontend
            const typeMap: Record<string, 'FOOD_CHALLENGE' | 'PHOTO_CHALLENGE' | 'REVIEW_CHALLENGE' | 'SOCIAL_CHALLENGE'> = {
              'FOOD_CHALLENGE': 'FOOD_CHALLENGE',
              'PHOTO_CHALLENGE': 'PHOTO_CHALLENGE',
              'REVIEW_CHALLENGE': 'REVIEW_CHALLENGE',
              'SOCIAL_CHALLENGE': 'SOCIAL_CHALLENGE',
              'PARTNER_LOCATION': 'FOOD_CHALLENGE' // Default mapping
            }
            mappedType = typeMap[raw.challengeType] || 'FOOD_CHALLENGE'
          }
          
          // Map isActive sang status
          let mappedStatus: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED' = 'INACTIVE'
          if (raw.isActive === true) {
            // Check if challenge is completed based on dates
            const now = new Date()
            const endDate = new Date(raw.endDate)
            if (endDate < now) {
              mappedStatus = 'COMPLETED'
            } else {
              mappedStatus = 'ACTIVE'
            }
          } else {
            mappedStatus = 'INACTIVE'
          }
          
          return {
            id: raw.id || '',
            title: raw.title || '',
            description: raw.description || '',
            challengeType: raw.challengeType || '',
            type: mappedType,
            status: mappedStatus,
            restaurantId: raw.restaurantId || null,
            restaurantName: raw.restaurantName || null,
            typeObjId: raw.typeObjId || null,
            typeObjName: raw.typeObjName || null,
            images: raw.images || null,
            targetCount: raw.targetCount || 0,
            startDate: raw.startDate || '',
            endDate: raw.endDate || '',
            rewardDescription: raw.rewardDescription || null,
            reward: raw.rewardDescription || null, // Alias
            createdBy: raw.createdBy || '',
            createdAt: raw.createdAt || '',
            isActive: raw.isActive ?? false,
            participantCount: raw.participantCount || 0,
            completionCount: raw.completionCount || 0
          } as Challenge
        })
        
        // Apply client-side filtering if needed
        let filteredChallenges = challenges
        
        if (params.search) {
          const searchLower = params.search.toLowerCase()
          filteredChallenges = filteredChallenges.filter(c => 
            c.title?.toLowerCase().includes(searchLower) ||
            c.description?.toLowerCase().includes(searchLower) ||
            c.restaurantName?.toLowerCase().includes(searchLower)
          )
        }
        if (params.type) {
          filteredChallenges = filteredChallenges.filter(c => c.type === params.type)
        }
        if (params.status) {
          filteredChallenges = filteredChallenges.filter(c => c.status === params.status)
        }
        
        // Client-side sorting
        if (params.sortBy) {
          filteredChallenges.sort((a, b) => {
            let aVal: any = a[params.sortBy as keyof Challenge]
            let bVal: any = b[params.sortBy as keyof Challenge]
            
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
        const paginatedData = filteredChallenges.slice(startIndex, endIndex)
        
        const pagedResponse: PagedResponse<Challenge> = {
          content: paginatedData,
          totalElements: filteredChallenges.length,
          totalPages: Math.ceil(filteredChallenges.length / size),
          size: size,
          number: page
        }
        
        console.log(`✅ Fetched ${paginatedData.length} challenges (${filteredChallenges.length} total)`)
        return {
          status: 200,
          message: 'Success',
          data: pagedResponse
        }
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách challenges')
    } catch (error: any) {
      console.error('❌ Error fetching challenges:', error)
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      })
      
      // Nếu là lỗi 403, throw error để hiển thị message cho user
      if (error.response?.status === 403) {
        throw error
      }
      
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

  // GET /api/admin/challenges/{id} - Lấy chi tiết challenge
  async getChallengeById(id: string): Promise<ApiResponse<Challenge>> {
    try {
      console.log('📡 Fetching challenge details:', id)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<any>>(
        `${this.baseURL}/${id}`
      )
      
      if (response.data.status === 200) {
        // Map từ ChallengeDefinitionResponse sang Challenge
        const raw = response.data.data
        
        // Map challengeType sang type
        let mappedType: 'FOOD_CHALLENGE' | 'PHOTO_CHALLENGE' | 'REVIEW_CHALLENGE' | 'SOCIAL_CHALLENGE' = 'FOOD_CHALLENGE'
        if (raw.challengeType) {
          const typeMap: Record<string, 'FOOD_CHALLENGE' | 'PHOTO_CHALLENGE' | 'REVIEW_CHALLENGE' | 'SOCIAL_CHALLENGE'> = {
            'FOOD_CHALLENGE': 'FOOD_CHALLENGE',
            'PHOTO_CHALLENGE': 'PHOTO_CHALLENGE',
            'REVIEW_CHALLENGE': 'REVIEW_CHALLENGE',
            'SOCIAL_CHALLENGE': 'SOCIAL_CHALLENGE',
            'PARTNER_LOCATION': 'FOOD_CHALLENGE'
          }
          mappedType = typeMap[raw.challengeType] || 'FOOD_CHALLENGE'
        }
        
        // Map isActive sang status
        let mappedStatus: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED' = 'INACTIVE'
        if (raw.isActive === true) {
          const now = new Date()
          const endDate = new Date(raw.endDate)
          if (endDate < now) {
            mappedStatus = 'COMPLETED'
          } else {
            mappedStatus = 'ACTIVE'
          }
        } else {
          mappedStatus = 'INACTIVE'
        }
        
        const challenge: Challenge = {
          id: raw.id || '',
          title: raw.title || '',
          description: raw.description || '',
          challengeType: raw.challengeType || '',
          type: mappedType,
          status: mappedStatus,
          restaurantId: raw.restaurantId || null,
          restaurantName: raw.restaurantName || null,
          typeObjId: raw.typeObjId || null,
          typeObjName: raw.typeObjName || null,
          images: raw.images || null,
          targetCount: raw.targetCount || 0,
          startDate: raw.startDate || '',
          endDate: raw.endDate || '',
          rewardDescription: raw.rewardDescription || null,
          reward: raw.rewardDescription || null,
          createdBy: raw.createdBy || '',
          createdAt: raw.createdAt || '',
          isActive: raw.isActive ?? false,
          participantCount: raw.participantCount || 0,
          completionCount: raw.completionCount || 0
        }
        
        console.log('✅ Fetched challenge details successfully')
        return {
          status: 200,
          message: 'Success',
          data: challenge
        }
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
      
      const response = await adminApi.axiosInstance.post<ApiResponse<Challenge>>(
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
      
      const response = await adminApi.axiosInstance.put<ApiResponse<Challenge>>(
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
      
      const response = await adminApi.axiosInstance.delete<ApiResponse<void>>(
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
      
      const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
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
      
      const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
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
      
      const response = await adminApi.axiosInstance.get<ApiResponse<PagedResponse<ChallengeEntry>>>(
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
      
      const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
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
      
      const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
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
      
      const response = await adminApi.axiosInstance.get<ApiResponse<ChallengeStats>>(
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
export const challengesApi = new ChallengesApiService()
export default challengesApi
