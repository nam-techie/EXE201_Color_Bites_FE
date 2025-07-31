'use client'

import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { authService } from '../../services/authService'

export default function ForgotPasswordScreen() {
   const [email, setEmail] = useState('')
   const [isLoading, setIsLoading] = useState(false)

   const handleResetPassword = async () => {
      if (!email.trim()) {
         Alert.alert('Lỗi', 'Vui lòng nhập email của bạn')
         return
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
         Alert.alert('Lỗi', 'Email không hợp lệ')
         return
      }

      setIsLoading(true)
      try {
         const response = await authService.forgotPassword(email)
         console.log('✅ Forgot password successful:', response.message)
         Alert.alert(
            'Thành công', 
            response.message || 'Email đặt lại mật khẩu đã được gửi!',
            [
               {
                  text: 'OK',
                  onPress: () => router.push('/auth/reset-password')
               }
            ]
         )
      } catch (error: any) {
         console.error('❌ Forgot password failed:', error)
         const errorMessage = error.response?.data?.message || error.message || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.'
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
               <Text style={styles.title}>Quên mật khẩu?</Text>
               
               {/* Description */}
               <Text style={styles.description}>
                  Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
               </Text>
               
               {/* Email Input */}
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

               {/* Reset Button */}
               <TouchableOpacity 
                  style={[styles.resetButton, (!email.trim() || isLoading) && styles.resetButtonDisabled]}
                  onPress={handleResetPassword}
                  disabled={!email.trim() || isLoading}
                  activeOpacity={0.8}
               >
                  <Ionicons name="mail" size={20} color="#FFF" style={styles.buttonIcon} />
                  <Text style={[styles.resetButtonText, (!email.trim() || isLoading) && styles.resetButtonTextDisabled]}>
                     {isLoading ? 'Đang xử lý...' : 'Gửi email đặt lại'}
                  </Text>
               </TouchableOpacity>

               {/* Back to Login */}
               <TouchableOpacity 
                  style={styles.backToLogin}
                  onPress={() => router.push('/auth/login')}
               >
                  <Ionicons name="arrow-back" size={16} color="#FF9500" style={styles.backIcon} />
                  <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
               </TouchableOpacity>
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
   inputContainer: {
      marginBottom: 30,
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
   resetButton: {
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
   resetButtonDisabled: {
      backgroundColor: '#DDD',
      shadowOpacity: 0,
      elevation: 0,
   },
   resetButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
   },
   resetButtonTextDisabled: {
      color: '#999',
   },
   buttonIcon: {
      marginRight: 8,
   },
   backToLogin: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   backIcon: {
      marginRight: 8,
   },
   backToLoginText: {
      fontSize: 16,
      color: '#FF9500',
      fontWeight: '500',
   },
}) 