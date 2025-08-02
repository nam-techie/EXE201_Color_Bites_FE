import { AuthProvider } from '@/context/AuthProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import '../global.css'
export default function RootLayout() {
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <ThemeProvider>
            <AuthProvider>
               <StatusBar style="auto" />
               <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="auth" />
               </Stack>
               <Toast />
            </AuthProvider>
         </ThemeProvider>
      </GestureHandlerRootView>
   )
}
