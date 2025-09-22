'use client'

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
}

interface AuthContextType {
   user: User | null
   isLoading: boolean
   login: (email: string, password: string) => Promise<void>
   register: (name: string, email: string, password: string) => Promise<void>
   logout: () => Promise<void>
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
         
         // FORCE CLEAR: Xóa bất kỳ fake token nào
         if (token && (
            token.includes('fake-signature-for-testing') ||
            token.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0MTIzQGV4YW1wbGUuY29tIg==')
         )) {
            console.log('🧹 FORCE CLEARING fake/mock tokens...')
            await AsyncStorage.removeItem('authToken')
            await AsyncStorage.removeItem('user')
            setUser(null)
            setIsLoading(false)
            return
         }
         
         // Chỉ set user nếu có BOTH token và userData
         if (token && userData) {
            try {
               const parsedUser = JSON.parse(userData)
               console.log('✅ Found valid auth state for user:', parsedUser.name)
               setUser(parsedUser)
            } catch (parseError) {
               console.error('❌ Error parsing user data, clearing auth state')
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
         console.error('❌ Error checking auth state:', error)
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
            avatar: undefined,
            isPremium: userData.role === 'PREMIUM',
         }
         
         setUser(user)
         console.log('✅ Login successful! Token saved for API calls.')
         console.log('👤 User:', user.name, '| Role:', userData.role)
         
      } catch (error) {
         console.error('❌ Login failed:', error)
         // Ensure clean state on failure
         await AsyncStorage.removeItem('authToken')
         await AsyncStorage.removeItem('user')
         setUser(null)
         throw error
      }
   }

   const register = async (name: string, email: string, password: string) => {
      try {
         console.log('📝 Starting register process for:', email)
         
         // Clear any existing auth data first
         await AsyncStorage.removeItem('authToken')
         await AsyncStorage.removeItem('user')
         
         const userData = await authService.register(name, email, password)
         
         const user: User = {
            id: userData.id,
            name: userData.userName,
            email: userData.email,
            avatar: undefined,
            isPremium: userData.role === 'PREMIUM',
         }
         
         setUser(user)
         console.log('✅ Register successful! Token saved for API calls.')
         
      } catch (error) {
         console.error('❌ Register failed:', error)
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
         
         console.log('✅ Logout successful - all auth data cleared')
         
      } catch (error) {
         console.error('❌ Error during logout:', error)
         // Force clear even on error
         setUser(null)
         throw error
      }
   }

   return (
      <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
