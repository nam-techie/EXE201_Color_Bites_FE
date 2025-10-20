'use client'

import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* MAIN = ở giữa màn hình */}
      <View style={styles.main}>
        {/* Logo */}
        <View style={styles.logoWrap}>
          <Image
            source={require('@/assets/images/icon.jpg')}
            style={styles.logo}
            contentFit="contain"
            transition={200}
          />
        </View>

        {/* Texts */}
        <View style={styles.textWrap}>
          <Text style={styles.slogan}>Gu vị riêng, trải nghiệm khác</Text>
          <Text style={styles.headline}>Đăng ký miễn phí.</Text>

          <Text style={styles.legal}>
            Bằng việc đăng ký, bạn chấp nhận{' '}
            <Text
              style={styles.link}
              onPress={() => router.push('/auth/terms-of-service')}
            >
              Điều khoản dịch vụ
            </Text>{' '}
            và{' '}
            <Text
              style={styles.link}
              onPress={() => router.push('/auth/privacy-policy')}
            >
              Chính sách quyền riêng tư
            </Text>{' '}
            của MUMII
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.88}
            onPress={() => console.log('Google sign in pressed')}
          >
            <Ionicons name="logo-google" size={20} color="#FFFFFF" />
            <Text style={styles.btnPrimaryText}>Tiếp tục với Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOutline}
            activeOpacity={0.88}
            onPress={() => router.push('/auth/signup-form')}
          >
            <Ionicons name="mail-outline" size={20} color="#333333" />
            <Text style={styles.btnOutlineText}>Đăng ký bằng email</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FOOTER = sát đáy, không dư khoảng trống */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.footerLink}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const MAX_WIDTH = 360
const BTN_HEIGHT = 56
const RADIUS = 28

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20
  },

  /* Trung tâm màn hình */
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },

  /* Logo */
  logoWrap: {
    width: 140,
    alignItems: 'center',
    marginBottom: 40
  },
  
  logo: {
    width: 140,
    height: 140,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10
  },

  /* Texts */
  textWrap: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignItems: 'center',
    marginBottom: 50
  },
  slogan: {
    fontSize: 25,
    fontWeight: '500',
    color: '#111',
    textAlign: 'center',
    marginBottom: 55
  },
  headline: {
    fontSize: 33,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 25
  },
  legal: {
    fontSize: 16,
    lineHeight: 20,
    color: '#6B6B6B',
    textAlign: 'center',
    paddingHorizontal: 8
  },
  link: {
    color: '#4A90E2',
    textDecorationLine: 'underline'
  },

  /* Buttons */
  actions: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    gap: 16,
    alignSelf: 'center',
    marginBottom: -140
  },
  btnPrimary: {
    height: BTN_HEIGHT,
    borderRadius: RADIUS,
    backgroundColor: '#FB8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  btnPrimaryText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF'
  },

  btnOutline: {
   height: BTN_HEIGHT,
   borderRadius: RADIUS,
   backgroundColor: '#FFFFFF',
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   borderWidth: 1.5,
   borderColor: '#D7D7D7',
   gap: 10,
  },

  btnOutlineText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333333'
  },

  /* Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 120,
    paddingTop: 0
  },
  footerText: {
    fontSize: 20,
    color: '#666'
  },
  footerLink: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A90E2'
  }
})
