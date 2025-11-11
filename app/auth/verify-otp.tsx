'use client'

import { useAuth } from '@/context/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, Animated, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function VerifyOtpScreen() {
   const { verifyRegister, verifyResetPassword } = useAuth()
   const params = useLocalSearchParams()
   const email = params.email as string
   const type = params.type as string // 'register' hoặc 'reset-password'
   
   const [otp, setOtp] = useState(['', '', '', '', '', ''])
   const [isLoading, setIsLoading] = useState(false)
   const [countdown, setCountdown] = useState(60)
   const [canResend, setCanResend] = useState(false)
   const [focusedIndex, setFocusedIndex] = useState(0)
   const otpRefs = useRef<TextInput[]>([])
   const fadeAnim = useRef(new Animated.Value(0)).current

   useEffect(() => {
      // Fade in animation
      Animated.timing(fadeAnim, {
         toValue: 1,
         duration: 800,
         useNativeDriver: true,
      }).start()

      const timer = setInterval(() => {
         setCountdown((prev) => {
            if (prev <= 1) {
               setCanResend(true)
               return 0
            }
            return prev - 1
         })
      }, 1000)

      return () => clearInterval(timer)
   }, [fadeAnim])

   const handleOtpChange = (text: string, index: number) => {
      const newOtp = [...otp]
      
      // Only allow single digit
      if (text.length > 1) {
         text = text.slice(-1)
      }
      
      newOtp[index] = text
      setOtp(newOtp)

      // Auto focus next input if current input has value
      if (text && index < 5) {
         setFocusedIndex(index + 1)
         setTimeout(() => {
            otpRefs.current[index + 1]?.focus()
         }, 50)
      }
   }

   const handleOtpKeyPress = (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
         const newOtp = [...otp]
         
         // If current input is empty and we're not at the first input
         if (!newOtp[index] && index > 0) {
            // Clear previous input and focus it
            newOtp[index - 1] = ''
            setOtp(newOtp)
            setFocusedIndex(index - 1)
            setTimeout(() => {
               otpRefs.current[index - 1]?.focus()
            }, 50)
         } else if (newOtp[index]) {
            // Clear current input
            newOtp[index] = ''
            setOtp(newOtp)
         }
      }
   }

   const handleInputFocus = (index: number) => {
      setFocusedIndex(index)
   }

   const handleVerifyOtp = async () => {
      const otpString = otp.join('')
      
      if (otpString.length !== 6) {
         Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ 6 chữ số OTP')
         return
      }

      if (!email) {
         Alert.alert('Lỗi', 'Thiếu thông tin email')
         return
      }

      setIsLoading(true)
      try {
         if (type === 'register') {
            // Xác thực OTP đăng ký - lấy thông tin user từ AsyncStorage
            const userInfoStr = await AsyncStorage.getItem('pendingUserInfo')
            if (!userInfoStr) {
               Alert.alert('Lỗi', 'Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại.')
               return
            }
            
            const userInfo = JSON.parse(userInfoStr)
            console.log('📝 User info for verify:', userInfo)
            
            // Gọi API verify-register với đầy đủ thông tin
            await verifyRegister(email, otpString, userInfo.username, userInfo.password, userInfo.confirmPassword)
            
            // Xóa thông tin tạm thời
            await AsyncStorage.removeItem('pendingUserInfo')
            
            // Đăng ký thành công - chuyển về login
            Alert.alert(
               'Đăng ký thành công!', 
               'Tài khoản đã được tạo. Vui lòng đăng nhập để tiếp tục.',
               [
                  {
                     text: 'Đăng nhập',
                     onPress: () => router.replace('/auth/login')
                  }
               ]
            )
         } else if (type === 'reset-password') {
            // Xác thực OTP quên mật khẩu
            await verifyResetPassword(email, otpString)
            Alert.alert(
               'Thành công!', 
               'Mã OTP đã được xác thực. Bạn có thể đặt lại mật khẩu.',
               [
                  {
                     text: 'Đặt lại mật khẩu',
                     onPress: () => router.push({
                        pathname: '/auth/new-password',
                        params: { email }
                     })
                  }
               ]
            )
         } else {
            Alert.alert('Lỗi', 'Loại xác thực không hợp lệ. Vui lòng thử lại.')
         }
      } catch (error) {
         console.error('Verify OTP error:', error)
         Alert.alert(
            'Lỗi', 
            error instanceof Error ? error.message : 'Không thể xác thực OTP. Vui lòng thử lại.'
         )
      } finally {
         setIsLoading(false)
      }
   }

   const handleResendOtp = async () => {
      if (!canResend) return

      setCanResend(false)
      setCountdown(60)
      
      try {
         // TODO: Implement resend OTP API call
         // For now, just simulate
         await new Promise(resolve => setTimeout(resolve, 1000))
         Alert.alert('Thành công', 'Mã OTP mới đã được gửi đến email của bạn.')
      } catch {
         Alert.alert('Lỗi', 'Không thể gửi lại mã OTP. Vui lòng thử lại.')
         setCanResend(true)
      }
   }

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
         
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity 
               style={styles.backButton}
               onPress={() => {
                  // Quay về trang trước đó dựa trên type
                  if (type === 'register') {
                     router.push('/auth/signup-form')
                  } else if (type === 'reset-password') {
                     router.push('/auth/forgot-password')
                  } else {
                     router.push('/auth/login')
                  }
               }}
            >
               <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
         </View>

         {/* Title */}
         <Text style={styles.title}>Xác thực OTP</Text>

         {/* Content */}
         <Animated.View 
            style={[
               styles.content,
               { opacity: fadeAnim }
            ]}
         >
            {/* Description */}
            <Text style={styles.description}>
               Nhập mã OTP 6 chữ số đã được gửi đến email {email}
            </Text>
            
            {/* OTP Input */}
            <View style={styles.otpContainer}>
               <View style={styles.otpInputContainer}>
                  {otp.map((digit, index) => (
                     <View key={index} style={styles.otpInputWrapper}>
                        <TextInput
                           ref={(ref) => {
                              if (ref) otpRefs.current[index] = ref
                           }}
                           style={[
                              styles.otpInput,
                              focusedIndex === index && styles.otpInputFocused,
                              digit && styles.otpInputFilled
                           ]}
                           value={digit}
                           onChangeText={(text) => handleOtpChange(text, index)}
                           onKeyPress={(e) => handleOtpKeyPress(e, index)}
                           onFocus={() => handleInputFocus(index)}
                           keyboardType="numeric"
                           maxLength={1}
                           textAlign="center"
                           placeholder="0"
                           placeholderTextColor="#9AA4B2"
                           selectionColor="#FFB74D"
                        />
                     </View>
                  ))}
               </View>
            </View>

            {/* Verify Button */}
            <TouchableOpacity 
               style={[
                  styles.verifyButton, 
                  (!otp.join('') || isLoading) && styles.verifyButtonDisabled
               ]}
               onPress={handleVerifyOtp}
               disabled={!otp.join('') || isLoading}
               activeOpacity={0.9}
            >
               <Text style={[
                  styles.verifyButtonText, 
                  (!otp.join('') || isLoading) && styles.verifyButtonTextDisabled
               ]}>
                  {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
               </Text>
            </TouchableOpacity>

            {/* Resend OTP */}
            <View style={styles.resendContainer}>
               {canResend ? (
                  <TouchableOpacity 
                     onPress={handleResendOtp}
                     style={styles.resendButton}
                     activeOpacity={0.7}
                  >
                     <Text style={styles.resendOtpText}>Gửi lại mã OTP</Text>
                  </TouchableOpacity>
               ) : (
                  <Text style={styles.countdownText}>
                     Gửi lại mã OTP sau <Text style={styles.countdownHighlight}>{countdown}s</Text>
                  </Text>
               )}
            </View>
         </Animated.View>
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
   otpContainer: {
      marginBottom: 40,
   },
   otpInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
   },
   otpInputWrapper: {
      flex: 1,
      marginHorizontal: 4,
   },
   otpInput: {
      height: 60,
      borderWidth: 2,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      fontSize: 24,
      fontWeight: '600',
      color: '#111827',
      backgroundColor: '#F5F7FF',
      textAlign: 'center',
   },
   otpInputFocused: {
      borderColor: '#FFB74D',
      backgroundColor: '#FFFFFF',
   },
   otpInputFilled: {
      borderColor: '#10B981',
      backgroundColor: '#F0FDF4',
   },
   verifyButton: {
      marginTop: 8,
      borderRadius: 28,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFB74D',
   },
   verifyButtonDisabled: {
      backgroundColor: '#DDE3ED',
   },
   verifyButtonText: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
   },
   verifyButtonTextDisabled: {
      color: '#FFFFFF',
      opacity: 0.9,
   },
   resendContainer: {
      alignItems: 'center',
      marginTop: 20,
   },
   resendButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
   },
   resendOtpText: {
      color: '#FB8C00',
      fontSize: 18,
      fontWeight: '700',
   },
   countdownText: {
      color: '#6B7280',
      fontSize: 16,
      fontWeight: '500',
   },
   countdownHighlight: {
      color: '#FB8C00',
      fontWeight: '700',
   },
}) 