'use client'

import { CrossPlatformGradient } from '@/components/CrossPlatformGradient'
import { useAuth } from '@/context/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
         newErrors.username = 'Vui lòng nhập Username'
      } else if (formData.username.trim().length < 6) {
         newErrors.username = 'Username phải có ít nhất 6 ký tự'
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
         // Chỉ gửi email để nhận OTP
         await register(formData.email)
         
         // Lưu thông tin user vào AsyncStorage để dùng trong verify-otp
         const userInfo = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
         }
         await AsyncStorage.setItem('pendingUserInfo', JSON.stringify(userInfo))
         
         // Gửi OTP thành công, chuyển đến trang verify OTP
         Alert.alert(
            'OTP đã được gửi!', 
            'Mã OTP đã được gửi đến email của bạn. Vui lòng xác thực để tạo tài khoản.',
            [
               {
                  text: 'Xác thực OTP',
                  onPress: () => router.push({
                     pathname: '/auth/verify-otp',
                     params: { 
                        email: formData.email,
                        type: 'register'
                     }
                  })
               }
            ]
         )
      } catch (error) {
         console.error('Register error:', error)
         const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
         
         // Chỉ hiển thị lỗi cho các vấn đề technical thực sự
         // KHÔNG hiển thị lỗi cho business logic như "email đã sử dụng"
         Alert.alert(
            'Lỗi đăng ký',
            errorMessage,
            [
               {
                  text: 'Thử lại',
                  onPress: () => {
                     // User có thể thử lại với cùng email hoặc email khác
                     console.log('User chọn thử lại đăng ký')
                  }
               }
            ]
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
         <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

         <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
         >
            {/* Header */}
            <View style={styles.header}>
               <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => router.push('/auth/welcome')}
               >
                  <Ionicons name="arrow-back" size={24} color="#111827" />
               </TouchableOpacity>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
               <Text style={styles.title}>Tạo tài khoản</Text>
               <Text style={styles.subtitle}>Tham gia cộng đồng foodie của chúng tôi</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
               {/* Username */}
               <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <View style={[styles.inputWrap, errors.username && styles.inputWrapError]}>
                     <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                     <TextInput
                        style={styles.input}
                        placeholder="Nhập username của bạn"
                        placeholderTextColor="#9CA3AF"
                        value={formData.username}
                        onChangeText={(text) => {
                           setFormData({ ...formData, username: text })
                           
                           const newErrors = { ...errors }
                           if (!text.trim()) {
                              newErrors.username = 'Vui lòng nhập username'
                           } else if (text.trim().length < 6) {
                              newErrors.username = 'Username phải có ít nhất 6 ký tự'
                           } else {
                              delete newErrors.username
                           }
                           setErrors(newErrors)
                        }}
                        autoCapitalize="none"
                        returnKeyType="next"
                     />
                  </View>
                  {errors.username ? (
                     <Text style={styles.errorText}>{errors.username}</Text>
                  ) : null}
               </View>

               {/* Email */}
               <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={[styles.inputWrap, errors.email && styles.inputWrapError]}>
                     <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                     <TextInput
                        style={styles.input}
                        placeholder="example@email.com"
                        placeholderTextColor="#9CA3AF"
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
               </View>

               {/* Password */}
               <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Mật khẩu</Text>
                  <View style={[styles.inputWrap, errors.password && styles.inputWrapError]}>
                     <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                     <TextInput
                        style={[styles.input, { paddingRight: 44 }]}
                        placeholder="Nhập mật khẩu"
                        placeholderTextColor="#9CA3AF"
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
               </View>

               {/* Confirm Password */}
               <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
                  <View style={[styles.inputWrap, errors.confirmPassword && styles.inputWrapError]}>
                     <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                     <TextInput
                        style={[styles.input, { paddingRight: 44 }]}
                        placeholder="Nhập lại mật khẩu"
                        placeholderTextColor="#9CA3AF"
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
               </View>

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
                  activeOpacity={0.85}
                  disabled={isDisabled}
                  onPress={handleSubmit}
               >
                  {isDisabled ? (
                     <View style={styles.registerBtnDisabled}>
                        <Text style={styles.registerTextDisabled}>
                           {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </Text>
                     </View>
                  ) : (
                     <CrossPlatformGradient
                        colors={['#FF6B35', '#FF1493']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.registerBtn}
                     >
                        <Text style={styles.registerText}>
                           {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </Text>
                     </CrossPlatformGradient>
                  )}
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      paddingBottom: 24,
   },

   /* Header */
   header: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 12,
   },
   backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
   },

   /* Title Section */
   titleSection: {
      paddingHorizontal: 20,
      marginBottom: 28,
   },
   title: {
      fontSize: 32,
      fontWeight: '800',
      color: '#111827',
      marginBottom: 8,
   },
   subtitle: {
      fontSize: 15,
      color: '#6B7280',
      lineHeight: 22,
   },

   /* Content */
   content: {
      flex: 1,
      paddingHorizontal: 20,
   },

   /* Inputs */
   inputContainer: {
      marginBottom: 20,
   },
   inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 8,
   },
   inputWrap: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: '#E5E7EB',
      paddingHorizontal: 16,
   },
   inputWrapError: {
      borderColor: '#EF4444',
   },
   inputIcon: {
      marginRight: 10,
   },
   input: {
      flex: 1,
      paddingVertical: 14,
      fontSize: 15,
      color: '#111827',
   },
   eyeBtn: {
      padding: 8,
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
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      marginBottom: 6,
   },
   requirement: {
      fontSize: 13,
      color: '#9CA3AF',
      marginBottom: 3,
   },
   requirementMet: {
      color: '#10B981',
   },

   /* Terms & Privacy */
   legal: {
      fontSize: 13,
      lineHeight: 18,
      color: '#9CA3AF',
      textAlign: 'center',
      paddingHorizontal: 8,
      marginTop: 16,
      marginBottom: 8,
   },
   link: {
      color: '#FF6B35',
      fontWeight: '500',
   },

   /* Register button */
   registerBtn: {
      marginTop: 20,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#FF1493',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 4,
   },
   registerBtnDisabled: {
      marginTop: 20,
      height: 52,
      borderRadius: 26,
      backgroundColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
   },
   registerText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
   },
   registerTextDisabled: {
      fontSize: 16,
      fontWeight: '600',
      color: '#9CA3AF',
   },
}) 