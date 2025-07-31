'use client'

import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function SignUpOptionsScreen() {
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
            <View style={styles.content}>
               {/* Title */}
               <Text style={styles.title}>Chọn cách đăng ký</Text>
               
               {/* Description */}
               <Text style={styles.description}>
                  Bạn có thể đăng ký bằng tài khoản mạng xã hội hoặc email
               </Text>
               
               {/* Social Login Options */}
               <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                     style={styles.socialButton}
                     onPress={() => router.push('/auth/signup-form')}
                     activeOpacity={0.8}
                  >
                     <View style={styles.socialIconContainer}>
                        <Ionicons name="mail" size={24} color="#FF9500" />
                     </View>
                     <View style={styles.socialTextContainer}>
                        <Text style={styles.socialTitle}>Đăng ký bằng Email</Text>
                        <Text style={styles.socialSubtitle}>Tạo tài khoản mới với email</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>

                  <TouchableOpacity 
                     style={styles.socialButton}
                     activeOpacity={0.8}
                  >
                     <View style={[styles.socialIconContainer, { backgroundColor: '#1877F2' }]}>
                        <Ionicons name="logo-facebook" size={24} color="#FFF" />
                     </View>
                     <View style={styles.socialTextContainer}>
                        <Text style={styles.socialTitle}>Tiếp tục với Facebook</Text>
                        <Text style={styles.socialSubtitle}>Đăng ký nhanh với Facebook</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>

                  <TouchableOpacity 
                     style={styles.socialButton}
                     activeOpacity={0.8}
                  >
                     <View style={[styles.socialIconContainer, { backgroundColor: '#DB4437' }]}>
                        <Ionicons name="logo-google" size={24} color="#FFF" />
                     </View>
                     <View style={styles.socialTextContainer}>
                        <Text style={styles.socialTitle}>Tiếp tục với Google</Text>
                        <Text style={styles.socialSubtitle}>Đăng ký nhanh với Google</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>

                  <TouchableOpacity 
                     style={styles.socialButton}
                     activeOpacity={0.8}
                  >
                     <View style={[styles.socialIconContainer, { backgroundColor: '#000' }]}>
                        <Ionicons name="logo-apple" size={24} color="#FFF" />
                     </View>
                     <View style={styles.socialTextContainer}>
                        <Text style={styles.socialTitle}>Tiếp tục với Apple</Text>
                        <Text style={styles.socialSubtitle}>Đăng ký nhanh với Apple ID</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={20} color="#666" />
                  </TouchableOpacity>
               </View>

               {/* Terms */}
               <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                     Bằng cách tiếp tục, bạn đồng ý với{' '}
                     <Text style={styles.termsLink}>Điều khoản sử dụng</Text>
                     {' '}và{' '}
                     <Text style={styles.termsLink}>Chính sách bảo mật</Text>
                  </Text>
               </View>
            </View>
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
      paddingHorizontal: 30,
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
      marginBottom: 40,
   },
   optionsContainer: {
      marginBottom: 30,
   },
   socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
   },
   socialIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
   },
   socialTextContainer: {
      flex: 1,
   },
   socialTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
      marginBottom: 4,
   },
   socialSubtitle: {
      fontSize: 14,
      color: '#666',
   },
   termsContainer: {
      paddingHorizontal: 20,
   },
   termsText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      lineHeight: 20,
   },
   termsLink: {
      color: '#FF9500',
      fontWeight: '500',
   },
}) 