import { API_ENDPOINTS } from '@/constants'
import type { Mood, MoodListResponse, MoodResponse } from '@/type'
import { apiService } from './ApiService'

export class MoodService {
   /**
    * Lấy danh sách tất cả moods (fetch tất cả pages)
    */
   async getAllMoods(): Promise<Mood[]> {
      try {
         console.log('🔄 Fetching all moods from API...')
         
         // Bắt đầu với page đầu tiên để biết tổng số pages
         const firstPageResponse = await this.getMoodsPaginated(1, 50) // Lấy 50 items per page
         
         if (!firstPageResponse) {
            console.log('⚠️ No response from API, using fallback moods')
            return this.getDefaultMoods()
         }
         
         let allMoods: Mood[] = this.transformMoodResponses(firstPageResponse.content)
         
         // Nếu có nhiều pages, fetch các pages còn lại
         if (firstPageResponse.totalPages > 1) {
            console.log(`📄 Total pages: ${firstPageResponse.totalPages}, fetching remaining pages...`)
            
            const remainingPagePromises: Promise<MoodListResponse | null>[] = []
            for (let page = 2; page <= firstPageResponse.totalPages; page++) {
               remainingPagePromises.push(this.getMoodsPaginated(page, 50))
            }
            
            const remainingPagesResponses = await Promise.allSettled(remainingPagePromises)
            
            // Combine tất cả results
            remainingPagesResponses.forEach((result, index) => {
               if (result.status === 'fulfilled' && result.value) {
                  const transformedMoods = this.transformMoodResponses(result.value.content)
                  allMoods = allMoods.concat(transformedMoods)
                  console.log(`✅ Page ${index + 2} fetched: ${transformedMoods.length} moods`)
               } else {
                  console.error(`❌ Failed to fetch page ${index + 2}:`, result.status === 'rejected' ? result.reason : 'No data')
               }
            })
         }
         
         console.log(`✅ Successfully fetched ${allMoods.length} moods from API`)
         return allMoods
         
      } catch (error) {
         console.error('❌ Error fetching moods from API, using fallback:', error)
         // Return default moods as fallback - không show toast error để không làm phiền user
         return this.getDefaultMoods()
      }
   }

   /**
    * Lấy moods với phân trang (internal method)
    */
   private async getMoodsPaginated(page: number = 1, size: number = 10): Promise<MoodListResponse | null> {
      try {
         console.log(`📡 Fetching moods - Page: ${page}, Size: ${size}`)
         
         const response = await apiService.get<MoodListResponse>(
            `${API_ENDPOINTS.MOODS.LIST}?page=${page}&size=${size}`
         )
         
         if (response.statusCode === 200 && response.data) {
            console.log(`✅ Page ${page} fetched: ${response.data.content.length} moods`)
            return response.data
         }
         
         console.log(`⚠️ Invalid response for page ${page}:`, response)
         return null
         
      } catch (error) {
         console.error(`❌ Error fetching page ${page}:`, error)
         return null
      }
   }

   /**
    * Transform MoodResponse[] thành Mood[] 
    */
   private transformMoodResponses(moodResponses: MoodResponse[]): Mood[] {
      return moodResponses.map(moodResponse => ({
         id: moodResponse.id,
         name: moodResponse.name,
         emoji: moodResponse.emoji,
         createdAt: moodResponse.createdAt,
         postCount: moodResponse.postCount,
         // Tạo description từ name nếu backend không có
         description: `Cảm xúc ${moodResponse.name.toLowerCase()}`
      }))
   }

   /**
    * Lấy moods với phân trang (public method cho UI components)
    * @param page Page number (1-based)
    * @param size Page size
    * @returns Promise với MoodListResponse hoặc null nếu lỗi
    */
   async getMoodsWithPagination(page: number = 1, size: number = 10): Promise<MoodListResponse | null> {
      return this.getMoodsPaginated(page, size)
   }

   /**
    * Default moods as fallback
    */
   private getDefaultMoods(): Mood[] {
      return [
         { id: '1', name: 'Delicious', emoji: '😋', description: 'Ngon tuyệt vời' },
         { id: '2', name: 'Amazing', emoji: '🔥', description: 'Tuyệt vời' },
         { id: '3', name: 'Love it', emoji: '❤️', description: 'Yêu thích' },
         { id: '4', name: 'Perfect', emoji: '😍', description: 'Hoàn hảo' },
         { id: '5', name: 'Craving', emoji: '🤤', description: 'Thèm thuồng' },
         { id: '6', name: 'Excellent', emoji: '👌', description: 'Xuất sắc' },
         { id: '7', name: 'Outstanding', emoji: '💯', description: 'Nổi bật' },
         { id: '8', name: 'Celebration', emoji: '🎉', description: 'Ăn mừng' },
      ]
   }
}

// Export singleton instance
export const moodService = new MoodService()
export default moodService
