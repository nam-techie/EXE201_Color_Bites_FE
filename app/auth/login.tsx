'use client'

import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { loginUser } from '@/services/AuthService'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
   ActivityIndicator,
   Alert,
   Image,
   KeyboardAvoidingView,
   Platform,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import Toast from 'react-native-toast-message'

export default function LoginScreen() {
   const router = useRouter()
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [logoLoaded, setLogoLoaded] = useState(true)

   const handleLogin = async () => {
      if (username.trim().length === 0) {
         Alert.alert('Error', 'Please enter your username.')
         return
      }

      if (password.length < 6) {
         Alert.alert('Error', 'Password must be at least 6 characters.')
         return
      }

      setIsLoading(true)
      try {
         const response = await loginUser({ username, password })

         if (response.status === 200 && response.data?.token) {
            router.replace('/(tabs)')

            // Hiển thị Toast sau 10s
            setTimeout(() => {
               Toast.show({
                  type: 'success',
                  text1: 'Welcome!',
                  text2: 'You have successfully logged in.',
                  position: 'top',
                  visibilityTime: 3000,
               })
            }, 0)
         } else {
            Alert.alert('Login Failed', response.message)
         }
      } catch (error: any) {
         Alert.alert('Error', error.message || 'Something went wrong. Please try again.')
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
               style={styles.content}
            >
               <View style={styles.logoContainer}>
                  {!logoLoaded ? (
                     <ActivityIndicator size="small" color="#f97316" style={{ marginBottom: 16 }} />
                  ) : (
                     <TouchableOpacity
                        style={styles.logoRow}
                        onPress={() => router.push('/(tabs)')}
                        activeOpacity={0.7}
                     >
                        <Image
                           source={require('@/assets/images/logo.png')}
                           style={styles.logo}
                           resizeMode="contain"
                        />
                        <Text style={styles.brandText}>ColorBite</Text>
                     </TouchableOpacity>
                  )}
               </View>

               <View style={styles.form}>
                  <Input
                     label="Username"
                     placeholder="Enter your username"
                     value={username}
                     onChangeText={setUsername}
                     keyboardType="default"
                     leftIcon="person-outline"
                  />
                  <Input
                     label="Password"
                     placeholder="Enter your password"
                     value={password}
                     onChangeText={setPassword}
                     secureTextEntry
                     leftIcon="lock-closed-outline"
                  />
               </View>

               <Button title="Sign In" onPress={handleLogin} loading={isLoading} />

               <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => router.push('/auth/register')}>
                     <Text style={styles.signUpText}>Sign Up</Text>
                  </TouchableOpacity>
               </View>
            </KeyboardAvoidingView>
         </ScrollView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
   },
   content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
   },
   logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
   },
   logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   logo: {
      width: 48,
      height: 48,
      borderRadius: 6,
   },
   brandText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#f97316',
   },
   form: {
      marginBottom: 24,
   },
   footer: {
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   footerText: {
      color: '#4B5563',
      fontSize: 15,
   },
   signUpText: {
      fontWeight: '500',
      color: '#F97316',
      fontSize: 15,
   },
})
