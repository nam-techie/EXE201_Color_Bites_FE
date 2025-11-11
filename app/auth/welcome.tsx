'use client'

import { CrossPlatformGradient } from '@/components/CrossPlatformGradient'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React from 'react'
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('@/assets/images/icon.jpg')}
              style={styles.logo}
              contentFit="cover"
              transition={300}
            />
          </View>
          <Text style={styles.appName}>MUMII</Text>
          <Text style={styles.tagline}>Hành trình ẩm thực của bạn</Text>
        </View>

        {/* Decorative food emojis */}
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>🍕</Text>
          <Text style={styles.emoji}>🍜</Text>
          <Text style={styles.emoji}>🍔</Text>
          <Text style={styles.emoji}>🍱</Text>
          <Text style={styles.emoji}>🍰</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="restaurant" size={19} color="#FF6B35" />
            </View>
            <Text style={styles.featureTitle}>Khám phá</Text>
            <Text style={styles.featureDescription}>Ngàn quán ăn</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="people" size={19} color="#FF6B35" />
            </View>
            <Text style={styles.featureTitle}>Cộng đồng</Text>
            <Text style={styles.featureDescription}>Kết nối</Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="star" size={19} color="#FF6B35" />
            </View>
            <Text style={styles.featureTitle}>Đánh giá</Text>
            <Text style={styles.featureDescription}>Chia sẻ</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.contentSection}>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {/* Google Sign In Button with Gradient */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => console.log('Google sign in pressed')}
            >
              <CrossPlatformGradient
                colors={['#FF6B35', '#FF1493']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Ionicons name="logo-google" size={18} color="#FFFFFF" />
                <Text style={styles.gradientButtonText}>Tiếp tục với Google</Text>
              </CrossPlatformGradient>
            </TouchableOpacity>

            {/* Email Sign Up Button */}
            <TouchableOpacity
              style={styles.emailButton}
              activeOpacity={0.8}
              onPress={() => router.push('/auth/signup-form')}
            >
              <Ionicons name="mail-outline" size={18} color="#FF6B35" />
              <Text style={styles.emailButtonText}>Đăng ký với Email</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginButtonText}>Đã có tài khoản? </Text>
              <Text style={styles.loginButtonLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>

          {/* Legal Text */}
          <View style={styles.legalContainer}>
            <Text style={styles.legalText}>
              Bằng việc đăng ký, bạn chấp nhận{' '}
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/auth/terms-of-service')}
              >
                Điều khoản dịch vụ
              </Text>{' '}
              và{' '}
              <Text
                style={styles.legalLink}
                onPress={() => router.push('/auth/privacy-policy')}
              >
                Chính sách quyền riêng tư
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 50,
    justifyContent: 'space-between',
  },
  
  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginBottom: 18,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 7,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  
  // Decorative Emojis
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
    marginBottom: 26,
  },
  emoji: {
    fontSize: 30,
  },
  
  // Features Section
  featuresSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 12,
  },
  
  // Content Section
  contentSection: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  
  // Actions Container
  actionsContainer: {
    marginBottom: 10,
  },
  
  // Gradient Button (Google)
  gradientButton: {
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  gradientButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Email Button
  emailButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#FF6B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emailButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B35',
  },
  
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  
  // Login Button
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  loginButtonLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
  
  // Legal Text
  legalContainer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  legalText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  legalLink: {
    color: '#FF6B35',
    fontWeight: '600',
  },
})
