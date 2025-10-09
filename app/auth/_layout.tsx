import { Stack } from 'expo-router'

export default function AuthLayout() {
   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="welcome" />
         <Stack.Screen name="signup-form" />
         <Stack.Screen name="login" />
         <Stack.Screen name="forgot-password" />
         <Stack.Screen name="verify-otp" />
         <Stack.Screen name="new-password" />
      </Stack>
   )
}
