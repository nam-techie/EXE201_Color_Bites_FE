'use client'

import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useState } from 'react'
import {
   Alert,
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   TouchableOpacity,
   View
} from 'react-native'

export default function SignUpFormScreen() {
   const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
   })
   const [errors, setErrors] = useState<{[key: string]: string}>({})

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

   const handleSubmit = () => {
      if (validateForm()) {
         Alert.alert('Thành công', 'Tài khoản đã được tạo thành công!')
         router.replace('/(tabs)')
      }
   }

   const isFormValid = () => {
      return formData.username.trim() && 
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

   const disabled = !isFormValid()

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="transparent" />

         <LinearGradient
            colors={[ '#FFF4EA', '#FFE6D3', '#FFD7BF' ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
         >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
               {/* Header */}
               <View style={styles.header}>
                  <TouchableOpacity 
                     style={styles.backButton}
                     onPress={() => router.back()}
                  >
                     <Ionicons name="arrow-back" size={22} color="#111" />
                  </TouchableOpacity>
               </View>

               {/* Centered Card */}
               <View style={styles.centerWrapper}>
                  <View style={styles.card}>
                     {/* Brand */}
                     <View style={styles.logoWrap}>
                        <LinearGradient
                           colors={[ '#FFAB74', '#FF8A3D', '#FFD6A5' ]}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 1 }}
                           style={styles.logo}
                        >
                           <Ionicons name="person-add" size={20} color="#fff" />
                        </LinearGradient>
                     </View>

                     <Text style={styles.title}>Tạo tài khoản</Text>
                     <Text style={styles.subtitle}>Đăng ký bằng email của bạn để tiếp tục</Text>

                     <View style={{ marginTop: 16 }}>
                        <Input
                           label="Họ và tên"
                           placeholder="Nhập họ và tên của bạn"
                           value={formData.username}
                           onChangeText={(text) => {
                              setFormData({ ...formData, username: text })
                              if (errors.username) setErrors({ ...errors, username: '' })
                           }}
                           leftIcon="person"
                           error={errors.username}
                        />

                        <Input
                           label="Email"
                           placeholder="Nhập email của bạn"
                           value={formData.email}
                           onChangeText={(text) => {
                              setFormData({ ...formData, email: text })
                              if (errors.email) setErrors({ ...errors, email: '' })
                           }}
                           keyboardType="email-address"
                           leftIcon="mail"
                           error={errors.email}
                        />

                        <Input
                           label="Mật khẩu"
                           placeholder="Tạo mật khẩu"
                           value={formData.password}
                           onChangeText={(text) => {
                              setFormData({ ...formData, password: text })
                              if (errors.password) setErrors({ ...errors, password: '' })
                           }}
                           secureTextEntry
                           leftIcon="lock-closed"
                           error={errors.password}
                        />

                        <Input
                           label="Xác nhận mật khẩu"
                           placeholder="Xác nhận mật khẩu"
                           value={formData.confirmPassword}
                           onChangeText={(text) => {
                              setFormData({ ...formData, confirmPassword: text })
                              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' })
                           }}
                           secureTextEntry
                           leftIcon="shield-checkmark"
                           error={errors.confirmPassword}
                        />

                        {/* Password checklist */}
                        {formData.password.length > 0 && (
                           <View style={styles.requirementsContainer}>
                              <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
                              <Text style={[styles.requirement, hasMinLength(formData.password) && styles.requirementMet]}>• Ít nhất 6 ký tự</Text>
                              <Text style={[styles.requirement, hasUppercase(formData.password) && styles.requirementMet]}>• Ít nhất 1 chữ cái viết hoa (A-Z)</Text>
                              <Text style={[styles.requirement, hasLowercase(formData.password) && styles.requirementMet]}>• Ít nhất 1 chữ cái viết thường (a-z)</Text>
                              <Text style={[styles.requirement, hasNumber(formData.password) && styles.requirementMet]}>• Ít nhất 1 chữ số (0-9)</Text>
                              <Text style={[styles.requirement, hasSpecialChar(formData.password) && styles.requirementMet]}>• Ít nhất 1 ký tự đặc biệt (!@#$%^&*...)</Text>
                              <Text style={[styles.requirement, passwordsMatch() && styles.requirementMet]}>• Mật khẩu xác nhận phải khớp</Text>
                           </View>
                        )}

                        {/* CTA gradient */}
                        <LinearGradient
                           colors={['#FFAB74', '#FF69B4', '#C16CE1']}
                           locations={[0.24, 0.63, 1]}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 1 }}
                           style={styles.gradientCta}
                        >
                           <Button
                              title="Tạo tài khoản"
                              onPress={() => { if (disabled) return; handleSubmit() }}
                              variant="ghost"
                              loading={false}
                              style={styles.ctaButton}
                              textStyle={styles.ctaText}
                           />
                        </LinearGradient>

                        {/* Back to login */}
                        <View style={styles.signInRow}>
                           <Text style={styles.signInText}>Đã có tài khoản?</Text>
                           <TouchableOpacity onPress={() => router.push('/auth/login')}>
                              <Text style={styles.signInLink}> Đăng nhập</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </View>
               </View>
            </ScrollView>
         </LinearGradient>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'transparent',
   },
   scrollView: {
      flex: 1,
   },
   header: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 4,
   },
   backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(17,17,17,0.06)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   centerWrapper: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      marginTop: 24,
   },
   card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
   },
   logoWrap: {
      alignItems: 'center',
      marginBottom: 8,
   },
   logo: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
   },
   title: {
      fontSize: 22,
      fontWeight: '800',
      color: '#FF8A3D',
      textAlign: 'center',
   },
   subtitle: {
      fontSize: 13,
      color: '#6b7280',
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 8,
   },
   requirementsContainer: {
      marginTop: 8,
      marginBottom: 12,
      paddingHorizontal: 4,
   },
   requirementsTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: '#6b7280',
      marginBottom: 6,
   },
   requirement: {
      fontSize: 13,
      color: '#9ca3af',
      marginBottom: 3,
   },
   requirementMet: {
      color: '#10B981',
   },
   gradientCta: {
      marginTop: 8,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#f97316',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 3,
   },
   ctaButton: {
      borderRadius: 12,
      backgroundColor: 'transparent',
   },
   ctaText: {
      fontWeight: '700',
      color: '#fff',
   },
   signInRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
   },
   signInText: {
      fontSize: 13,
      color: '#6b7280',
   },
   signInLink: {
      fontSize: 13,
      color: '#f97316',
      fontWeight: '700',
   },
}) 