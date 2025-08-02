'use client'

import Input from '@/components/common/Input'
import { registerUser } from '@/services/AuthService'
import { validateEmail, validatePassword } from '@/utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { router } from 'expo-router'
import { useState } from 'react'
import {
   Alert,
   KeyboardAvoidingView,
   Platform,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'

export default function RegisterScreen() {
   const [fullName, setFullName] = useState('')
   const [username, setUsername] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [dob, setDob] = useState('')
   const [showDatePicker, setShowDatePicker] = useState(false)
   const [gender, setGender] = useState<'Male' | 'Female'>('Male')
   const [isLoading, setIsLoading] = useState(false)

   const handleRegister = async () => {
      if (!fullName.trim() || !username.trim() || !dob.trim()) {
         Alert.alert('Error', 'Please complete all required fields')
         return
      }

      if (!validateEmail(email)) {
         Alert.alert('Error', 'Invalid email')
         return
      }

      if (!validatePassword(password)) {
         Alert.alert('Error', 'Password must be at least 6 characters')
         return
      }

      if (password !== confirmPassword) {
         Alert.alert('Error', 'Passwords do not match')
         return
      }

      setIsLoading(true)
      try {
         // ⚠️ Không truyền avatar nếu không có file thực sự
         const result = await registerUser({
            fullName,
            username,
            email,
            password,
            confirmPassword,
            dob,
            gender,
            // avatar: undefined hoặc bỏ luôn nếu backend không cần
         })

         if (result.status === 200) {
            Alert.alert('Success', result.message || 'Account created successfully!', [
               {
                  text: 'OK',
                  onPress: () => router.replace('/auth/login'),
               },
            ])
         } else {
            Alert.alert('Error', result.message || 'Registration failed')
         }
      } catch (error: any) {
         console.error('Unexpected error:', error)
         Alert.alert('Error', 'Unexpected error occurred.')
      } finally {
         setIsLoading(false)
      }
   }

   const handleDateChange = (event: any, selectedDate?: Date) => {
      setShowDatePicker(false)
      if (selectedDate) {
         const formatted = selectedDate.toISOString().split('T')[0]
         setDob(formatted)
      }
   }

   const canSubmit =
      fullName && username && email && password && confirmPassword && dob && !isLoading

   return (
      <SafeAreaView style={styles.container}>
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
         >
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
               <View style={styles.header}>
                  <Text style={styles.title}>
                     <Ionicons name="person-add-outline" size={28} color="#F97316" /> Create Account
                  </Text>
                  <Text style={styles.subtitle}>Join the ColorBite community</Text>
               </View>

               <View style={styles.form}>
                  <Input
                     label="Full Name"
                     placeholder="Enter your full name"
                     value={fullName}
                     onChangeText={setFullName}
                     leftIcon="person-outline"
                  />
                  <Input
                     label="Username"
                     placeholder="Choose a username"
                     value={username}
                     onChangeText={setUsername}
                     leftIcon="person-circle-outline"
                  />
                  <Input
                     label="Email"
                     placeholder="Enter your email"
                     value={email}
                     onChangeText={setEmail}
                     keyboardType="email-address"
                     leftIcon="mail-outline"
                  />
                  <Input
                     label="Password"
                     placeholder="Create a password"
                     value={password}
                     onChangeText={setPassword}
                     secureTextEntry
                     leftIcon="lock-closed-outline"
                  />
                  <Input
                     label="Confirm Password"
                     placeholder="Confirm your password"
                     value={confirmPassword}
                     onChangeText={setConfirmPassword}
                     secureTextEntry
                     leftIcon="lock-closed-outline"
                  />

                  <View>
                     <Text style={styles.dobLabel}>Date of Birth</Text>
                     <TouchableOpacity
                        style={styles.dobPicker}
                        onPress={() => setShowDatePicker(true)}
                     >
                        <Ionicons
                           name="calendar-outline"
                           size={20}
                           color="#374151"
                           style={{ marginRight: 8 }}
                        />
                        <Text style={dob ? styles.dobText : styles.dobPlaceholder}>
                           {dob || 'Select your birth date'}
                        </Text>
                     </TouchableOpacity>
                     {showDatePicker && (
                        <DateTimePicker
                           value={dob ? new Date(dob) : new Date('2000-01-01')}
                           mode="date"
                           display="default"
                           onChange={handleDateChange}
                           maximumDate={new Date()}
                        />
                     )}
                  </View>

                  <View style={{ marginTop: 16 }}>
                     <Text style={styles.genderLabel}>Gender</Text>
                     <View style={styles.genderRow}>
                        <TouchableOpacity
                           style={[styles.genderOption, gender === 'Male' && styles.genderSelected]}
                           onPress={() => setGender('Male')}
                        >
                           <Ionicons
                              name="male-outline"
                              size={20}
                              color={gender === 'Male' ? '#fff' : '#374151'}
                              style={{ marginBottom: 4 }}
                           />
                           <Text
                              style={
                                 gender === 'Male' ? styles.genderTextSelected : styles.genderText
                              }
                           >
                              Male
                           </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                           style={[
                              styles.genderOption,
                              gender === 'Female' && styles.genderSelected,
                           ]}
                           onPress={() => setGender('Female')}
                        >
                           <Ionicons
                              name="female-outline"
                              size={20}
                              color={gender === 'Female' ? '#fff' : '#374151'}
                              style={{ marginBottom: 4 }}
                           />
                           <Text
                              style={
                                 gender === 'Female' ? styles.genderTextSelected : styles.genderText
                              }
                           >
                              Female
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>

               <TouchableOpacity
                  onPress={handleRegister}
                  disabled={!canSubmit}
                  style={[styles.button, { opacity: !canSubmit ? 0.6 : 1 }]}
               >
                  <Text style={styles.buttonText}>
                     {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
               </TouchableOpacity>

               <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account?</Text>
                  <TouchableOpacity onPress={() => router.push('/auth/login')}>
                     <Text style={styles.signInText}> Sign In</Text>
                  </TouchableOpacity>
               </View>
            </ScrollView>
         </KeyboardAvoidingView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
   scroll: {
      padding: 24,
      flexGrow: 1,
      justifyContent: 'center',
   },
   header: {
      marginBottom: 32,
   },
   title: {
      fontSize: 26,
      fontWeight: '700',
      textAlign: 'center',
      color: '#F97316',
      marginBottom: 4,
   },
   subtitle: {
      fontSize: 16,
      textAlign: 'center',
      color: '#6B7280',
   },
   form: {
      gap: 16,
      marginBottom: 24,
   },
   genderLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: '#374151',
   },
   genderRow: {
      flexDirection: 'row',
      gap: 16,
   },
   genderOption: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderRadius: 12,
      borderColor: '#D1D5DB',
      alignItems: 'center',
      justifyContent: 'center',
   },
   genderSelected: {
      backgroundColor: '#F97316',
      borderColor: '#F97316',
   },
   genderText: {
      color: '#374151',
      fontWeight: '500',
   },
   genderTextSelected: {
      color: '#fff',
      fontWeight: '600',
   },
   dobLabel: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: '#374151',
   },
   dobPicker: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 12,
   },
   dobText: {
      fontSize: 16,
      color: '#111827',
   },
   dobPlaceholder: {
      fontSize: 16,
      color: '#9CA3AF',
   },
   button: {
      backgroundColor: '#F97316',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
   footer: {
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   footerText: {
      color: '#6B7280',
      fontSize: 14,
   },
   signInText: {
      color: '#F97316',
      fontWeight: '600',
      fontSize: 14,
      marginLeft: 4,
   },
})
