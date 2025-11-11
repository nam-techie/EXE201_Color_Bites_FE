'use client'

import { Ionicons } from '@expo/vector-icons'
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
         <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
         
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity 
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
         </View>

         {/* Title */}
         <Text style={styles.title}>Đặt lại mật khẩu</Text>

         {/* Content */}
         <View style={styles.content}>         
            {/* New Password */}
            <View style={styles.inputWrap}>
               <TextInput
                  style={[styles.input, { paddingRight: 44 }]}
                  placeholder="Mật khẩu mới"
                  placeholderTextColor="#9AA4B2"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
               />
               <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
               >
                  <Ionicons
                     name={showNewPassword ? 'eye' : 'eye-off'}
                     size={20}
                     color="#6B7280"
                  />
               </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrap}>
               <TextInput
                  style={[styles.input, { paddingRight: 44 }]}
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor="#9AA4B2"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
               />
               <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
               >
                  <Ionicons
                     name={showConfirmPassword ? 'eye' : 'eye-off'}
                     size={20}
                     color="#6B7280"
                  />
               </TouchableOpacity>
            </View>

            {/* Password Requirements */}
            {newPassword.length > 0 && (
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
            )}

            {/* Reset Button */}
            <TouchableOpacity 
               style={[styles.resetButton, (!isPasswordValid() || isLoading) && styles.resetButtonDisabled]}
               onPress={handleResetPassword}
               disabled={!isPasswordValid() || isLoading}
               activeOpacity={0.9}
            >
               <Text style={[styles.resetButtonText, (!isPasswordValid() || isLoading) && styles.resetButtonTextDisabled]}>
                  {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
               </Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
   },
   header: {
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: -50,
   },
   backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
   },
   title: {
      fontSize: 40,
      fontWeight: '800',
      color: '#111827',
      paddingHorizontal: 20,
      marginTop: 12,
      marginBottom: 24,
   },
   content: {
      flex: 1,
      paddingHorizontal: 20,
   },
   description: {
      fontSize: 18,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
      paddingHorizontal: 20,
   },
   inputWrap: {
      position: 'relative',
      marginBottom: 20,
   },
   input: {
      backgroundColor: '#F5F7FF',
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 14,
      fontSize: 20,
      color: '#111827',
   },
   eyeBtn: {
      position: 'absolute',
      right: 12,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
   },
   requirementsContainer: {
      marginTop: 8,
      marginBottom: 12,
      paddingHorizontal: 4,
   },
   requirementsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#6B7280',
      marginBottom: 6,
   },
   requirement: {
      fontSize: 14,
      color: '#9CA3AF',
      marginBottom: 3,
   },
   requirementMet: {
      color: '#10B981',
   },
   resetButton: {
      marginTop: 8,
      borderRadius: 28,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFB74D',
   },
   resetButtonDisabled: {
      backgroundColor: '#DDE3ED',
   },
   resetButtonText: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
   },
   resetButtonTextDisabled: {
      color: '#FFFFFF',
      opacity: 0.9,
   },
}) 