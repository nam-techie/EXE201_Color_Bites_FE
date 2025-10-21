import { API_BASE_URL } from '@/constants'
import type { ApiResponse } from '@/type'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

class ApiService {
   private axiosInstance: AxiosInstance

   constructor() {
      console.log('🚀 ApiService constructor - API_BASE_URL:', API_BASE_URL)
      this.axiosInstance = axios.create({
         baseURL: API_BASE_URL,
         timeout: 30000,
         headers: {
            'Content-Type': 'application/json',
         },
      })

      // Request interceptor để thêm auth token
      this.axiosInstance.interceptors.request.use(
         async (config) => {
            try {
               const token = await AsyncStorage.getItem('authToken')
               console.log('🔑 Auth Token Check:', token ? 'Token found' : 'No token found')
               
               if (token) {
                  config.headers.Authorization = `Bearer ${token}`
                  console.log('✅ Authorization header added')
               } else {
                  console.warn('⚠️ No auth token found - API call may fail if auth required')
               }
               
               console.log('📤 Request Headers:', config.headers)
               console.log('📤 Request URL:', config.url)
               console.log('📤 Request Method:', config.method)
            } catch (error) {
               console.error('❌ Error getting auth token:', error)
            }
            return config
         },
         (error) => {
            console.error('❌ Request interceptor error:', error)
            return Promise.reject(error)
         },
      )

      // Response interceptor để handle errors
      this.axiosInstance.interceptors.response.use(
         (response: AxiosResponse) => {
            return response
         },
         async (error) => {
            // Handle 401 - Unauthorized
            if (error.response?.status === 401) {
               await AsyncStorage.removeItem('authToken')
               await AsyncStorage.removeItem('user')
               // Có thể redirect về login screen ở đây
               console.log('Token expired, user logged out')
            }

            // Handle network errors
            if (!error.response) {
               console.error('Network error:', error.message)
               throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra internet.')
            }

            // Handle server errors
            const serverMessage = error.response?.data?.message || 'Đã xảy ra lỗi từ server'
            throw new Error(serverMessage)
         },
      )
   }

   // GET request
   async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      try {
         const response = await this.axiosInstance.get<ApiResponse<T>>(url, config)
         return response.data
      } catch (error) {
         console.error('GET request failed:', error)
         throw error
      }
   }

   // POST request
   async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      try {
         const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config)
         return response.data
      } catch (error) {
         console.error('POST request failed:', error)
         throw error
      }
   }

   // PUT request
   async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      try {
         const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config)
         return response.data
      } catch (error) {
         console.error('PUT request failed:', error)
         throw error
      }
   }

   // DELETE request
   async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      try {
         const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config)
         return response.data
      } catch (error) {
         console.error('DELETE request failed:', error)
         throw error
      }
   }

   // Upload file (multipart/form-data)
   async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
      try {
         const response = await this.axiosInstance.post<ApiResponse<T>>(url, formData, {
            ...config,
            headers: {
               'Content-Type': 'multipart/form-data',
               ...config?.headers,
            },
         })
         return response.data
      } catch (error) {
         console.error('Upload request failed:', error)
         throw error
      }
   }

   // Set auth token manually
   async setAuthToken(token: string): Promise<void> {
      await AsyncStorage.setItem('authToken', token)
   }

   // Clear auth token
   async clearAuthToken(): Promise<void> {
      await AsyncStorage.removeItem('authToken')
   }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
