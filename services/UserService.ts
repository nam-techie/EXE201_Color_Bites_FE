import { API_ENDPOINTS } from '@/constants'
import { apiService } from './ApiService'

// UserInformationResponse interface based on backend response
export interface UserInformationResponse {
   username: string
   accountId: string
   gender: 'MALE' | 'FEMALE' | null
   avatarUrl: string | null
   subscriptionPlan: 'FREE' | 'PREMIUM'
   // Subscription extra fields from backend
   subscriptionStatus?: 'ACTIVE' | 'EXPIRED' | 'CANCELED'
   subscriptionStartsAt?: string | null
   subscriptionExpiresAt?: string | null
   subscriptionRemainingDays?: number | null
   bio: string | null
   createdAt: string
   updatedAt: string
}

export class UserService {
  private normalizeUserInfo(data: any): UserInformationResponse {
      return {
         username: data?.username ?? data?.userName ?? data?.name ?? '',
         accountId: data?.accountId ?? data?.id ?? '',
         gender: (data?.gender ?? null) as 'MALE' | 'FEMALE' | null,
         avatarUrl: data?.avatarUrl ?? data?.avatar ?? null,
         subscriptionPlan: (data?.subscriptionPlan ?? data?.plan ?? 'FREE') as 'FREE' | 'PREMIUM',
         // pass-through subscription info for FE banner
         subscriptionStatus: data?.subscriptionStatus ?? data?.status ?? undefined,
         subscriptionStartsAt: data?.subscriptionStartsAt ?? data?.startsAt ?? null,
         subscriptionExpiresAt: data?.subscriptionExpiresAt ?? data?.expiresAt ?? null,
         subscriptionRemainingDays: (data?.subscriptionRemainingDays ?? data?.remainingDays ?? null) as number | null,
         bio: data?.bio ?? null,
         createdAt: data?.createdAt ?? new Date().toISOString(),
         updatedAt: data?.updatedAt ?? new Date().toISOString(),
      }
   }

   /**
    * Lấy thông tin user đầy đủ từ backend
    */
   async getUserInformation(): Promise<UserInformationResponse> {
      try {
         console.log('👤 Fetching user information...')
         const response = await apiService.get<UserInformationResponse | any>(
            API_ENDPOINTS.USER_INFO.GET
         )
         
         if (response.status === 200 && response.data) {
            console.log('✅ User information fetched successfully:', response.data)
            return this.normalizeUserInfo(response.data)
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

      // Chuẩn hóa dữ liệu gửi, trim và tương thích cả userName/username
      const normalizedPayload = {
         username: payload.username?.trim(),
         userName: payload.username?.trim(),
         gender: payload.gender ?? null,
         bio: payload.bio?.trim() ?? null,
      }

      const response = await apiService.put<UserInformationResponse | any>(
         API_ENDPOINTS.USER_INFO.UPDATE,
         normalizedPayload
      )
      if (response.status === 200 && response.data) {
         console.log('✅ User information updated:', response.data)
         return this.normalizeUserInfo(response.data)
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
      // @ts-ignore - React Native FormData file signature
      formData.append('file', {
         // @ts-ignore - React Native FormData file
         uri: fileUri,
         name: 'avatar.jpg',
         type: 'image/jpeg',
      })

      const response = await apiService.upload<string>(
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
