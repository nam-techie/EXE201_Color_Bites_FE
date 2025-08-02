import { ApiResponse } from '@/type/index'
import { User } from '@/type/user'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { isAxiosError } from 'axios'
import { Platform } from 'react-native'
import axiosInstance from '../config/axios'

export async function registerUser(user: User): Promise<ApiResponse<null>> {
   try {
      const response = await axiosInstance.post<ApiResponse<null>>('auth/register', user)

      return {
         status: response.data.status,
         message: response.data.message,
         data: null,
      }
   } catch (error: any) {
      if (isAxiosError(error)) {
         const res = error.response
         const errorData = res?.data as ApiResponse<null>

         console.error('❌ Đăng ký thất bại (AxiosError):', {
            status: res?.status,
            url: res?.config?.url,
            data: res?.data,
         })

         return {
            status: errorData?.status || res?.status || 500,
            message:
               errorData?.message ||
               `Server Error (${res?.status}): ${res?.statusText}` ||
               'Something went wrong',
            data: null,
         }
      } else {
         console.error('❌ Đăng ký thất bại (UnknownError):', error)

         return {
            status: 500,
            message: 'Lỗi không xác định khi đăng ký người dùng',
            data: null,
         }
      }
   }
}

interface LoginPayload {
   username: string
   password: string
}
type LoginResponseData = {
   id: string
   email: string
   userName: string
   role: string
   token: string
   active: boolean
}

export async function loginUser(payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
   try {
      const response = await axiosInstance.post<ApiResponse<LoginResponseData>>(
         '/auth/login',
         payload,
      )

      const userData = response.data.data
      if (userData?.token) {
         await AsyncStorage.setItem('access_token', userData.token)
         await AsyncStorage.setItem('user', JSON.stringify(userData))
      }

      return response.data
   } catch (error: any) {
      if (error.response) {
         return {
            status: error.response.status,
            message: error.response.data?.message || 'Login failed',
            data: null,
         }
      } else {
         return {
            status: 500,
            message: 'Network Error',
            data: null,
         }
      }
   }
}

export async function uploadUserAvatar(userId: string, imageUri: string): Promise<string> {
   try {
      const uriParts = imageUri.split('/')
      const fileName = uriParts[uriParts.length - 1]
      const fileType = fileName.split('.').pop()

      const formData = new FormData()
      formData.append('file', {
         uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
         type: `image/${fileType}`,
         name: fileName,
      } as any)

      const response = await axiosInstance.post(`/auth/uploadImage/${userId}`, formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      })

      return response.data.imageUrl
   } catch (error: any) {
      console.error('❌ Upload avatar failed:', error)
      throw new Error(error?.response?.data?.message || 'Upload failed')
   }
}
