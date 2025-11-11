'use client'

import { useAuth } from '@/context/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { login } = useAuth()

  const isDisabled = !email || !password || isLoading

  const handleLogin = async () => {
    setErrorMessage('')
    if (!email || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin')
      return
    }
    try {
      setIsLoading(true)
      await login(email, password)
      router.replace('/(tabs)')
    } catch (e: any) {
      setErrorMessage(e?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Đăng nhập</Text>

        {/* Content */}
        <View style={styles.content}>
          {/* Email */}
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Email hoặc tên người dùng"
              placeholderTextColor="#9AA4B2"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password with eye */}
          <View style={styles.inputWrap}>
            <TextInput
              style={[styles.input, { paddingRight: 44 }]}
              placeholder="Mật khẩu"
              placeholderTextColor="#9AA4B2"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPwd}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPwd((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showPwd ? 'eye' : 'eye-off'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Error */}
          {!!errorMessage && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Login button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.loginBtn, isDisabled && styles.loginBtnDisabled]}
            disabled={isDisabled}
            onPress={handleLogin}
          >
            <Text
              style={[styles.loginText, isDisabled && styles.loginTextDisabled]}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>

          {/* Forgot password */}
          <TouchableOpacity
            style={styles.forgotWrap}
            onPress={() => router.push('/auth/forgot-password')}
          >
            <Text style={styles.forgotText}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Google button (pinned at bottom) */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.9}
            onPress={() => console.log('Google OAuth')}
          >
            <Ionicons name="logo-google" size={20} color="#FFFFFF" />
            <Text style={styles.googleText}>Tiếp tục với Google</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

/* ===== Styles ===== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
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
    backgroundColor: '#F5F7FF', // tím nhạt
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

  /* Error */
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 4,
    marginBottom: 4,
    gap: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },

  /* Login */
  loginBtn: {
    marginTop: 8,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB74D', // sẽ bị override trạng thái disabled
  },
  loginBtnDisabled: {
    backgroundColor: '#DDE3ED', // xám nhạt như mock
  },
  loginText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginTextDisabled: {
    color: '#FFFFFF',
    opacity: 0.9,
  },

  /* Forgot */
  forgotWrap: {
    alignItems: 'center',
    marginTop: 10,
  },
  forgotText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FB8C00', // black
  },

  /* Bottom Google button */
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 6,
  },
  googleBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FB8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,

  },
  googleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
})
