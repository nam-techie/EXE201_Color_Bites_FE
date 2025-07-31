'use client'

import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function ResetPasswordScreen() {
   const [newPassword, setNewPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const [showNewPassword, setShowNewPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

   // Password validation functions
   const hasMinLength = (password: string) => password.length >= 6
   const hasUppercase = (password: string) => /[A-Z]/.test(password)
   const hasLowercase = (password: string) => /[a-z]/.test(password)
   const hasNumber = (password: string) => /\d/.test(password)
   const hasSpecialChar = (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
   const passwordsMatch = () => newPassword === confirmPassword && confirmPassword.length > 0

   const isPasswordValid = () => {
      return hasMinLength(newPassword) && 
             hasUppercase(newPassword) && 
             hasLowercase(newPassword) && 
             hasNumber(newPassword) && 
             hasSpecialChar(newPassword) && 
             passwordsMatch()
   }

   const handleResetPassword = async () => {
      if (!newPassword) {
         Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới')
         return
      }

      if (!hasMinLength(newPassword)) {
         Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự')
         return
      }

      if (!hasUppercase(newPassword)) {
         Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 1 chữ cái viết hoa')
         return
      }

      if (!hasLowercase(newPassword)) {
         Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 1 chữ cái viết thường')
         return
      }

      if (!hasNumber(newPassword)) {
         Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 1 chữ số')
         return
      }

      if (!hasSpecialChar(newPassword)) {
         Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt')
         return
      }

      if (newPassword !== confirmPassword) {
         Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp')
         return
      }

      setIsLoading(true)
      try {
         // Simulate API call
         await new Promise(resolve => setTimeout(resolve, 2000))
         Alert.alert(
            'Thành công', 
            'Mật khẩu đã được đặt lại thành công!',
            [
               {
                  text: 'OK',
                  onPress: () => router.replace('/auth/login')
               }
            ]
         )
      } catch (error) {
         Alert.alert('Lỗi', 'Không thể đặt lại mật khẩu. Vui lòng thử lại.')
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
               <Text style={styles.title}>Đặt lại mật khẩu</Text>
               
               {/* Description */}
               <Text style={styles.description}>
                  Tạo mật khẩu mới cho tài khoản của bạn
               </Text>
               
               {/* New Password */}
               <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                  <View style={styles.inputWrapper}>
                     <TextInput
                        style={styles.passwordInput}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Nhập mật khẩu mới"
                        placeholderTextColor="#999"
                        secureTextEntry={!showNewPassword}
                     />
                     <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                     >
                        <Ionicons 
                           name={showNewPassword ? "eye-off" : "eye"} 
                           size={20} 
                           color="#666" 
                        />
                     </TouchableOpacity>
                  </View>
               </View>

               {/* Confirm Password */}
               <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
                  <View style={styles.inputWrapper}>
                     <TextInput
                        style={styles.passwordInput}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Xác nhận mật khẩu mới"
                        placeholderTextColor="#999"
                        secureTextEntry={!showConfirmPassword}
                     />
                     <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                     >
                        <Ionicons 
                           name={showConfirmPassword ? "eye-off" : "eye"} 
                           size={20} 
                           color="#666" 
                        />
                     </TouchableOpacity>
                  </View>
               </View>

               {/* Password Requirements */}
               <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
                  <Text style={[styles.requirement, hasMinLength(newPassword) && styles.requirementMet]}>
                     • Ít nhất 6 ký tự
                  </Text>
                  <Text style={[styles.requirement, hasUppercase(newPassword) && styles.requirementMet]}>
                     • Ít nhất 1 chữ cái viết hoa (A-Z)
                  </Text>
                  <Text style={[styles.requirement, hasLowercase(newPassword) && styles.requirementMet]}>
                     • Ít nhất 1 chữ cái viết thường (a-z)
                  </Text>
                  <Text style={[styles.requirement, hasNumber(newPassword) && styles.requirementMet]}>
                     • Ít nhất 1 chữ số (0-9)
                  </Text>
                  <Text style={[styles.requirement, hasSpecialChar(newPassword) && styles.requirementMet]}>
                     • Ít nhất 1 ký tự đặc biệt (!@#$%^&*...)
                  </Text>
                  <Text style={[styles.requirement, passwordsMatch() && styles.requirementMet]}>
                     • Mật khẩu xác nhận phải khớp
                  </Text>
               </View>

               {/* Reset Button */}
               <TouchableOpacity 
                  style={[styles.resetButton, (!isPasswordValid() || isLoading) && styles.resetButtonDisabled]}
                  onPress={handleResetPassword}
                  disabled={!isPasswordValid() || isLoading}
                  activeOpacity={0.8}
               >
                  <Ionicons name="key" size={20} color="#FFF" style={styles.buttonIcon} />
                  <Text style={[styles.resetButtonText, (!isPasswordValid() || isLoading) && styles.resetButtonTextDisabled]}>
                     {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                  </Text>
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
      marginBottom: 20,
   },
   inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
      marginBottom: 8,
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
   requirementsContainer: {
      marginBottom: 30,
      paddingHorizontal: 10,
   },
   requirementsTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#666',
      marginBottom: 8,
   },
   requirement: {
      fontSize: 14,
      color: '#999',
      marginBottom: 4,
   },
   requirementMet: {
      color: '#4CAF50',
   },
   resetButton: {
      backgroundColor: '#FF9500',
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
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
}) 