import axios, { AxiosInstance } from 'axios'
import { AccountResponse, AuthApiResponse, LoginRequest } from '../types/auth'
import { ApiResponse, ListAccountResponse } from '../types/user'

// API Configuration - sử dụng cùng backend với mobile app
const API_BASE_URL = 'http://localhost:8080' // Backend local development

class AdminApiService {
  private axiosInstance: AxiosInstance

  constructor() {
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
          const token = localStorage.getItem('adminAuthToken')
          console.log('🔑 Admin Auth Token Check:', token ? 'Token found' : 'No token found')
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log('✅ Admin Authorization header added')
          } else {
            console.warn('⚠️ No admin auth token found - API call may fail if auth required')
          }
          
          console.log('📤 Admin Request Headers:', config.headers)
          console.log('📤 Admin Request URL:', config.url)
          console.log('📤 Admin Request Method:', config.method)
        } catch (error) {
          console.error('❌ Error getting admin auth token:', error)
        }
        return config
      },
      (error) => {
        console.error('❌ Admin Request interceptor error:', error)
        return Promise.reject(error)
      },
    )

    // Response interceptor để handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        // Handle 401 - Unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem('adminAuthToken')
          localStorage.removeItem('adminUser')
          // Redirect to login page
          window.location.href = '/login'
          console.log('Admin token expired, redirected to login')
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

  // Get all users by admin
  async getAllUsers(): Promise<ApiResponse<ListAccountResponse[]>> {
    try {
      console.log('📡 Fetching all users by admin')
      
      const response = await this.axiosInstance.get<ApiResponse<ListAccountResponse[]>>(
        '/api/admin/user'
      )
      
      if (response.data.status === 200 && response.data.data) {
        console.log(`✅ Fetched ${response.data.data.length} users`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách người dùng')
    } catch (error) {
      console.error('❌ Error fetching users:', error)
      throw error
    }
  }

  // Block user
  async blockUser(userId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Blocking user:', userId)
      
      const response = await this.axiosInstance.put<ApiResponse<void>>(
        `/api/admin/block-user/${userId}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ User blocked successfully:', userId)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể chặn người dùng')
    } catch (error) {
      console.error('❌ Error blocking user:', error)
      throw error
    }
  }

  // Activate user
  async activeUser(userId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Activating user:', userId)
      
      const response = await this.axiosInstance.put<ApiResponse<void>>(
        `/api/admin/active-user/${userId}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ User activated successfully:', userId)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể kích hoạt người dùng')
    } catch (error) {
      console.error('❌ Error activating user:', error)
      throw error
    }
  }

  // Set auth token manually
  setAuthToken(token: string): void {
    localStorage.setItem('adminAuthToken', token)
  }

  // Clear auth token
  clearAuthToken(): void {
    localStorage.removeItem('adminAuthToken')
    localStorage.removeItem('adminUser')
  }

  // Get current auth token
  getAuthToken(): string | null {
    return localStorage.getItem('adminAuthToken')
  }

  // Admin login with real API
  async login(credentials: LoginRequest): Promise<AuthApiResponse<AccountResponse>> {
    try {
      console.log('📤 Admin login request:', { username: credentials.username })
      
      const response = await this.axiosInstance.post<AuthApiResponse<AccountResponse>>(
        '/api/auth/login',
        credentials
      )
      
      if (response.data.status === 200 && response.data.data) {
        const accountData = response.data.data
        
        // Check if user has admin role
        if (accountData.role !== 'ADMIN') {
          throw new Error('Bạn không có quyền truy cập trang quản trị')
        }
        
        // Store token and user info
        this.setAuthToken(accountData.token)
        localStorage.setItem('adminUser', JSON.stringify({
          id: accountData.id,
          username: accountData.username,
          email: accountData.email,
          role: accountData.role
        }))
        
        console.log('✅ Admin login successful')
        return response.data
      }
      
      throw new Error(response.data.message || 'Đăng nhập thất bại')
    } catch (error) {
      console.error('❌ Admin login failed:', error)
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || 'Đăng nhập thất bại'
        throw new Error(serverMessage)
      }
      throw error
    }
  }

  // Admin logout with real API
  async logout(): Promise<void> {
    try {
      const token = this.getAuthToken()
      if (token) {
        console.log('📤 Admin logout request')
        
        await this.axiosInstance.post('/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('✅ Admin logout successful')
      }
    } catch (error) {
      console.error('❌ Admin logout error:', error)
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local storage
      this.clearAuthToken()
    }
  }
}

// Export singleton instance
export const adminApi = new AdminApiService()
export default adminApi
