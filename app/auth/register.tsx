'use client'

import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useAuth } from '@/context/AuthProvider'
import { validateEmail, validatePassword } from '@/utils/helpers'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function RegisterScreen() {
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const { register } = useAuth()

   const handleRegister = async () => {
      if (!name.trim()) {
         Alert.alert('Error', 'Please enter your name')
         return
      }

      if (!validateEmail(email)) {
         Alert.alert('Error', 'Please enter a valid email address')
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
         await register(name, email, password)
         router.replace('/(tabs)')
      } catch (error) {
         Alert.alert('Error', 'Registration failed. Please try again.')
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>
            <View style={styles.header}>
               <Text style={styles.title}>Create Account</Text>
               <Text style={styles.subtitle}>Join ColorBite community today</Text>
            </View>

            <View style={styles.form}>
               <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  leftIcon="person-outline"
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
            </View>

            <Button title="Create Account" onPress={handleRegister} loading={isLoading} />

            <View style={styles.footer}>
               <Text style={styles.footerText}>Already have an account? </Text>
               <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text style={styles.signInText}>Sign In</Text>
               </TouchableOpacity>
            </View>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
   },
   content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
   },
   header: {
      marginBottom: 32,
   },
   title: {
      marginBottom: 8,
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      color: '#111827',
   },
   subtitle: {
      textAlign: 'center',
      color: '#4B5563',
      fontSize: 16,
   },
   form: {
      marginBottom: 24,
   },
   footer: {
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   footerText: {
      color: '#4B5563',
      fontSize: 16,
   },
   signInText: {
      fontWeight: '500',
      color: '#F97316',
      fontSize: 16,
   },
})
