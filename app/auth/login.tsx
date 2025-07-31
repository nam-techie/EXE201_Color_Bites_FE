'use client'

import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { authService } from '../../services/authService'

export default function LoginScreen() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)

   const handleLogin = async () => {
      if (!email || !password) {
         Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin')
         return
      }

      setIsLoading(true)
      try {
         const response = await authService.login({ email, password })
         console.log('✅ Login successful:', response.data?.username)
         Alert.alert('Thành công', `Chào mừng ${response.data?.username}!`)
         router.replace('/(tabs)')
      } catch (error: any) {
         console.error('❌ Login failed:', error)
         const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
         Alert.alert('Lỗi', errorMessage)
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
         
         <LinearGradient
            colors={['#FDF6E3', '#FFE4B5', '#FFD700']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
         >
            {/* Header */}
            <View style={styles.header}>
               <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => router.back()}
               >
                  <Ionicons name="arrow-back" size={24} color="#000" />
               </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
               {/* Title */}
               <Text style={styles.title}>Đăng Nhập</Text>
               
               {/* Description */}
               <Text style={styles.description}>
                  Chào mừng bạn trở lại với ColorBite
               </Text>
               
               {/* Form */}
               <View style={styles.form}>
                  {/* Email */}
                  <View style={styles.inputContainer}>
                     <Text style={styles.inputLabel}>Email</Text>
                     <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Nhập email của bạn"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                     />
                  </View>

                  {/* Password */}
                  <View style={styles.inputContainer}>
                     <Text style={styles.inputLabel}>Mật khẩu</Text>
                     <View style={styles.inputWrapper}>
                        <TextInput
                           style={styles.passwordInput}
                           value={password}
                           onChangeText={setPassword}
                           placeholder="Nhập mật khẩu"
                           placeholderTextColor="#999"
                           secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity 
                           style={styles.eyeButton}
                           onPress={() => setShowPassword(!showPassword)}
                        >
                           <Ionicons 
                              name={showPassword ? "eye-off" : "eye"} 
                              size={20} 
                              color="#666" 
                           />
                        </TouchableOpacity>
                     </View>
                  </View>

                  {/* Forgot Password */}
                  <TouchableOpacity 
                     style={styles.forgotPassword}
                     onPress={() => router.push('/auth/forgot-password')}
                  >
                     <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                  </TouchableOpacity>
               </View>

               {/* Login Button */}
               <TouchableOpacity 
                  style={[styles.loginButton, (!email || !password || isLoading) && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={!email || !password || isLoading}
                  activeOpacity={0.8}
               >
                  <Ionicons name="log-in" size={20} color="#FFF" style={styles.buttonIcon} />
                  <Text style={[styles.loginButtonText, (!email || !password || isLoading) && styles.loginButtonTextDisabled]}>
                     {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                  </Text>
               </TouchableOpacity>

               {/* Sign Up Link */}
               <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Chưa có tài khoản? </Text>
                  <TouchableOpacity onPress={() => router.push('/auth/signup-options')}>
                     <Text style={styles.signUpLink}>Đăng ký ngay</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </LinearGradient>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   gradient: {
      flex: 1,
   },
   header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
   },
   backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   content: {
      flex: 1,
      paddingHorizontal: 40,
      paddingTop: 20,
   },
   title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      marginBottom: 16,
      letterSpacing: -0.5,
   },
   description: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
   },
   form: {
      marginBottom: 30,
   },
   inputContainer: {
      marginBottom: 20,
   },
   inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
      marginBottom: 8,
   },
   input: {
      borderBottomWidth: 1,
      borderBottomColor: '#DDD',
      paddingVertical: 12,
      fontSize: 16,
      color: '#000',
   },
   inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#DDD',
   },
   passwordInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: '#000',
   },
   eyeButton: {
      padding: 8,
   },
   forgotPassword: {
      alignItems: 'flex-end',
      marginTop: 10,
   },
   forgotPasswordText: {
      color: '#FF9500',
      fontSize: 14,
      fontWeight: '500',
   },
   loginButton: {
      backgroundColor: '#FF9500',
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 30,
      shadowColor: '#FF9500',
      shadowOffset: {
         width: 0,
         height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
   },
   loginButtonDisabled: {
      backgroundColor: '#DDD',
      shadowOpacity: 0,
      elevation: 0,
   },
   loginButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
   },
   loginButtonTextDisabled: {
      color: '#999',
   },
   buttonIcon: {
      marginRight: 8,
   },
   signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   signUpText: {
      fontSize: 16,
      color: '#666',
   },
   signUpLink: {
      fontSize: 16,
      color: '#FF9500',
      fontWeight: '600',
   },
})
