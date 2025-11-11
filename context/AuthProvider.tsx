'use client'

import { getDefaultAvatar } from '@/constants/defaultImages'
import { authService } from '@/services/AuthService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

interface User {
   id: string
   name: string
   email: string
   avatar?: string
   isPremium: boolean
   gender?: 'MALE' | 'FEMALE'
   bio?: string
}

interface AuthContextType {
   user: User | null
   isLoading: boolean
   login: (email: string, password: string) => Promise<void>
   register: (email: string) => Promise<string>
   logout: () => Promise<void>
   updateUserAvatar: (avatarUrl: string) => Promise<void>
   updateUser: (userData: Partial<User>) => void
   // OTP methods
   forgotPassword: (email: string) => Promise<string>
   verifyRegister: (email: string, otp: string, username: string, password: string, confirmPassword: string) => Promise<void>
   verifyResetPassword: (email: string, otp: string) => Promise<string>
   resetPassword: (email: string, newPassword: string, confirmPassword: string) => Promise<string>
   // Debug methods
   testConnection: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<User | null>(null)
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      checkAuthState()
   }, [])

   const checkAuthState = async () => {
      try {
         console.log('🔍 Checking auth state...')
         
         const token = await AsyncStorage.getItem('authToken')
         const userData = await AsyncStorage.getItem('user')
         
         // Chỉ set user nếu có BOTH token và userData
         if (token && userData) {
            try {
               const parsedUser = JSON.parse(userData)
               console.log(' Found valid auth state for user:', parsedUser.name)
               setUser(parsedUser)
            } catch (error) {
               console.error(' Error parsing user data, clearing auth state:', error)
               await AsyncStorage.removeItem('authToken')
               await AsyncStorage.removeItem('user')
               setUser(null)
            }
         } else {
            console.log('ℹ️ No valid auth state found - user needs to login')
            setUser(null)
            
            // Clear any orphaned data
            if (token || userData) {
               await AsyncStorage.removeItem('authToken')
               await AsyncStorage.removeItem('user')
            }
         }
      } catch (error) {
         console.error(' Error checking auth state:', error)
         // Clear everything on error
         await AsyncStorage.removeItem('authToken')
         await AsyncStorage.removeItem('user')
         setUser(null)
      } finally {
         setIsLoading(false)
      }
   }

   const login = async (email: string, password: string) => {
      try {
         console.log('🔐 Starting login process for:', email)
         
         // Clear any existing auth data first
         await AsyncStorage.removeItem('authToken')
         await AsyncStorage.removeItem('user')
         
         const userData = await authService.login(email, password)
         
         const user: User = {
            id: userData.id,
            name: userData.userName,
            email: userData.email,
            avatar: getDefaultAvatar(userData.userName, userData.email),
            isPremium: userData.role === 'PREMIUM',
         }
         
         // Save user to AsyncStorage (authService already saved token)
         await AsyncStorage.setItem('user', JSON.stringify(user))
         
         setUser(user)
         console.log(' Login successful! Token saved for API calls.')
         console.log('👤 User:', user.name, '| Role:', userData.role)
         
      } catch (error) {
         console.error(' Login failed:', error)
         // Ensure clean state on failure
         await AsyncStorage.removeItem('authToken')
         await AsyncStorage.removeItem('user')
         setUser(null)
         throw error
      }
   }

   const register = async (email: string) => {
      try {
         console.log('📝 Starting register process for:', email)
         
         // Clear any existing auth data first
         await AsyncStorage.removeItem('authToken')
         await AsyncStorage.removeItem('user')
         
         const message = await authService.register(email)
         
         console.log(' Register successful! No auto-login:', message)
         
         // Không set user - cần verify OTP trước
         return message
         
      } catch (error) {
         console.error(' Register failed:', error)
         // Ensure clean state on failure
         await AsyncStorage.removeItem('authToken')
         await AsyncStorage.removeItem('user')
         setUser(null)
         throw error
      }
   }

   const logout = async () => {
      try {
         console.log('🚪 Logging out user...')
         
         // Clear from AsyncStorage
         await AsyncStorage.removeItem('authToken')
         await AsyncStorage.removeItem('user')
         
         // Clear from state
         setUser(null)
         
         console.log(' Logout successful - all auth data cleared')
         
      } catch (error) {
         console.error(' Error during logout:', error)
         // Force clear even on error
         setUser(null)
         throw error
      }
   }

   const updateUserAvatar = async (avatarUrl: string) => {
      try {
         if (user) {
            const updatedUser = { ...user, avatar: avatarUrl }
            setUser(updatedUser)
            
            // Update in AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
            console.log(' User avatar updated in context:', avatarUrl)
         }
      } catch (error) {
         console.error(' Error updating user avatar:', error)
         throw error
      }
   }

   const updateUser = (userData: Partial<User>) => {
      try {
         if (user) {
            const updatedUser = { ...user, ...userData }
            setUser(updatedUser)
            AsyncStorage.setItem('user', JSON.stringify(updatedUser))
            console.log('✅ User updated in context:', userData)
         }
      } catch (error) {
         console.error('❌ Error updating user data:', error)
      }
   }

   // OTP Methods
   const forgotPassword = async (email: string) => {
      try {
         console.log('📧 Starting forgot password process for:', email)
         const message = await authService.forgotPassword(email)
         console.log('✅ Forgot password OTP sent:', message)
         return message
      } catch (error) {
         console.error('❌ Forgot password failed:', error)
         throw error
      }
   }

   const verifyRegister = async (email: string, otp: string, username: string, password: string, confirmPassword: string) => {
      try {
         console.log('🔐 Starting verify register process for:', email)
         
         const accountData = await authService.verifyRegister(email, otp, username, password, confirmPassword)
         
         console.log('✅ Register OTP verified successfully!')
         console.log('👤 User:', accountData.userName, '| Role:', accountData.role)
         
         // Không lưu user hay token - chỉ cần đăng ký thành công
         // User sẽ cần login riêng
         
      } catch (error) {
         console.error('❌ Verify register failed:', error)
         throw error
      }
   }

   const verifyResetPassword = async (email: string, otp: string) => {
      try {
         console.log('🔐 Starting verify reset password process for:', email)
         const message = await authService.verifyResetPassword(email, otp)
         console.log('✅ Reset password OTP verified:', message)
         return message
      } catch (error) {
         console.error('❌ Verify reset password failed:', error)
         throw error
      }
   }

   const resetPassword = async (email: string, newPassword: string, confirmPassword: string) => {
      try {
         console.log('🔐 Starting reset password process for:', email)
         const message = await authService.resetPassword(email, newPassword, confirmPassword)
         console.log('✅ Password reset successfully:', message)
         return message
      } catch (error) {
         console.error('❌ Reset password failed:', error)
         throw error
      }
   }

   const testConnection = async () => {
      try {
         console.log('🔍 Testing backend connection...')
         const isConnected = await authService.testConnection()
         console.log('🔍 Connection test result:', isConnected)
         return isConnected
      } catch (error) {
         console.error('❌ Connection test failed:', error)
         return false
      }
   }

   return (
      <AuthContext.Provider value={{ 
         user, 
         isLoading, 
         login, 
         register, 
         logout, 
         updateUserAvatar, 
         updateUser,
         forgotPassword,
         verifyRegister,
         verifyResetPassword,
         resetPassword,
         testConnection
      }}>
         {children}
      </AuthContext.Provider>
   )
}

export function useAuth() {
   const context = useContext(AuthContext)
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider')
   }
   return context
}
