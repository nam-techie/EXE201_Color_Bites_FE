// Import gesture-handler TRƯỚC reanimated
import 'react-native-gesture-handler'
// Import Reanimated sớm nhất có thể
import 'react-native-reanimated'

import { AuthProvider, useAuth } from '@/context/AuthProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import '../global.css'

function RootLayoutNav() {
   const { user, isLoading } = useAuth()
   const router = useRouter()

   useEffect(() => {
      if (isLoading) return

      if (!user) {
         // Redirect to welcome page if not authenticated
         router.replace('/auth/welcome')
      } else {
         // Redirect to home if authenticated
         router.replace('/(tabs)')
      }
   }, [user, isLoading, router])

   if (isLoading) {
      return null // Or a loading screen
   }

   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="(tabs)" />
         <Stack.Screen name="auth" />
         <Stack.Screen name="post" />
         <Stack.Screen name="profile" />
      </Stack>
   )
}

export default function RootLayout() {
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <ThemeProvider>
            <AuthProvider>
               <StatusBar style="auto" />
               <RootLayoutNav />
               <Toast />
            </AuthProvider>
         </ThemeProvider>
      </GestureHandlerRootView>
   )
}
