'use client'

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
         const userData = await AsyncStorage.getItem('user')
         if (userData) {
            setUser(JSON.parse(userData))
         }
      } catch (error) {
         console.error('Error checking auth state:', error)
      } finally {
         setIsLoading(false)
      }
   }

   const login = async (email: string, password: string) => {
      // Mock login - replace with real API call
      if (email === 'test123' && password === 'test123') {
         const mockUser: User = {
            id: '1',
            name: 'Test User',
            email: 'test123@example.com',
            avatar: 'https://i.pravatar.cc/96?img=12',
            isPremium: false,
         }

         // Mock JWT token cho backend authentication
         const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0MTIzQGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwiaWF0IjoxNzM3NTUyNjAwLCJleHAiOjk5OTk5OTk5OTl9.fake-signature-for-testing'

         await AsyncStorage.setItem('user', JSON.stringify(mockUser))
         await AsyncStorage.setItem('authToken', mockToken)
         
         console.log('✅ Mock login successful - user and token saved')
         setUser(mockUser)
      } else {
         throw new Error('Invalid credentials')
      }
   }

   const register = async (name: string, email: string, password: string) => {
      // Mock register - replace with real API call
      const mockUser: User = {
         id: '1',
         name,
         email,
         avatar: '/placeholder.svg?height=100&width=100',
         isPremium: false,
      }

      await AsyncStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
   }

   const logout = async () => {
      try {
         await AsyncStorage.removeItem('user')
         await AsyncStorage.removeItem('authToken')
         setUser(null)
         console.log('✅ User logged out successfully - user and token cleared')
      } catch (error) {
         console.error('❌ Error during logout:', error)
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
