'use client'

import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
   Alert,
   SafeAreaView,
   StatusBar,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email của bạn')
      return
    }
    if (!emailValid(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ')
      return
    }

    setIsLoading(true)
    try {
      // TODO: gọi API gửi email reset thật
      await new Promise((r) => setTimeout(r, 1200))
      Alert.alert('Thành công', 'Email đặt lại mật khẩu đã được gửi!', [
        { text: 'OK', onPress: () => router.push('/auth/reset-password') },
      ])
    } catch {
      Alert.alert('Lỗi', 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const disabled = !email.trim() || !emailValid(email) || isLoading

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Quên mật khẩu?</Text>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
        Vui lòng nhập Email để đặt lại mật khẩu
        </Text>

        {/* Email */}
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#9AA4B2"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]}
          disabled={disabled}
          onPress={handleResetPassword}
        >
          <Text style={[styles.primaryText, disabled && styles.primaryTextDisabled]}>
            {isLoading ? 'Đang xử lý...' : 'Gửi email'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

/* ===== Styles: đồng bộ với Login/Signup/Reset ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  subtitle: {
    fontSize: 17,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },

  /* Inputs */
  inputWrap: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F7FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 20,
    color: '#111827',
  },

  /* Primary button */
  primaryBtn: {
    marginTop: 8,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB74D', // brand primary
  },
  primaryBtnDisabled: {
    backgroundColor: '#DDE3ED',
  },
  primaryText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  primaryTextDisabled: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
}) 