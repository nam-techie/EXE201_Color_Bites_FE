import { API_BASE_URL, API_ENDPOINTS } from '@/constants'
import type { ApiResponse } from '@/type'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosInstance } from 'axios'

interface LoginRequest {
  username: string  // BE expect username, not email
  password: string
}

interface LoginResponse {
  id: string
  email: string
  userName: string
  role: string
  token: string
  active: boolean
}

interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export class AuthService {
  private axiosInstance: AxiosInstance

  constructor() {
    // Tạo axios instance riêng cho auth (không có interceptor)
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Login với BE thật
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('🔐 Attempting login with:', { username: email })
      console.log('🌐 Using base URL:', this.axiosInstance.defaults.baseURL)
      
      const response = await this.axiosInstance.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        { username: email, password } // BE expect username field
      )

      console.log('📥 Login response:', response.data)

      if (response.data.status === 200 && response.data.data) {
        const userData = response.data.data
        
        // Chỉ lưu token, để AuthProvider lưu user info
        await AsyncStorage.setItem('authToken', userData.token)
        
        console.log('✅ Login successful - token saved')
        console.log('🔑 Token:', userData.token.substring(0, 50) + '...')
        console.log('👤 User:', userData.userName, userData.email, userData.role)
        
        return userData
      }

      // Handle error response từ BE
      if (response.data.status === 401) {
        throw new Error(response.data.message || 'Email hoặc mật khẩu không đúng')
      }
      
      if (response.data.status === 404) {
        throw new Error(response.data.message || 'Tài khoản không tồn tại')
      }

      throw new Error(response.data.message || 'Đăng nhập thất bại')
      
    } catch (error: any) {
      console.error('❌ Login error:', error)
      
      // Nếu có response từ BE (không phải network error)
      if (error.response?.data) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Lỗi từ server')
      }
      
      // Network error hoặc các lỗi khác
      if (error.message) {
        throw new Error(error.message)
      }
      
      throw new Error('Không thể kết nối đến server')
    }
  }

  /**
   * Register với BE thật - Chỉ đăng ký, không auto-login
   */
  async register(username: string, email: string, password: string, confirmPassword: string): Promise<string> {
    try {
      console.log('📝 Attempting register with:', { username, email })
      
      const response = await this.axiosInstance.post<ApiResponse<string>>(
        API_ENDPOINTS.AUTH.REGISTER,
        { username, email, password, confirmPassword }
      )

      console.log('📥 Register response:', response.data)

      if (response.data.status === 200) {
        console.log('✅ Register successful - no auto-login')
        return response.data.data || 'Đăng ký thành công'
      }

      // Handle error response từ BE
      if (response.data.status === 409) {
        throw new Error(response.data.message || 'Email đã được sử dụng')
      }
      
      if (response.data.status === 400) {
        throw new Error(response.data.message || 'Dữ liệu không hợp lệ')
      }

      throw new Error(response.data.message || 'Đăng ký thất bại')
      
    } catch (error: any) {
      console.error('❌ Register error:', error)
      
      // Nếu có response từ BE
      if (error.response?.data) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Lỗi từ server')
      }
      
      // Network error hoặc các lỗi khác
      if (error.message) {
        throw new Error(error.message)
      }
      
      throw new Error('Không thể kết nối đến server')
    }
  }

  /**
   * Logout - clear local data
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken')
      await AsyncStorage.removeItem('user')
      console.log('✅ Logout successful - cleared local data')
    } catch (error) {
      console.error('❌ Logout error:', error)
      throw error
    }
  }

  /**
   * Kiểm tra token còn valid không
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (!token) return false

      // Call API để verify token
      const response = await this.axiosInstance.get<ApiResponse<any>>(
        API_ENDPOINTS.AUTH.VERIFY_TOKEN,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      return response.data.status === 200
    } catch (error) {
      console.error('❌ Token validation error:', error)
      return false
    }
  }

  /**
   * Get current user info từ token
   */
  async getCurrentUser(): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('No token found')

      const response = await this.axiosInstance.get<ApiResponse<any>>(
        API_ENDPOINTS.AUTH.ME,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.data.status === 200 && response.data.data) {
        return response.data.data
      }

      throw new Error('Cannot get user info')
    } catch (error) {
      console.error('❌ Get current user error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
