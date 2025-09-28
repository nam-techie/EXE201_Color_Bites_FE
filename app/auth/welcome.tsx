'use client'

import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import {
    Animated,
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

const { width, height } = Dimensions.get('window')

export default function WelcomeScreen() {
   const fadeAnim = useRef(new Animated.Value(0)).current
   const slideAnim = useRef(new Animated.Value(50)).current
   const scaleAnim = useRef(new Animated.Value(0.8)).current

   useEffect(() => {
      // Staggered animations
      Animated.sequence([
         Animated.parallel([
            Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 1000,
               useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
               toValue: 0,
               duration: 1000,
               useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
               toValue: 1,
               duration: 1000,
               useNativeDriver: true,
            }),
         ]),
      ]).start()
   }, [])

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
         
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
                  {
                     opacity: fadeAnim,
                     transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                     ]
                  }
               ]}
            >
               {/* App Logo/Title */}
               <View style={styles.logoContainer}>
                  <View style={styles.logoCircle}>
                     <Text style={styles.logoEmoji}>🍎</Text>
                  </View>
                  <Text style={styles.appTitle}>MUMII</Text>
                  <Text style={styles.appSubtitle}>Khám phá ẩm thực đầy màu sắc</Text>
               </View>
               
               {/* Features Highlights */}
               <View style={styles.featuresContainer}>
                  <View style={styles.featureItem}>
                     <View style={styles.featureIcon}>
                        <Ionicons name="restaurant" size={24} color="#FF9500" />
                     </View>
                     <Text style={styles.featureText}>Trải nghiệm ẩm thực tuyệt vời</Text>
                  </View>
                  
                  <View style={styles.featureItem}>
                     <View style={styles.featureIcon}>
                        <Ionicons name="heart" size={24} color="#FF9500" />
                     </View>
                     <Text style={styles.featureText}>Cảm hứng và câu chuyện ẩm thực</Text>
                  </View>
                  
                  <View style={styles.featureItem}>
                     <View style={styles.featureIcon}>
                        <Ionicons name="people" size={24} color="#FF9500" />
                     </View>
                     <Text style={styles.featureText}>Cộng đồng foodie sôi động</Text>
                  </View>
               </View>
               
               {/* Welcome Message */}
               <View style={styles.messageContainer}>
                  <Text style={styles.welcomeText}>Mang đến cho thành viên MUMII</Text>
                  <Text style={styles.descriptionText}>
                     Những trải nghiệm ẩm thực tuyệt vời nhất, cảm hứng và câu chuyện trong ẩm thực.
                  </Text>
               </View>
               
               {/* Action Buttons */}
               <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                     style={styles.joinButton}
                     onPress={() => router.push('/auth/signup-options')}
                     activeOpacity={0.8}
                  >
                     <Ionicons name="person-add" size={20} color="#FFF" style={styles.buttonIcon} />
                     <Text style={styles.joinButtonText}>Tham Gia</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                     style={styles.signInButton}
                     onPress={() => router.push('/auth/login')}
                     activeOpacity={0.8}
                  >
                     <Ionicons name="log-in" size={20} color="#FF9500" style={styles.buttonIcon} />
                     <Text style={styles.signInButtonText}>Đăng Nhập</Text>
                  </TouchableOpacity>
               </View>

               {/* Footer */}
               <View style={styles.footer}>
                  <Text style={styles.footerText}>Bắt đầu hành trình ẩm thực ngay hôm nay!</Text>
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
   logoContainer: {
      alignItems: 'center',
      marginTop: 20,
   },
   logoCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
   },
   logoEmoji: {
      fontSize: 50,
   },
   appTitle: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#000',
      letterSpacing: -1,
      marginBottom: 8,
   },
   appSubtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      fontStyle: 'italic',
   },
   featuresContainer: {
      marginVertical: 30,
   },
   featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
   },
   featureIcon: {
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
         height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
   },
   featureText: {
      flex: 1,
      fontSize: 16,
      color: '#000',
      fontWeight: '500',
   },
   messageContainer: {
      alignItems: 'center',
      marginBottom: 30,
   },
   welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 12,
      textAlign: 'center',
   },
   descriptionText: {
      fontSize: 16,
      color: '#666',
      lineHeight: 24,
      textAlign: 'center',
      paddingHorizontal: 20,
   },
   buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 15,
      marginBottom: 20,
   },
   joinButton: {
      flex: 1,
      backgroundColor: '#FF9500',
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: '#FF9500',
      shadowOffset: {
         width: 0,
         height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
   },
   joinButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
   },
   signInButton: {
      flex: 1,
      backgroundColor: '#FFF',
      borderWidth: 2,
      borderColor: '#FF9500',
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
   },
   signInButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FF9500',
   },
   buttonIcon: {
      marginRight: 8,
   },
   footer: {
      alignItems: 'center',
   },
   footerText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      fontStyle: 'italic',
   },
}) 