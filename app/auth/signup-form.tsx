'use client'

import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useState } from 'react'
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
   const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
   })
   const [errors, setErrors] = useState<{[key: string]: string}>({})
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
         // Handle form submission
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

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="#FDF6E3" />
         
         {/* Status Bar */}
         <View style={styles.statusBar}>
            <Text style={styles.statusTime}>9:41</Text>
            <View style={styles.statusIcons}>
               <Ionicons name="cellular" size={14} color="#000" />
               <Ionicons name="wifi" size={14} color="#000" style={{ marginLeft: 4 }} />
               <View style={styles.batteryIcon}>
                  <View style={styles.batteryLevel} />
               </View>
            </View>
         </View>

         <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
               <Text style={styles.title}>Đăng Ký Bằng Email</Text>
               
               {/* Description */}
               <Text style={styles.description}>
                  Tài khoản miễn phí của bạn sẽ cho phép lưu trữ, theo dõi, thảo luận và đóng góp nội dung tuyệt vời.
               </Text>
               
               {/* Form Fields */}
               <View style={styles.form}>
                  {/* Username */}
                  <View style={styles.inputContainer}>
                     <Text style={styles.inputLabel}>Họ và tên</Text>
                     <TextInput
                        style={[styles.input, errors.username && styles.inputError]}
                        value={formData.username}
                        onChangeText={(text) => {
                           setFormData({...formData, username: text})
                           if (errors.username) setErrors({...errors, username: ''})
                        }}
                        placeholder="Nhập họ và tên của bạn"
                        placeholderTextColor="#999"
                     />
                     {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
                  </View>

                  {/* Email */}
                  <View style={styles.inputContainer}>
                     <Text style={styles.inputLabel}>Email</Text>
                     <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        value={formData.email}
                        onChangeText={(text) => {
                           setFormData({...formData, email: text})
                           if (errors.email) setErrors({...errors, email: ''})
                        }}
                        placeholder="Nhập email của bạn"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                     />
                     {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  {/* Password */}
                  <View style={styles.inputContainer}>
                     <Text style={styles.inputLabel}>Mật khẩu</Text>
                     <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                        <TextInput
                           style={styles.passwordInput}
                           value={formData.password}
                           onChangeText={(text) => {
                              setFormData({...formData, password: text})
                              if (errors.password) setErrors({...errors, password: ''})
                           }}
                           placeholder="Tạo mật khẩu"
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
                     {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>

                  {/* Confirm Password */}
                  <View style={styles.inputContainer}>
                     <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
                     <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                        <TextInput
                           style={styles.passwordInput}
                           value={formData.confirmPassword}
                           onChangeText={(text) => {
                              setFormData({...formData, confirmPassword: text})
                              if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''})
                           }}
                           placeholder="Xác nhận mật khẩu"
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
                     {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                  </View>

                  {/* Password Requirements */}
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
               </View>

               {/* Submit Button */}
               <TouchableOpacity 
                  style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={!isFormValid()}
               >
                  <Text style={[styles.submitButtonText, !isFormValid() && styles.submitButtonTextDisabled]}>
                     Tạo tài khoản
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
      backgroundColor: '#FDF6E3',
   },
   statusBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
   },
   statusTime: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
   },
   statusIcons: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   batteryIcon: {
      width: 24,
      height: 12,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 2,
      marginLeft: 4,
      padding: 1,
   },
   batteryLevel: {
      width: 18,
      height: 8,
      backgroundColor: '#000',
      borderRadius: 1,
   },
   scrollView: {
      flex: 1,
   },
   header: {
      paddingHorizontal: 20,
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
      paddingHorizontal: 30,
      paddingBottom: 20,
   },
   title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      marginBottom: 16,
   },
   description: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 30,
   },
   form: {
      marginBottom: 20,
   },
   inputContainer: {
      marginBottom: 20,
   },
   inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: '#007AFF',
      marginBottom: 8,
   },
   input: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
   inputError: {
      borderBottomColor: '#FF3B30',
   },
   dateText: {
      fontSize: 16,
      color: '#000',
   },
   placeholderText: {
      fontSize: 16,
      color: '#999',
   },
   errorText: {
      fontSize: 14,
      color: '#FF3B30',
      marginTop: 4,
   },
   requirementsContainer: {
      marginBottom: 20,
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
   submitButton: {
      backgroundColor: '#FF9500',
      borderRadius: 25,
      paddingVertical: 15,
      alignItems: 'center',
   },
   submitButtonDisabled: {
      backgroundColor: '#DDD',
   },
   submitButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
   },
   submitButtonTextDisabled: {
      color: '#999',
   },
}) 