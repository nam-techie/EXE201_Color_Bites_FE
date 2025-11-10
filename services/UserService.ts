import { API_ENDPOINTS } from '@/constants'
import { apiService } from './ApiService'

// UserInformationResponse interface based on backend response
export interface UserInformationResponse {
   username: string
   accountId: string
   gender: 'MALE' | 'FEMALE' | null
   avatarUrl: string | null
   subscriptionPlan: 'FREE' | 'PREMIUM'
   bio: string | null
   createdAt: string
   updatedAt: string
}

export class UserService {
   /**
    * Lấy thông tin user đầy đủ từ backend
    */
   async getUserInformation(): Promise<UserInformationResponse> {
      try {
         console.log('👤 Fetching user information...')
         const response = await apiService.get<UserInformationResponse>(
            API_ENDPOINTS.USER_INFO.GET
         )
         
         if (response.status === 200 && response.data) {
            console.log(' User information fetched successfully:', response.data)
            return response.data
         }
         
         throw new Error(response.message || 'Không thể lấy thông tin người dùng')
      } catch (error) {
         console.error('❌ Error fetching user information:', error)
         throw error
      }
   }
}

// Export singleton instance
export const userService = new UserService()
export default userService
