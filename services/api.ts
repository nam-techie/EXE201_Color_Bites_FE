import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '../constants/config'

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
   baseURL: API_BASE_URL,
   timeout: API_TIMEOUT,
   headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
   },
})

// Request interceptor
axiosInstance.interceptors.request.use(
   async (config: InternalAxiosRequestConfig) => {
      try {
         // Get token from AsyncStorage
         const token = await AsyncStorage.getItem('auth_token')
         
         if (token) {
            config.headers.set('Authorization', `Bearer ${token}`)
         }
         
         console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
         })
         
         return config
      } catch (error) {
         console.error('❌ Request interceptor error:', error)
         return config
      }
   },
   (error) => {
      console.error('❌ Request interceptor error:', error)
      return Promise.reject(error)
   }
)

// Response interceptor
axiosInstance.interceptors.response.use(
   (response: AxiosResponse) => {
      console.log('✅ API Response:', {
         status: response.status,
         url: response.config.url,
         data: response.data,
      })
      
      return response
   },
   async (error) => {
      const originalRequest = error.config
      
      console.error('❌ API Error:', {
         status: error.response?.status,
         url: error.config?.url,
         message: error.response?.data?.message || error.message,
      })
      
      // Handle 401 Unauthorized - Token expired
      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true
         
         try {
            // Try to refresh token
            const refreshToken = await AsyncStorage.getItem('refresh_token')
            
            if (refreshToken) {
               const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                  refreshToken,
               })
               
               const { accessToken } = refreshResponse.data
               
               // Store new token
               await AsyncStorage.setItem('auth_token', accessToken)
               
               // Retry original request with new token
               originalRequest.headers.Authorization = `Bearer ${accessToken}`
               return axiosInstance(originalRequest)
            }
         } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError)
            
            // Clear tokens and redirect to login
            await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user_data'])
            
            // You can add navigation to login screen here
            // import { router } from 'expo-router'
            // router.replace('/auth/login')
         }
      }
      
      return Promise.reject(error)
   }
)

// API Service class
class ApiService {
   private api: AxiosInstance

   constructor() {
      this.api = axiosInstance
   }

   // Generic GET request
   async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      const response = await this.api.get<T>(url, config)
      return response.data
   }

   // Generic POST request
   async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      const response = await this.api.post<T>(url, data, config)
      return response.data
   }

   // Generic PUT request
   async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      const response = await this.api.put<T>(url, data, config)
      return response.data
   }

   // Generic DELETE request
   async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      const response = await this.api.delete<T>(url, config)
      return response.data
   }

   // Generic PATCH request
   async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      const response = await this.api.patch<T>(url, data, config)
      return response.data
   }

   // Upload file
   async uploadFile<T>(url: string, file: any, onProgress?: (progress: number) => void): Promise<T> {
      const formData = new FormData()
      formData.append('file', file)

      const response = await this.api.post<T>(url, formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
               const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
               onProgress(progress)
            }
         },
      })

      return response.data
   }
}

// Create and export API service instance
export const apiService = new ApiService()

// Export axios instance for direct use if needed
export default axiosInstance

// Export types
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse }

