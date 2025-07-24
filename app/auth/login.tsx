'use client'

import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useAuth } from '@/context/AuthProvider'
import { validateEmail } from '@/utils/helpers'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function LoginScreen() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [isLoading, setIsLoading] = useState(false)
   const { login } = useAuth()

   const handleLogin = async () => {
      if (!validateEmail(email)) {
         Alert.alert('Error', 'Please enter a valid email address')
         return
      }

      if (password.length < 6) {
         Alert.alert('Error', 'Password must be at least 6 characters')
         return
      }

      setIsLoading(true)
      try {
         await login(email, password)
         router.replace('/(tabs)')
      } catch (error) {
         Alert.alert('Error', 'Login failed. Please try again.')
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>
            <View style={styles.header}>
               <Text style={styles.title}>Welcome Back</Text>
               <Text style={styles.subtitle}>Sign in to continue to ColorBite</Text>
            </View>

            <View style={styles.form}>
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
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon="lock-closed-outline"
               />
            </View>

            <Button title="Sign In" onPress={handleLogin} loading={isLoading} />

            <View style={styles.footer}>
               <Text style={styles.footerText}>Don't have an account? </Text>
               <TouchableOpacity onPress={() => router.push('/auth/register')}>
                  <Text style={styles.signUpText}>Sign Up</Text>
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
   signUpText: {
      fontWeight: '500',
      color: '#F97316',
      fontSize: 16,
   },
})
