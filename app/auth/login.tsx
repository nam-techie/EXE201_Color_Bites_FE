'use client'

import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useAuth } from '@/context/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function LoginScreen() {
   const [email, setEmail] = useState('test123')  // Pre-fill for testing
   const [password, setPassword] = useState('test123')  // Pre-fill for testing
   const [isLoading, setIsLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const [rememberMe, setRememberMe] = useState(false)
   const [errorMessage, setErrorMessage] = useState('')
   const { login } = useAuth()

   const handleLogin = async () => {
      // Clear previous error
      setErrorMessage('')
      
      if (!email || !password) {
         setErrorMessage('Vui lòng nhập đầy đủ thông tin')
         return
      }

      setIsLoading(true)
      try {
         // Use real AuthProvider login
         await login(email, password)
         router.replace('/(tabs)')
      } catch (error) {
         console.error('Login error:', error)
         setErrorMessage(error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.')
      } finally {
         setIsLoading(false)
      }
   }

   const isDisabled = !email || !password || isLoading
   const ctaTextStyle = [styles.ctaText, isDisabled && styles.ctaTextDisabled]

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

         <LinearGradient
            colors={[
               '#FFF4EA', // light peach
               '#FFE6D3', // soft orange 1
               '#FFD7BF', // soft orange 2
            ]}
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
                  <Ionicons name="arrow-back" size={22} color="#111" />
               </TouchableOpacity>
            </View>

            {/* Centered Card */}
            <View style={styles.centerWrapper}>
               <View style={styles.card}>
                  {/* Logo / Brand */}
                  <View style={styles.logoWrap}>
                     <LinearGradient
                        colors={[ '#FFAB74', '#FF8A3D', '#FFD6A5' ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logo}
                     >
                        <Ionicons name="restaurant" size={20} color="#fff" />
                     </LinearGradient>
                  </View>

                  <Text style={styles.title}>Color Bites</Text>
                  <Text style={styles.subtitle}>Vui lòng nhập thông tin để tiếp tục</Text>

                  {/* Form */}
                  <View style={{ marginTop: 16 }}>
                     <Input
                        label="Địa chỉ Email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        leftIcon="mail"
                     />

                     <View>
                        <Input
                           label="Mật khẩu"
                           placeholder="Nhập mật khẩu của bạn"
                           value={password}
                           onChangeText={setPassword}
                           secureTextEntry
                           leftIcon="lock-closed"
                        />
                     </View>

                     {/* Error Message */}
                     {errorMessage ? (
                        <View style={styles.errorContainer}>
                           <Ionicons name="alert-circle" size={16} color="#dc2626" />
                           <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                     ) : null}

                     {/* Remember / Forgot */}
                     <View style={styles.rowBetween}>
                        <TouchableOpacity style={styles.rememberWrap} onPress={() => setRememberMe(!rememberMe)}>
                           <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                              {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
                           </View>
                           <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                           <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                     </View>

                     {/* CTA with high-contrast gradient (colorful even when disabled) */}
                     <LinearGradient
                        colors={['#FFAB74', '#FF69B4', '#C16CE1']}
                        locations={[0.24, 0.63, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientCta}
                     >
                        <Button
                           title={isLoading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
                           onPress={() => { if (isDisabled) return; handleLogin() }}
                           loading={isLoading}
                           disabled={false}
                           variant="ghost"
                           style={styles.ctaButton}
                           textStyle={styles.ctaText}
                        />
                     </LinearGradient>

                     {/* Divider */}
                     <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>Hoặc</Text>
                        <View style={styles.divider} />
                     </View>

                     {/* Social Buttons */}
                     <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                           <Ionicons name="logo-google" size={18} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                           <Ionicons name="logo-facebook" size={18} color="#1877F2" />
                        </TouchableOpacity>
                     </View>

                     {/* Signup */}
                     <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Chưa có tài khoản?</Text>
                        <TouchableOpacity onPress={() => router.push('/auth/signup-options')}>
                           <Text style={styles.signUpLink}> Đăng ký</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
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
      paddingHorizontal: 16,
      paddingTop: 16,
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
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 12,
      justifyContent: 'center',
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
   rowBetween: {
      marginTop: 6,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   rememberWrap: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   checkbox: {
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
   },
   checkboxChecked: {
      backgroundColor: '#f97316',
      borderColor: '#f97316',
   },
   rememberText: {
      color: '#6b7280',
      fontSize: 13,
   },
   forgotPasswordText: {
      color: '#f97316',
      fontSize: 13,
      fontWeight: '600',
   },
   gradientCta: {
      marginTop: 12,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#f97316',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
   },
   ctaButton: {
      borderRadius: 12,
      backgroundColor: 'transparent',
   },
   ctaText: {
      fontWeight: '700',
      color: '#ffffff',
   },
   ctaTextDisabled: {
      color: '#374151',
      fontWeight: '700',
   },
   dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 14,
   },
   divider: {
      flex: 1,
      height: 1,
      backgroundColor: '#e5e7eb',
   },
   dividerText: {
      color: '#9ca3af',
      fontSize: 12,
      marginHorizontal: 8,
   },
   socialRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginTop: 10,
   },
   socialBtn: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
   },
   signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
   },
   signUpText: {
      fontSize: 13,
      color: '#6b7280',
   },
   signUpLink: {
      fontSize: 13,
      color: '#f97316',
      fontWeight: '700',
   },
   errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 8,
      gap: 8,
   },
   errorText: {
      flex: 1,
      fontSize: 13,
      color: '#dc2626',
      fontWeight: '500',
   },
})
