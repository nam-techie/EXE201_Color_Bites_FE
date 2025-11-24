import { API_BASE_URL, API_ENDPOINTS } from '@/constants'
import type { AccountResponse, ApiResponse } from '@/type'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosInstance } from 'axios'

interface LoginResponse {
  id: string
  email: string
  userName: string
  role: string
  token: string
  active: boolean
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
        'Accept': 'application/json',
      },
    })
    
    // Add request interceptor for debugging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log('🚀 Making request to:', config.url)
        console.log('🚀 Request method:', config.method)
        console.log('🚀 Request headers:', config.headers)
        console.log('🚀 Request data:', config.data)
        return config
      },
      (error) => {
        console.error('❌ Request interceptor error:', error)
        return Promise.reject(error)
      }
    )
    
    // Add response interceptor for debugging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('✅ Response received:', response.status)
        console.log('✅ Response data:', response.data)
        return response
      },
      (error) => {
        console.error('❌ Response interceptor error:', error)
        console.error('❌ Error response data:', error.response?.data)
        console.error('❌ Error response status:', error.response?.status)
        return Promise.reject(error)
      }
    )
  }

  /**
   * Test connection to backend
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing connection to backend...')
      console.log('🌐 Base URL:', this.axiosInstance.defaults.baseURL)
      
      // Try a simple GET request to test connection
      const response = await this.axiosInstance.get('/api/auth/me', {
        timeout: 5000
      })
      
      console.log('✅ Connection test successful:', response.status)
      return true
    } catch (error: any) {
      console.log('❌ Connection test failed:', error.message)
      console.log('❌ Error details:', error.response?.data)
      return false
    }
  }

  /**
   * Đổi mật khẩu (đã đăng nhập)
   */
  async changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<string> {
    try {
      const payload = { oldPassword, newPassword, confirmPassword }
      // Need auth token for protected endpoint
      const token = await AsyncStorage.getItem('authToken')
      const response = await this.axiosInstance.put<ApiResponse<unknown>>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      )

      if (response.data.status === 200) {
        return response.data.message || 'Đổi mật khẩu thành công'
      }

      throw new Error(response.data.message || 'Đổi mật khẩu thất bại')
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Lỗi khi đổi mật khẩu')
      }
      throw new Error(error.message || 'Không thể kết nối đến server')
    }
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
   * Register với BE thật - Chỉ gửi email để nhận OTP
   * Lưu ý: Tài khoản CHƯA được tạo, chỉ gửi OTP
   * Tài khoản chỉ được tạo khi verify OTP thành công
   */
  async register(email: string): Promise<string> {
    try {
      // Backend chỉ cần email trong register request
      const payload = { email }
      
      const response = await this.axiosInstance.post<ApiResponse<string>>(
        API_ENDPOINTS.AUTH.REGISTER,
        payload
      )

      if (response.data.status === 200) {
        return response.data.data || 'Đăng ký thành công'
      }

      // Handle error response từ BE - chỉ các lỗi technical thực sự
      if (response.data.status === 400) {
        throw new Error(response.data.message || 'Dữ liệu không hợp lệ')
      }

      // Các status code khác (409, 500, etc.) - không throw error cho business logic
      // Vì email chỉ "đã sử dụng" khi tài khoản thực sự tồn tại (sau verify OTP)
      return response.data.data || 'OTP đã được gửi'
      
    } catch (error: any) {
      console.error('❌ Register error:', error)
      console.error('❌ Error response:', error.response?.data)
      console.error('❌ Error status:', error.response?.status)
      console.error('❌ Error headers:', error.response?.headers)
      
      // Nếu có response từ BE - chỉ throw error cho các lỗi technical thực sự
      if (error.response?.data) {
        const errorData = error.response.data
        console.error('❌ Backend error data:', errorData)
        
        // Chỉ throw error cho các lỗi technical (network, server down, invalid format)
        // KHÔNG throw error cho business logic như "email đã sử dụng"
        if (error.response.status >= 500) {
          throw new Error(`Lỗi server (${error.response.status}). Vui lòng thử lại sau.`)
        }
        
        // Các lỗi khác (409, 400, etc.) - không throw error
        return 'OTP đã được gửi'
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

  /**
   * Gửi OTP quên mật khẩu
   */
  async forgotPassword(email: string): Promise<string> {
    try {
      console.log('📧 Sending forgot password OTP to:', email)
      
      const response = await this.axiosInstance.post<ApiResponse<object>>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      )

      console.log('📥 Forgot password response:', response.data)

      if (response.data.status === 200) {
        console.log('✅ Forgot password OTP sent successfully')
        return response.data.message || 'OTP đã được gửi đến email của bạn'
      }

      throw new Error(response.data.message || 'Không thể gửi OTP')
      
    } catch (error: any) {
      console.error('❌ Forgot password error:', error)
      
      if (error.response?.data) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Lỗi từ server')
      }
      
      if (error.message) {
        throw new Error(error.message)
      }
      
      throw new Error('Không thể kết nối đến server')
    }
  }

  /**
   * Xác nhận OTP đăng ký - TẠO TÀI KHOẢN THỰC SỰ
   * Đây là bước cuối cùng để tạo tài khoản
   */
  async verifyRegister(email: string, otp: string, username: string, password: string, confirmPassword: string): Promise<AccountResponse> {
    try {
      console.log('🔐 Verifying register OTP for:', email)
      
      const payload = {
        username,
        email,
        password,
        confirmPassword,
        otp
      }
      
      console.log('📤 Verify register payload:', { ...payload, password: '***', confirmPassword: '***' })
      
      const response = await this.axiosInstance.post<ApiResponse<AccountResponse>>(
        API_ENDPOINTS.OTP.VERIFY_REGISTER,
        payload
      )

      console.log('📥 Verify register response:', response.data)

      if (response.data.status === 200 && response.data.data) {
        const accountData = response.data.data
        
        // Không lưu token - chỉ cần đăng ký thành công
        console.log('✅ Register OTP verified successfully')
        return accountData
      }

      throw new Error(response.data.message || 'Xác thực OTP thất bại')
      
    } catch (error: any) {
      console.error('❌ Verify register error:', error)
      
      if (error.response?.data) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Lỗi từ server')
      }
      
      if (error.message) {
        throw new Error(error.message)
      }
      
      throw new Error('Không thể kết nối đến server')
    }
  }

  /**
   * Xác nhận OTP quên mật khẩu
   */
  async verifyResetPassword(email: string, otp: string): Promise<string> {
    try {
      console.log('🔐 Verifying reset password OTP for:', email)
      
      const response = await this.axiosInstance.post<ApiResponse<object>>(
        API_ENDPOINTS.OTP.VERIFY_RESET_PASSWORD,
        { email, otp }
      )

      console.log('📥 Verify reset password response:', response.data)

      if (response.data.status === 200) {
        console.log('✅ Reset password OTP verified successfully')
        return response.data.message || 'OTP đã được xác thực thành công'
      }

      throw new Error(response.data.message || 'Xác thực OTP thất bại')
      
    } catch (error: any) {
      console.error('❌ Verify reset password error:', error)
      
      if (error.response?.data) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Lỗi từ server')
      }
      
      if (error.message) {
        throw new Error(error.message)
      }
      
      throw new Error('Không thể kết nối đến server')
    }
  }

  /**
   * Đặt lại mật khẩu sau khi xác thực OTP
   */
  async resetPassword(email: string, newPassword: string, confirmPassword: string): Promise<string> {
    try {
      console.log('🔐 Resetting password for:', email)
      
      const response = await this.axiosInstance.post<ApiResponse<object>>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { email, newPassword, confirmPassword }
      )

      console.log('📥 Reset password response:', response.data)

      if (response.data.status === 200) {
        console.log('✅ Password reset successfully')
        return response.data.message || 'Mật khẩu đã được đặt lại thành công'
      }

      throw new Error(response.data.message || 'Đặt lại mật khẩu thất bại')
      
    } catch (error: any) {
      console.error('❌ Reset password error:', error)
      
      if (error.response?.data) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Lỗi từ server')
      }
      
      if (error.message) {
        throw new Error(error.message)
      }
      
      throw new Error('Không thể kết nối đến server')
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
