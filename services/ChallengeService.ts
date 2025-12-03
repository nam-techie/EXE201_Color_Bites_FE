import { API_ENDPOINTS } from '@/constants'
import type {
   ChallengeDefinitionResponse,
   ChallengeDetailResponse,
   ChallengeEntryResponse,
   ChallengeParticipationResponse,
   ChallengeType,
   CreateChallengeRequest,
   PaginatedEntryResponse,
   PaginatedParticipationResponse,
   ParticipationStatus,
   SubmitChallengeEntryRequest,
} from '@/type'
import { apiService } from './ApiService'

export class ChallengeService {
   /**
    * Lấy danh sách thử thách đang hoạt động
    * GET /api/challenges
    */
   async getActiveChallenges(): Promise<ChallengeDetailResponse[]> {
      try {
         console.log('Fetching active challenges...')
         const response = await apiService.get<ChallengeDetailResponse[]>(
            API_ENDPOINTS.CHALLENGES.LIST
         )

         if (response.status === 200 && response.data) {
            console.log('Active challenges fetched:', response.data.length)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải danh sách thử thách')
      } catch (error) {
         console.error('Error fetching active challenges:', error)
         return []
      }
   }

   /**
    * Lấy thông tin chi tiết thử thách theo ID
    * GET /api/challenges/{id}
    */
   async getChallengeById(id: string): Promise<ChallengeDefinitionResponse | null> {
      try {
         console.log('Fetching challenge by ID:', id)
         const response = await apiService.get<ChallengeDefinitionResponse>(
            `${API_ENDPOINTS.CHALLENGES.BY_ID}/${id}`
         )

         if (response.status === 200 && response.data) {
            console.log('Challenge fetched:', response.data.title)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải thông tin thử thách')
      } catch (error) {
         console.error('Error fetching challenge by ID:', error)
         return null
      }
   }

   /**
    * Lấy danh sách thử thách theo loại
    * GET /api/challenges/type/{type}
    */
   async getChallengesByType(type: ChallengeType): Promise<ChallengeDefinitionResponse[]> {
      try {
         console.log('Fetching challenges by type:', type)
         const response = await apiService.get<ChallengeDefinitionResponse[]>(
            `${API_ENDPOINTS.CHALLENGES.BY_TYPE}/${type}`
         )

         if (response.status === 200 && response.data) {
            console.log('Challenges by type fetched:', response.data.length)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải thử thách theo loại')
      } catch (error) {
         console.error('Error fetching challenges by type:', error)
         return []
      }
   }

   /**
    * Lấy danh sách thử thách theo nhà hàng
    * GET /api/challenges/restaurant/{restaurantId}
    */
   async getChallengesByRestaurant(restaurantId: string): Promise<ChallengeDefinitionResponse[]> {
      try {
         console.log('Fetching challenges by restaurant:', restaurantId)
         const response = await apiService.get<ChallengeDefinitionResponse[]>(
            `${API_ENDPOINTS.CHALLENGES.BY_RESTAURANT}/${restaurantId}`
         )

         if (response.status === 200 && response.data) {
            console.log('Challenges by restaurant fetched:', response.data.length)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải thử thách theo nhà hàng')
      } catch (error) {
         console.error('Error fetching challenges by restaurant:', error)
         return []
      }
   }

   /**
    * Tạo thử thách mới
    * POST /api/challenges
    * Yêu cầu: User phải có quyền (Premium/Partner)
    */
   async createChallenge(data: CreateChallengeRequest): Promise<ChallengeDefinitionResponse> {
      try {
         console.log('Creating new challenge:', data.title)
         const response = await apiService.post<ChallengeDefinitionResponse>(
            API_ENDPOINTS.CHALLENGES.LIST,
            data
         )

         if (response.status === 201 && response.data) {
            console.log('Challenge created successfully:', response.data.id)
            return response.data
         }

         // Xử lý lỗi từ server
         const errorMessage = response.message || 'Không thể tạo thử thách'
         throw new Error(errorMessage)
      } catch (error: any) {
         console.error('Error creating challenge:', error)
         
         // Kiểm tra lỗi 403 Forbidden hoặc lỗi quyền
         if (error?.response?.status === 403 || 
             error?.message?.includes('403') ||
             error?.message?.includes('permission') ||
             error?.message?.includes('quyền') ||
             error?.message?.includes('Premium') ||
             error?.message?.includes('upgrade')) {
            throw new Error('UPGRADE_REQUIRED')
         }
         
         throw error
      }
   }

   /**
    * Tham gia thử thách
    * POST /api/challenges/{challengeId}/join
    */
   async joinChallenge(challengeId: string): Promise<ChallengeParticipationResponse | null> {
      try {
         console.log('Joining challenge:', challengeId)
         const response = await apiService.post<ChallengeParticipationResponse>(
            `${API_ENDPOINTS.CHALLENGES.JOIN}/${challengeId}/join`
         )

         if (response.status === 201 && response.data) {
            console.log('Joined challenge successfully:', response.data.id)
            return response.data
         }

         throw new Error(response.message || 'Không thể tham gia thử thách')
      } catch (error) {
         console.error('Error joining challenge:', error)
         throw error
      }
   }

   /**
    * Lấy danh sách tham gia của tôi
    * GET /api/challenges/my-participations
    */
   async getMyParticipations(): Promise<ChallengeParticipationResponse[]> {
      try {
         console.log('Fetching my participations...')
         const response = await apiService.get<ChallengeParticipationResponse[]>(
            API_ENDPOINTS.CHALLENGES.MY_PARTICIPATIONS
         )

         if (response.status === 200 && response.data) {
            console.log('My participations fetched:', response.data.length)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải danh sách tham gia')
      } catch (error) {
         console.error('Error fetching my participations:', error)
         return []
      }
   }

   /**
    * Lấy danh sách tham gia có phân trang
    * GET /api/challenges/my-participations/paged
    */
   async getMyParticipationsPaged(
      page: number = 0,
      size: number = 10
   ): Promise<PaginatedParticipationResponse> {
      try {
         console.log(`Fetching my participations paged - page: ${page}, size: ${size}`)
         const response = await apiService.get<PaginatedParticipationResponse>(
            `${API_ENDPOINTS.CHALLENGES.MY_PARTICIPATIONS_PAGED}?page=${page}&size=${size}`
         )

         if (response.status === 200 && response.data) {
            console.log('My participations paged fetched:', response.data.content?.length)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải danh sách tham gia')
      } catch (error) {
         console.error('Error fetching my participations paged:', error)
         return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: size,
            number: page,
            first: true,
            last: true,
         }
      }
   }

   /**
    * Lấy thông tin tham gia theo ID
    * GET /api/challenges/participations/{participationId}
    */
   async getParticipationById(participationId: string): Promise<ChallengeParticipationResponse | null> {
      try {
         console.log('Fetching participation by ID:', participationId)
         const response = await apiService.get<ChallengeParticipationResponse>(
            `${API_ENDPOINTS.CHALLENGES.PARTICIPATION_BY_ID}/${participationId}`
         )

         if (response.status === 200 && response.data) {
            console.log('Participation fetched:', response.data.id)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải thông tin tham gia')
      } catch (error) {
         console.error('Error fetching participation by ID:', error)
         return null
      }
   }

   /**
    * Lấy danh sách tham gia theo trạng thái
    * GET /api/challenges/participations/status/{status}
    */
   async getParticipationsByStatus(status: ParticipationStatus): Promise<ChallengeParticipationResponse[]> {
      try {
         console.log('Fetching participations by status:', status)
         const response = await apiService.get<ChallengeParticipationResponse[]>(
            `${API_ENDPOINTS.CHALLENGES.PARTICIPATIONS_BY_STATUS}/${status}`
         )

         if (response.status === 200 && response.data) {
            console.log('Participations by status fetched:', response.data.length)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải tham gia theo trạng thái')
      } catch (error) {
         console.error('Error fetching participations by status:', error)
         return []
      }
   }

   /**
    * Nộp bài thử thách
    * POST /api/challenges/participations/{challengeId}/entries
    */
   async submitEntry(
      challengeId: string,
      data: SubmitChallengeEntryRequest
   ): Promise<ChallengeEntryResponse | null> {
      try {
         console.log('Submitting entry for challenge:', challengeId)
         const response = await apiService.post<ChallengeEntryResponse>(
            `${API_ENDPOINTS.CHALLENGES.ENTRIES_BY_PARTICIPATION}/${challengeId}/entries`,
            data
         )

         if (response.status === 201 && response.data) {
            console.log('Entry submitted successfully:', response.data.id)
            return response.data
         }

         throw new Error(response.message || 'Không thể nộp bài thử thách')
      } catch (error) {
         console.error('Error submitting entry:', error)
         throw error
      }
   }

   /**
    * Lấy bài nộp theo ID
    * GET /api/challenges/entries/{entryId}
    */
   async getEntryById(entryId: string): Promise<ChallengeEntryResponse | null> {
      try {
         console.log('Fetching entry by ID:', entryId)
         const response = await apiService.get<ChallengeEntryResponse>(
            `${API_ENDPOINTS.CHALLENGES.ENTRIES}/${entryId}`
         )

         if (response.status === 200 && response.data) {
            console.log('Entry fetched:', response.data.id)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải bài nộp')
      } catch (error) {
         console.error('Error fetching entry by ID:', error)
         return null
      }
   }

   /**
    * Lấy danh sách bài nộp theo participation
    * GET /api/challenges/participations/{participationId}/entries
    */
   async getEntriesByParticipation(participationId: string): Promise<ChallengeEntryResponse[]> {
      try {
         console.log('Fetching entries by participation:', participationId)
         const response = await apiService.get<ChallengeEntryResponse[]>(
            `${API_ENDPOINTS.CHALLENGES.ENTRIES_BY_PARTICIPATION}/${participationId}/entries`
         )

         if (response.status === 200 && response.data) {
            console.log('Entries fetched:', response.data.length)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải danh sách bài nộp')
      } catch (error) {
         console.error('Error fetching entries by participation:', error)
         return []
      }
   }

   /**
    * Lấy danh sách bài nộp có phân trang
    * GET /api/challenges/participations/{participationId}/entries/paged
    */
   async getEntriesByParticipationPaged(
      participationId: string,
      page: number = 0,
      size: number = 10
   ): Promise<PaginatedEntryResponse> {
      try {
         console.log(`Fetching entries paged - participation: ${participationId}, page: ${page}`)
         const response = await apiService.get<PaginatedEntryResponse>(
            `${API_ENDPOINTS.CHALLENGES.ENTRIES_BY_PARTICIPATION}/${participationId}/entries/paged?page=${page}&size=${size}`
         )

         if (response.status === 200 && response.data) {
            console.log('Entries paged fetched:', response.data.content?.length)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải danh sách bài nộp')
      } catch (error) {
         console.error('Error fetching entries paged:', error)
         return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: size,
            number: page,
            first: true,
            last: true,
         }
      }
   }

   /**
    * Lấy số lượng bài nộp của participation
    * GET /api/challenges/participations/{participationId}/entries/count
    */
   async getEntryCount(participationId: string): Promise<number> {
      try {
         console.log('Fetching entry count for participation:', participationId)
         const response = await apiService.get<number>(
            `${API_ENDPOINTS.CHALLENGES.ENTRIES_BY_PARTICIPATION}/${participationId}/entries/count`
         )

         if (response.status === 200 && response.data !== undefined) {
            console.log('Entry count:', response.data)
            return response.data
         }

         throw new Error(response.message || 'Không thể lấy số lượng bài nộp')
      } catch (error) {
         console.error('Error fetching entry count:', error)
         return 0
      }
   }

   /**
    * Lấy số lượng bài nộp đã duyệt
    * GET /api/challenges/participations/{participationId}/entries/approved-count
    */
   async getApprovedEntryCount(participationId: string): Promise<number> {
      try {
         console.log('Fetching approved entry count for participation:', participationId)
         const response = await apiService.get<number>(
            `${API_ENDPOINTS.CHALLENGES.ENTRIES_BY_PARTICIPATION}/${participationId}/entries/approved-count`
         )

         if (response.status === 200 && response.data !== undefined) {
            console.log('Approved entry count:', response.data)
            return response.data
         }

         throw new Error(response.message || 'Không thể lấy số lượng bài đã duyệt')
      } catch (error) {
         console.error('Error fetching approved entry count:', error)
         return 0
      }
   }

   /**
    * Xóa bài nộp
    * DELETE /api/challenges/entries/{entryId}
    */
   async deleteEntry(entryId: string): Promise<void> {
      try {
         console.log('Deleting entry:', entryId)
         const response = await apiService.delete<void>(
            `${API_ENDPOINTS.CHALLENGES.ENTRIES}/${entryId}`
         )

         if (response.status === 200) {
            console.log('Entry deleted successfully')
            return
         }

         throw new Error(response.message || 'Không thể xóa bài nộp')
      } catch (error) {
         console.error('Error deleting entry:', error)
         throw error
      }
   }
}

// Export singleton instance
export const challengeService = new ChallengeService()
export default challengeService

