'use client'

import { useAuth } from '@/context/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

export default function SignUpFormScreen() {
   const { register } = useAuth()
   const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
   })
   const [errors, setErrors] = useState<{[key: string]: string}>({})
   const [isLoading, setIsLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

   // Password validation functions
   const hasMinLength = (password: string) => password.length >= 6
   const hasUppercase = (password: string) => /[A-Z]/.test(password)
   const hasLowercase = (password: string) => /[a-z]/.test(password)
   const hasNumber = (password: string) => /\d/.test(password)
   const hasSpecialChar = (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
   const passwordsMatch = () => formData.password === formData.confirmPassword && formData.confirmPassword.length > 0

   const validateForm = () => {
      const newErrors: {[key: string]: string} = {}

      if (!formData.username.trim()) {
         newErrors.username = 'Vui lòng nhập họ và tên'
      } else if (formData.username.trim().length < 6) {
         newErrors.username = 'Họ và tên phải có ít nhất 6 ký tự'
      }

      if (!formData.email.trim()) {
         newErrors.email = 'Vui lòng nhập email'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         newErrors.email = 'Email không hợp lệ'
      }

      if (!formData.password) {
         newErrors.password = 'Vui lòng nhập mật khẩu'
      } else if (!hasMinLength(formData.password)) {
         newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
      } else if (!hasUppercase(formData.password)) {
         newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ cái viết hoa'
      } else if (!hasLowercase(formData.password)) {
         newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ cái viết thường'
      } else if (!hasNumber(formData.password)) {
         newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ số'
      } else if (!hasSpecialChar(formData.password)) {
         newErrors.password = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'
      }

      if (!formData.confirmPassword) {
         newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
      } else if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = 'Mật khẩu không khớp'
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
   }

   const handleSubmit = async () => {
      if (!validateForm()) return

      setIsLoading(true)
      try {
         await register(
            formData.username, 
            formData.email, 
            formData.password, 
            formData.confirmPassword
         )
         
         Alert.alert(
            'Đăng ký thành công!', 
            'Tài khoản đã được tạo. Vui lòng đăng nhập để tiếp tục.',
            [
               {
                  text: 'Đăng nhập ngay',
                  onPress: () => router.replace('/auth/login')
               }
            ]
         )
      } catch (error) {
         console.error('Register error:', error)
         Alert.alert(
            'Đăng ký thất bại',
            error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
         )
      } finally {
         setIsLoading(false)
      }
   }

   const isFormValid = () => {
      return formData.username.trim() && 
             formData.username.trim().length >= 6 &&
             formData.email.trim() && 
             formData.password && 
             formData.confirmPassword &&
             hasMinLength(formData.password) &&
             hasUppercase(formData.password) &&
             hasLowercase(formData.password) &&
             hasNumber(formData.password) &&
             hasSpecialChar(formData.password) &&
             passwordsMatch()
   }

   const isDisabled = !isFormValid()

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

         <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
         >
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
            <Text style={styles.title}>Tạo tài khoản</Text>

            {/* Content */}
            <View style={styles.content}>
               {/* Full name */}
               <View style={styles.inputWrap}>
                  <TextInput
                     style={styles.input}
                     placeholder="Họ và tên"
                     placeholderTextColor="#9AA4B2"
                     value={formData.username}
                     onChangeText={(text) => {
                        setFormData({ ...formData, username: text })
                        
                        // Real-time validation
                        const newErrors = { ...errors }
                        if (!text.trim()) {
                           newErrors.username = 'Vui lòng nhập họ và tên'
                        } else if (text.trim().length < 6) {
                           newErrors.username = 'Họ và tên phải có ít nhất 6 ký tự'
                        } else {
                           delete newErrors.username
                        }
                        setErrors(newErrors)
                     }}
                     autoCapitalize="words"
                     returnKeyType="next"
                  />
               </View>
               {errors.username ? (
                  <Text style={styles.errorText}>{errors.username}</Text>
               ) : null}

               {/* Email */}
               <View style={styles.inputWrap}>
                  <TextInput
                     style={styles.input}
                     placeholder="Email"
                     placeholderTextColor="#9AA4B2"
                     value={formData.email}
                     onChangeText={(text) => {
                        setFormData({ ...formData, email: text })
                        if (errors.email) setErrors({ ...errors, email: '' })
                     }}
                     autoCapitalize="none"
                     keyboardType="email-address"
                     returnKeyType="next"
                  />
               </View>
               {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
               ) : null}

               {/* Password */}
               <View style={styles.inputWrap}>
                  <TextInput
                     style={[styles.input, { paddingRight: 44 }]}
                     placeholder="Mật khẩu"
                     placeholderTextColor="#9AA4B2"
                     value={formData.password}
                     onChangeText={(text) => {
                        setFormData({ ...formData, password: text })
                        if (errors.password) setErrors({ ...errors, password: '' })
                     }}
                     secureTextEntry={!showPassword}
                     autoCapitalize="none"
                  />
                  <TouchableOpacity
                     style={styles.eyeBtn}
                     onPress={() => setShowPassword(v => !v)}
                     hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                     <Ionicons 
                        name={showPassword ? 'eye' : 'eye-off'} 
                        size={20} 
                        color="#6B7280" 
                     />
                  </TouchableOpacity>
               </View>
               {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
               ) : null}

               {/* Confirm Password */}
               <View style={styles.inputWrap}>
                  <TextInput
                     style={[styles.input, { paddingRight: 44 }]}
                     placeholder="Xác nhận mật khẩu"
                     placeholderTextColor="#9AA4B2"
                     value={formData.confirmPassword}
                     onChangeText={(text) => {
                        setFormData({ ...formData, confirmPassword: text })
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
                     }}
                     secureTextEntry={!showConfirmPassword}
                     autoCapitalize="none"
                  />
                  <TouchableOpacity
                     style={styles.eyeBtn}
                     onPress={() => setShowConfirmPassword(v => !v)}
                     hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                     <Ionicons
                        name={showConfirmPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color="#6B7280"
                     />
                  </TouchableOpacity>
               </View>
               {errors.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
               ) : null}

               {/* Password checklist */}
               {formData.password.length > 0 && (
                  <View style={styles.requirementsContainer}>
                     <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
                     <Text style={[styles.requirement, hasMinLength(formData.password) && styles.requirementMet]}>
                        • Ít nhất 6 ký tự
                     </Text>
                     <Text style={[styles.requirement, hasUppercase(formData.password) && styles.requirementMet]}>
                        • Ít nhất 1 chữ cái viết hoa (A-Z)
                     </Text>
                     <Text style={[styles.requirement, hasLowercase(formData.password) && styles.requirementMet]}>
                        • Ít nhất 1 chữ cái viết thường (a-z)
                     </Text>
                     <Text style={[styles.requirement, hasNumber(formData.password) && styles.requirementMet]}>
                        • Ít nhất 1 chữ số (0-9)
                     </Text>
                     <Text style={[styles.requirement, hasSpecialChar(formData.password) && styles.requirementMet]}>
                        • Ít nhất 1 ký tự đặc biệt (!@#$%^&*...)
                     </Text>
                     <Text style={[styles.requirement, passwordsMatch() && styles.requirementMet]}>
                        • Mật khẩu xác nhận phải khớp
                     </Text>
                  </View>
               )}

               {/* Terms & Privacy */}
               <Text style={styles.legal}>
                  Bằng việc đăng ký, bạn chấp nhận{' '}
                  <Text
                     style={styles.link}
                     onPress={() => router.push('/auth/terms-of-service')}
                  >
                     Điều khoản dịch vụ
                  </Text>{' '}
                  và{' '}
                  <Text
                     style={styles.link}
                     onPress={() => router.push('/auth/privacy-policy')}
                  >
                     Chính sách quyền riêng tư
                  </Text>{' '}
                  của MUMII
               </Text>

               {/* Register button */}
               <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.registerBtn, isDisabled && styles.registerBtnDisabled]}
                  disabled={isDisabled}
                  onPress={handleSubmit}
               >
                  <Text style={[styles.registerText, isDisabled && styles.registerTextDisabled]}>
                     {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                  </Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      paddingBottom: 24,
   },

   /* Header */
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

   /* Title */
   title: {
      fontSize: 40,
      fontWeight: '800',
      color: '#111827',
      paddingHorizontal: 20,
      marginTop: 12,
      marginBottom: 24,
   },

   /* Content */
   content: {
      flex: 1,
      paddingHorizontal: 20,
   },

   /* Inputs */
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

   /* Error text */
   errorText: {
      color: '#DC2626',
      fontSize: 13,
      fontWeight: '500',
      marginBottom: 8,
      marginLeft: 4,
   },

   /* Password requirements */
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

   /* Terms & Privacy */
   legal: {
      fontSize: 16,
      lineHeight: 20,
      color: '#6B6B6B',
      textAlign: 'center',
      paddingHorizontal: 8,
      marginTop: 16,
      marginBottom: 8,
   },
   link: {
      color: '#4A90E2',
      textDecorationLine: 'underline',
   },

   /* Register button */
   registerBtn: {
      marginTop: 20,
      borderRadius: 28,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFB74D',
   },
   registerBtnDisabled: {
      backgroundColor: '#DDE3ED',
   },
   registerText: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
   },
   registerTextDisabled: {
      color: '#FFFFFF',
      opacity: 0.9,
   },
}) 