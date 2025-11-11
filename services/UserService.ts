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
         console.error(' Error fetching user information:', error)
         throw error
      }
   }

   /**
    * Cập nhật thông tin người dùng
    */
   async updateUserInformation(payload: {
      username?: string
      gender?: 'MALE' | 'FEMALE' | null
      bio?: string | null
   }): Promise<UserInformationResponse> {
      console.log('📝 Updating user information...', payload)
      const response = await apiService.put<UserInformationResponse>(
         API_ENDPOINTS.USER_INFO.UPDATE,
         payload
      )
      if (response.status === 200 && response.data) {
         console.log('✅ User information updated:', response.data)
         return response.data
      }
      throw new Error(response.message || 'Không thể cập nhật thông tin người dùng')
   }

   /**
    * Upload avatar người dùng (multipart/form-data)
    */
   async uploadAvatar(accountId: string, fileUri: string): Promise<string> {
      console.log('🖼️ Uploading avatar for account:', accountId)
      const formData = new FormData()
      // React Native specific: name and type are required
      formData.append('file', {
         // @ts-ignore - React Native FormData file
         uri: fileUri,
         name: 'avatar.jpg',
         type: 'image/jpeg',
      })

      const response = await apiService.postForm<string>(
         `${API_ENDPOINTS.USER_INFO.UPLOAD_AVATAR}/${accountId}`,
         formData
      )
      if (response.status === 201 && response.data) {
         console.log('✅ Avatar uploaded:', response.data)
         return response.data
      }
      throw new Error(response.message || 'Không thể upload avatar')
   }
}

// Export singleton instance
export const userService = new UserService()
export default userService
