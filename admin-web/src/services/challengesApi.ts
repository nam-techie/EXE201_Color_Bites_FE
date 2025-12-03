import type {
   Challenge,
   ChallengeEntry,
   ChallengeListParams,
   ChallengeParticipation,
   ChallengeStats,
   ChallengeType,
   CreateChallengeDto,
   EntryStatus,
   UpdateChallengeDto
} from '../types/challenge'
import type { ApiResponse, PagedResponse } from '../types/user'
import { adminApi } from './adminApi'

class ChallengesApiService {
   // Base URLs
   private baseURL = '/api/challenges'
   private adminBaseURL = '/api/admin/challenges' // Endpoint cho admin lấy tất cả challenges

   /**
    * GET /api/admin/challenges - Lấy tất cả challenges cho admin (bao gồm cả inactive)
    * GET /api/challenges - Chỉ lấy challenges đang hoạt động (cho user)
    */
   async getChallenges(params: ChallengeListParams = {}): Promise<ApiResponse<PagedResponse<Challenge>>> {
      try {
         console.log('📥 Fetching all challenges for admin:', params)

         // Dùng endpoint admin để lấy tất cả challenges
         const response = await adminApi.axiosInstance.get<ApiResponse<any[]>>(
            this.adminBaseURL
         )

         if (response.data.status === 200) {
            const rawChallenges = response.data.data || []

            // Map từ ChallengeDefinitionResponse sang Challenge
            const challenges: Challenge[] = rawChallenges.map((raw: any) => {
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

               return {
                  id: raw.id || '',
                  title: raw.title || '',
                  description: raw.description || '',
                  challengeType: raw.challengeType || 'PARTNER_LOCATION',
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
                  createdBy: raw.createdBy || '',
                  createdAt: raw.createdAt || '',
                  isActive: raw.isActive ?? false,
                  participantCount: raw.participantCount || 0
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
            if (params.challengeType) {
               filteredChallenges = filteredChallenges.filter(c => c.challengeType === params.challengeType)
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

         if (error.response?.status === 403) {
            throw error
         }

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

   /**
    * GET /api/challenges/{id} - Lấy thông tin chi tiết của một thử thách
    */
   async getChallengeById(id: string): Promise<ApiResponse<Challenge>> {
      try {
         console.log('📥 Fetching challenge details:', id)

         const response = await adminApi.axiosInstance.get<ApiResponse<any>>(
            `${this.baseURL}/${id}`
         )

         if (response.data.status === 200) {
            const raw = response.data.data

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
               challengeType: raw.challengeType || 'PARTNER_LOCATION',
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
               createdBy: raw.createdBy || '',
               createdAt: raw.createdAt || '',
               isActive: raw.isActive ?? false,
               participantCount: raw.participantCount || 0
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

   /**
    * GET /api/challenges - Lấy danh sách challenges đang hoạt động (public endpoint)
    * Dùng cho dropdown select, v.v.
    */
   async getActiveChallenges(): Promise<ApiResponse<Challenge[]>> {
      try {
         console.log('📥 Fetching active challenges')

         const response = await adminApi.axiosInstance.get<ApiResponse<any[]>>(
            this.baseURL
         )

         if (response.data.status === 200) {
            const rawChallenges = response.data.data || []

            const challenges: Challenge[] = rawChallenges.map((raw: any) => ({
               id: raw.id || '',
               title: raw.title || '',
               description: raw.description || '',
               challengeType: raw.challengeType || 'PARTNER_LOCATION',
               status: 'ACTIVE' as const,
               restaurantId: raw.restaurantId || null,
               restaurantName: raw.restaurantName || null,
               typeObjId: raw.typeObjId || null,
               typeObjName: raw.typeObjName || null,
               images: raw.images || null,
               targetCount: raw.targetCount || 0,
               startDate: raw.startDate || '',
               endDate: raw.endDate || '',
               rewardDescription: raw.rewardDescription || null,
               createdBy: raw.createdBy || '',
               createdAt: raw.createdAt || '',
               isActive: true,
               participantCount: raw.participantCount || 0
            }))

            console.log(`✅ Fetched ${challenges.length} active challenges`)
            return {
               status: 200,
               message: 'Success',
               data: challenges
            }
         }

         throw new Error(response.data.message || 'Không thể tải challenges đang hoạt động')
      } catch (error) {
         console.error('❌ Error fetching active challenges:', error)
         return {
            status: 200,
            message: 'Success',
            data: []
         }
      }
   }

   /**
    * GET /api/challenges/type/{type} - Lấy các thử thách theo loại
    */
   async getChallengesByType(type: ChallengeType): Promise<ApiResponse<Challenge[]>> {
      try {
         console.log('📥 Fetching challenges by type:', type)

         const response = await adminApi.axiosInstance.get<ApiResponse<any[]>>(
            `${this.baseURL}/type/${type}`
         )

         if (response.data.status === 200) {
            console.log(`✅ Fetched ${response.data.data?.length || 0} challenges by type`)
            return response.data
         }

         throw new Error(response.data.message || 'Không thể tải thử thách theo loại')
      } catch (error) {
         console.error('❌ Error fetching challenges by type:', error)
         throw error
      }
   }

   /**
    * GET /api/challenges/restaurant/{restaurantId} - Lấy các thử thách của nhà hàng
    */
   async getChallengesByRestaurant(restaurantId: string): Promise<ApiResponse<Challenge[]>> {
      try {
         console.log('📥 Fetching challenges by restaurant:', restaurantId)

         const response = await adminApi.axiosInstance.get<ApiResponse<any[]>>(
            `${this.baseURL}/restaurant/${restaurantId}`
         )

         if (response.data.status === 200) {
            console.log(`✅ Fetched ${response.data.data?.length || 0} challenges by restaurant`)
            return response.data
         }

         throw new Error(response.data.message || 'Không thể tải thử thách theo nhà hàng')
      } catch (error) {
         console.error('❌ Error fetching challenges by restaurant:', error)
         throw error
      }
   }

   /**
    * POST /api/challenges - Tạo thử thách mới
    * Request body theo CreateChallengeDefinitionRequest:
    * - title: string (2-200 ký tự, bắt buộc)
    * - description: string (tối đa 1000 ký tự)
    * - challengeType: PARTNER_LOCATION | THEME_COUNT (bắt buộc)
    * - restaurantId: string (bắt buộc nếu type = PARTNER_LOCATION)
    * - typeObjId: string (bắt buộc nếu type = THEME_COUNT)
    * - images: ImageObject[]
    * - targetCount: number >= 1 (bắt buộc)
    * - startDate: ISO datetime string (phải trong tương lai, bắt buộc)
    * - durationDay: number (số ngày, bắt buộc)
    * - rewardDescription: string (tối đa 500 ký tự)
    */
   async createChallenge(data: CreateChallengeDto): Promise<ApiResponse<Challenge>> {
      try {
         console.log('📤 Creating new challenge with data:', JSON.stringify(data, null, 2))

         // Validate required fields
         if (!data.title || !data.challengeType || !data.targetCount || !data.startDate || !data.durationDay) {
            throw new Error('Thiếu thông tin bắt buộc: title, challengeType, targetCount, startDate, durationDay')
         }

         // Validate conditional fields
         if (data.challengeType === 'PARTNER_LOCATION' && !data.restaurantId) {
            throw new Error('restaurantId là bắt buộc khi challengeType = PARTNER_LOCATION')
         }
         if (data.challengeType === 'THEME_COUNT' && !data.typeObjId) {
            throw new Error('typeObjId là bắt buộc khi challengeType = THEME_COUNT')
         }

         const response = await adminApi.axiosInstance.post<ApiResponse<Challenge>>(
            this.baseURL,
            data
         )

         console.log('📥 Create challenge response:', response.data)

         if (response.data.status === 201 || response.data.status === 200) {
            console.log('✅ Challenge created successfully:', response.data.data)
            return response.data
         }

         throw new Error(response.data.message || 'Không thể tạo challenge')
      } catch (error: any) {
         console.error('❌ Error creating challenge:', error)
         console.error('❌ Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
         })
         throw error
      }
   }

   /**
    * PUT /api/challenges/{id} - Cập nhật thử thách
    */
   async updateChallenge(id: string, data: UpdateChallengeDto): Promise<ApiResponse<Challenge>> {
      try {
         console.log('📤 Updating challenge:', id, data)

         const response = await adminApi.axiosInstance.put<ApiResponse<Challenge>>(
            `${this.baseURL}/${id}`,
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

   /**
    * DELETE /api/challenges/{id} - Xóa thử thách
    */
   async deleteChallenge(id: string): Promise<ApiResponse<void>> {
      try {
         console.log('📤 Deleting challenge:', id)

         const response = await adminApi.axiosInstance.delete<ApiResponse<void>>(
            `${this.baseURL}/${id}`
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

   /**
    * PUT /api/challenges/{id}/activate - Kích hoạt thử thách
    */
   async activateChallenge(id: string): Promise<ApiResponse<void>> {
      try {
         console.log('📤 Activating challenge:', id)

         const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
            `${this.baseURL}/${id}/activate`
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

   /**
    * PUT /api/challenges/{id}/deactivate - Vô hiệu hóa thử thách
    */
   async deactivateChallenge(id: string): Promise<ApiResponse<void>> {
      try {
         console.log('📤 Deactivating challenge:', id)

         const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
            `${this.baseURL}/${id}/deactivate`
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

   /**
    * GET /api/challenges/participations/{participationId}/entries - Lấy danh sách bài nộp theo participation
    */
   async getEntriesByParticipation(participationId: string, params: { page?: number; size?: number } = {}): Promise<ApiResponse<PagedResponse<ChallengeEntry>>> {
      try {
         console.log('📥 Fetching entries by participation:', participationId, params)

         const response = await adminApi.axiosInstance.get<ApiResponse<PagedResponse<ChallengeEntry>>>(
            `${this.baseURL}/participations/${participationId}/entries`,
            { params }
         )

         if (response.data.status === 200) {
            console.log(`✅ Fetched ${response.data.data?.content?.length || 0} entries`)
            return response.data
         }

         throw new Error(response.data.message || 'Không thể tải danh sách bài nộp')
      } catch (error) {
         console.error('❌ Error fetching entries by participation:', error)
         throw error
      }
   }

   /**
    * GET /api/challenges/entries/status/{status} - Lấy bài nộp theo trạng thái
    */
   async getEntriesByStatus(status: EntryStatus, params: { page?: number; size?: number } = {}): Promise<ApiResponse<PagedResponse<ChallengeEntry>>> {
      try {
         console.log('📥 Fetching entries by status:', status, params)

         const response = await adminApi.axiosInstance.get<ApiResponse<PagedResponse<ChallengeEntry>>>(
            `${this.baseURL}/entries/status/${status}`,
            { params }
         )

         if (response.data.status === 200) {
            console.log(`✅ Fetched ${response.data.data?.content?.length || 0} entries by status`)
            return response.data
         }

         throw new Error(response.data.message || 'Không thể tải bài nộp theo trạng thái')
      } catch (error) {
         console.error('❌ Error fetching entries by status:', error)
         throw error
      }
   }

   /**
    * GET /api/challenges/entries/{entryId} - Lấy bài nộp theo ID
    */
   async getEntryById(entryId: string): Promise<ApiResponse<ChallengeEntry>> {
      try {
         console.log('📥 Fetching entry by ID:', entryId)

         const response = await adminApi.axiosInstance.get<ApiResponse<ChallengeEntry>>(
            `${this.baseURL}/entries/${entryId}`
         )

         if (response.data.status === 200) {
            console.log('✅ Fetched entry successfully')
            return response.data
         }

         throw new Error(response.data.message || 'Không thể tải bài nộp')
      } catch (error) {
         console.error('❌ Error fetching entry by ID:', error)
         throw error
      }
   }

   /**
    * PUT /api/challenges/entries/{entryId}/approve - Duyệt bài nộp
    */
   async approveEntry(entryId: string): Promise<ApiResponse<ChallengeEntry>> {
      try {
         console.log('📤 Approving entry:', entryId)

         const response = await adminApi.axiosInstance.put<ApiResponse<ChallengeEntry>>(
            `${this.baseURL}/entries/${entryId}/approve`
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

   /**
    * PUT /api/challenges/entries/{entryId}/reject - Từ chối bài nộp
    */
   async rejectEntry(entryId: string): Promise<ApiResponse<ChallengeEntry>> {
      try {
         console.log('📤 Rejecting entry:', entryId)

         const response = await adminApi.axiosInstance.put<ApiResponse<ChallengeEntry>>(
            `${this.baseURL}/entries/${entryId}/reject`
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

   /**
    * DELETE /api/challenges/entries/{entryId} - Xóa bài nộp
    */
   async deleteEntry(entryId: string): Promise<ApiResponse<void>> {
      try {
         console.log('📤 Deleting entry:', entryId)

         const response = await adminApi.axiosInstance.delete<ApiResponse<void>>(
            `${this.baseURL}/entries/${entryId}`
         )

         if (response.data.status === 200) {
            console.log('✅ Entry deleted successfully')
            return response.data
         }

         throw new Error(response.data.message || 'Không thể xóa bài nộp')
      } catch (error) {
         console.error('❌ Error deleting entry:', error)
         throw error
      }
   }

   /**
    * GET /api/challenges/participations/{participationId}/entries/count - Lấy số lượng bài nộp
    */
   async getEntryCount(participationId: string): Promise<ApiResponse<number>> {
      try {
         console.log('📥 Fetching entry count:', participationId)

         const response = await adminApi.axiosInstance.get<ApiResponse<number>>(
            `${this.baseURL}/participations/${participationId}/entries/count`
         )

         if (response.data.status === 200) {
            console.log('✅ Entry count:', response.data.data)
            return response.data
         }

         throw new Error(response.data.message || 'Không thể lấy số lượng bài nộp')
      } catch (error) {
         console.error('❌ Error fetching entry count:', error)
         throw error
      }
   }

   /**
    * GET /api/challenges/participations/{participationId}/entries/approved-count - Lấy số lượng bài đã duyệt
    */
   async getApprovedEntryCount(participationId: string): Promise<ApiResponse<number>> {
      try {
         console.log('📥 Fetching approved entry count:', participationId)

         const response = await adminApi.axiosInstance.get<ApiResponse<number>>(
            `${this.baseURL}/participations/${participationId}/entries/approved-count`
         )

         if (response.data.status === 200) {
            console.log('✅ Approved entry count:', response.data.data)
            return response.data
         }

         throw new Error(response.data.message || 'Không thể lấy số lượng bài đã duyệt')
      } catch (error) {
         console.error('❌ Error fetching approved entry count:', error)
         throw error
      }
   }

   /**
    * GET /api/challenges/my-participations - Lấy danh sách tham gia (cho admin view)
    */
   async getParticipations(params: { page?: number; size?: number } = {}): Promise<ApiResponse<PagedResponse<ChallengeParticipation>>> {
      try {
         console.log('📥 Fetching participations:', params)

         const response = await adminApi.axiosInstance.get<ApiResponse<PagedResponse<ChallengeParticipation>>>(
            `${this.baseURL}/my-participations/paged`,
            { params }
         )

         if (response.data.status === 200) {
            console.log(`✅ Fetched ${response.data.data?.content?.length || 0} participations`)
            return response.data
         }

         throw new Error(response.data.message || 'Không thể tải danh sách tham gia')
      } catch (error) {
         console.error('❌ Error fetching participations:', error)
         throw error
      }
   }

   /**
    * Lấy thống kê challenges
    */
   async getChallengeStats(): Promise<ApiResponse<ChallengeStats>> {
      try {
         console.log('📥 Fetching challenge statistics')

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
