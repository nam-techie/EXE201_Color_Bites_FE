import { AuthProvider, useAuth } from '@/context/AuthProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import ChatButton from '@/components/common/ChatButton'

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
   }, [user, isLoading])

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
         <Stack.Screen name="chat"/>
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
               <ChatButton/>
               <Toast />
            </AuthProvider>
         </ThemeProvider>
      </GestureHandlerRootView>
   )
}
