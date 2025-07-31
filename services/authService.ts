import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiService } from './api'

// Types for Spring Boot backend
export interface ResponseDto<T> {
  status: number
  message: string
  data: T
}

export interface AccountResponse {
  id: string
  userName: string  // BE uses 'userName' (capital N)
  email: string
  avatar?: string
  token: string  // BE uses 'token' instead of 'accessToken'
  refreshToken?: string  // Make optional in case BE doesn't return it
  active?: boolean
  role?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface SignupRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Auth Service class
class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<ResponseDto<AccountResponse>> {
    try {
      const response = await apiService.post<ResponseDto<AccountResponse>>('/api/auth/login', credentials)
      
      // Check if login was successful (status 200 means success from BE)
      if (response.status === 200 && response.data) {
        // Validate that token exists before storing
        if (!response.data.token) {
          throw new Error('Token không hợp lệ từ server')
        }
        
        // Store tokens
        await AsyncStorage.setItem('auth_token', response.data.token)
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refresh_token', response.data.refreshToken)
        }
        
        // Store user data
        await AsyncStorage.setItem('user_data', JSON.stringify({
          id: response.data.id,
          username: response.data.userName,  // Map userName to username for consistency
          email: response.data.email,
          avatar: response.data.avatar
        }))
      } else {
        // If status is not 200, throw error with BE message
        throw new Error(response.message || 'Đăng nhập thất bại')
      }
      
      return response
    } catch (error) {
      console.error('❌ Login error:', error)
      throw error
    }
  }

  // Signup user
  async signup(userData: SignupRequest): Promise<ResponseDto<string>> {
    try {
      const response = await apiService.post<ResponseDto<string>>('/api/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      })
      
      // Note: Register doesn't return tokens, user needs to login after registration
      return response
    } catch (error) {
      console.error('❌ Signup error:', error)
      throw error
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        '/api/auth/forgot-password',
        { email }
      )
      return response
    } catch (error) {
      console.error('❌ Forgot password error:', error)
      throw error
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        '/api/auth/reset-password',
        data
      )
      return response
    } catch (error) {
      console.error('❌ Reset password error:', error)
      throw error
    }
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        '/api/auth/verify-otp',
        { email, otp }
      )
      return response
    } catch (error) {
      console.error('❌ Verify OTP error:', error)
      throw error
    }
  }

  // Resend OTP
  async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        '/api/auth/resend-otp',
        { email }
      )
      return response
    } catch (error) {
      console.error('❌ Resend OTP error:', error)
      throw error
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>('/api/auth/me')
      return response
    } catch (error) {
      console.error('❌ Get current user error:', error)
      throw error
    }
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put<User>('/api/auth/profile', userData)
      
      // Update stored user data
      await AsyncStorage.setItem('user_data', JSON.stringify(response))
      
      return response
    } catch (error) {
      console.error('❌ Update profile error:', error)
      throw error
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        '/api/auth/change-password',
        { currentPassword, newPassword }
      )
      return response
    } catch (error) {
      console.error('❌ Change password error:', error)
      throw error
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout API to invalidate token on server
      await apiService.post('/api/auth/logout')
    } catch (error) {
      console.error('❌ Logout API error:', error)
    } finally {
      // Clear local storage regardless of API call success
      await AsyncStorage.multiRemove([
        'auth_token',
        'refresh_token',
        'user_data'
      ])
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('auth_token')
      return !!token
    } catch (error) {
      console.error('❌ Check authentication error:', error)
      return false
    }
  }

  // Get stored user data
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('❌ Get stored user error:', error)
      return null
    }
  }

  // Refresh token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token')
      
      if (!refreshToken) {
        return false
      }

      const response = await apiService.post<{ accessToken: string }>(
        '/api/auth/refresh',
        { refreshToken }
      )

      await AsyncStorage.setItem('auth_token', response.accessToken)
      return true
    } catch (error) {
      console.error('❌ Refresh token error:', error)
      return false
    }
  }
}

// Create and export auth service instance
export const authService = new AuthService()

