// Side-effect imports are placed in index.js to avoid duplicate loads

import { AuthProvider, useAuth } from '@/context/AuthProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
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
         <Stack.Screen name="profile-images" />
         <Stack.Screen name="profile-posts" />
      </Stack>
   )
}

export default function RootLayout() {
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
               <ThemeProvider>
                  <AuthProvider>
                     <StatusBar style="auto" />
                     <RootLayoutNav />
                     <Toast />
                  </AuthProvider>
               </ThemeProvider>
            </SafeAreaView>
         </SafeAreaProvider>
      </GestureHandlerRootView>
   )
}
