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
      const mockUser: User = {
         id: '1',
         name: 'John Doe',
         email,
         avatar: '/placeholder.svg?height=100&width=100',
         isPremium: false,
      }

      await AsyncStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
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
      await AsyncStorage.removeItem('user')
      setUser(null)
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
