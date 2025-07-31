'use client'

import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, Animated, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { authService } from '../../services/authService'

export default function VerifyOtpScreen() {
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
   }, [])

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

      setIsLoading(true)
      try {
         const response = await authService.verifyOtp('user@example.com', otpString) // Email sẽ được lấy từ navigation params
         console.log('✅ Verify OTP successful:', response.message)
         
         Alert.alert(
            'Thành công', 
            response.message || 'Mã OTP đã được xác thực!',
            [
               {
                  text: 'Tiếp tục',
                  onPress: () => router.push('/auth/new-password')
               }
            ]
         )
      } catch (error: any) {
         console.error('❌ Verify OTP failed:', error)
         const errorMessage = error.response?.data?.message || error.message || 'Mã OTP không đúng. Vui lòng thử lại.'
         Alert.alert('Lỗi', errorMessage)
      } finally {
         setIsLoading(false)
      }
   }

   const handleResendOtp = async () => {
      if (!canResend) return

      setCanResend(false)
      setCountdown(60)
      
      try {
         const response = await authService.resendOtp('user@example.com') // Email sẽ được lấy từ navigation params
         console.log('✅ Resend OTP successful:', response.message)
         Alert.alert('Thành công', response.message || 'Mã OTP mới đã được gửi đến email của bạn.')
      } catch (error: any) {
         console.error('❌ Resend OTP failed:', error)
         const errorMessage = error.response?.data?.message || error.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.'
         Alert.alert('Lỗi', errorMessage)
         setCanResend(true)
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
            <Animated.View 
               style={[
                  styles.content,
                  { opacity: fadeAnim }
               ]}
            >
               {/* Title */}
               <Text style={styles.title}>Xác thực OTP</Text>
               
               {/* Description */}
               <Text style={styles.description}>
                  Nhập mã OTP 6 chữ số đã được gửi đến email của bạn
               </Text>
               
               {/* OTP Input */}
               <View style={styles.otpContainer}>
                  <Text style={styles.otpLabel}>Mã OTP</Text>
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
                              placeholderTextColor="#CCC"
                              selectionColor="#FF9500"
                           />
                           {focusedIndex === index && (
                              <View style={styles.focusIndicator} />
                           )}
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
                  activeOpacity={0.8}
               >
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" style={styles.buttonIcon} />
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
                        <Ionicons name="refresh" size={16} color="#FF9500" style={styles.resendIcon} />
                        <Text style={styles.resendOtpText}>Gửi lại mã OTP</Text>
                     </TouchableOpacity>
                  ) : (
                     <Text style={styles.countdownText}>
                        Gửi lại mã OTP sau <Text style={styles.countdownHighlight}>{countdown}s</Text>
                     </Text>
                  )}
               </View>
            </Animated.View>
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
      marginBottom: 50,
      paddingHorizontal: 20,
   },
   otpContainer: {
      marginBottom: 50,
   },
   otpLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: '#000',
      marginBottom: 24,
      textAlign: 'center',
   },
   otpInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
   },
   otpInputWrapper: {
      position: 'relative',
   },
   otpInput: {
      width: 50,
      height: 60,
      borderWidth: 2,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      backgroundColor: '#FFF',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   otpInputFocused: {
      borderColor: '#FF9500',
      shadowColor: '#FF9500',
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
   },
   otpInputFilled: {
      borderColor: '#4CAF50',
      backgroundColor: '#F8FFF8',
   },
   focusIndicator: {
      position: 'absolute',
      bottom: -8,
      left: '50%',
      marginLeft: -4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FF9500',
   },
   verifyButton: {
      backgroundColor: '#FF9500',
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 40,
      shadowColor: '#FF9500',
      shadowOffset: {
         width: 0,
         height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
   },
   verifyButtonDisabled: {
      backgroundColor: '#E0E0E0',
      shadowOpacity: 0,
      elevation: 0,
   },
   verifyButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFF',
   },
   verifyButtonTextDisabled: {
      color: '#999',
   },
   buttonIcon: {
      marginRight: 8,
   },
   resendContainer: {
      alignItems: 'center',
   },
   resendButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 149, 0, 0.1)',
   },
   resendIcon: {
      marginRight: 8,
   },
   resendOtpText: {
      color: '#FF9500',
      fontSize: 16,
      fontWeight: '600',
   },
   countdownText: {
      color: '#666',
      fontSize: 16,
      fontWeight: '500',
   },
   countdownHighlight: {
      color: '#FF9500',
      fontWeight: 'bold',
   },
}) 