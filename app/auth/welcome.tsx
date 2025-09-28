'use client'

import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import {
   Animated,
   Easing,
   SafeAreaView,
   StatusBar,
   StyleSheet,
   Text,
   TouchableOpacity,
   View
} from 'react-native'

// no Dimensions needed

export default function WelcomeScreen() {
   const fadeAnim = useRef(new Animated.Value(0)).current
   const slideAnim = useRef(new Animated.Value(50)).current
   const scaleAnim = useRef(new Animated.Value(0.8)).current
   const gradientAnim = useRef(new Animated.Value(0)).current
   const float1 = useRef(new Animated.Value(0)).current
   const float2 = useRef(new Animated.Value(0)).current
   const float3 = useRef(new Animated.Value(0)).current
   const joinPulse = useRef(new Animated.Value(1)).current

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

      // Crossfade gradients
      Animated.loop(
         Animated.sequence([
            Animated.timing(gradientAnim, {
               toValue: 1,
               duration: 8000,
               easing: Easing.inOut(Easing.quad),
               useNativeDriver: false,
            }),
            Animated.timing(gradientAnim, {
               toValue: 0,
               duration: 8000,
               easing: Easing.inOut(Easing.quad),
               useNativeDriver: false,
            }),
         ])
      ).start()

      const floatLoop = (val: Animated.Value, delay = 0, duration = 3800) => {
         Animated.loop(
            Animated.sequence([
               Animated.timing(val, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true, delay }),
               Animated.timing(val, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
         ).start()
      }
      floatLoop(float1, 0, 4200)
      floatLoop(float2, 600, 3600)
      floatLoop(float3, 1200, 4000)

      // CTA pulse animation
      Animated.loop(
         Animated.sequence([
            Animated.timing(joinPulse, { toValue: 1.04, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
            Animated.timing(joinPulse, { toValue: 1.0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
         ])
      ).start()
   }, [])

   const gradAOpacity = gradientAnim
   const gradBOpacity = gradientAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
   const floatTranslate = (val: Animated.Value) => ({
      transform: [
         { translateY: val.interpolate({ inputRange: [0, 1], outputRange: [-8, 8] }) },
      ],
   })

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
         
         <View style={styles.gradient}>
            {/* Animated layered gradients */}
            <Animated.View style={[styles.gradientLayer, { opacity: gradAOpacity }]}> 
               <LinearGradient
                  colors={["#FFF1EA", "#FFD9E0", "#FFC06F"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
               />
            </Animated.View>
            <Animated.View style={[styles.gradientLayer, { opacity: gradBOpacity }]}> 
               <LinearGradient
                  colors={["#FFF7ED", "#FFE3C4", "#FFD36A"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFill}
               />
            </Animated.View>
            {/* Floating food emojis */}
            <Animated.Text style={[styles.floatingIcon, styles.floatA, floatTranslate(float1)]}>🍣</Animated.Text>
            <Animated.Text style={[styles.floatingIcon, styles.floatB, floatTranslate(float2)]}>🍜</Animated.Text>
            <Animated.Text style={[styles.floatingIcon, styles.floatC, floatTranslate(float3)]}>🧁</Animated.Text>
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
                  <Text style={styles.appTitle}>ColorBite</Text>
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
                  <Text style={styles.welcomeText}>Mang đến cho thành viên ColorBite</Text>
                  <Text style={styles.descriptionText}>
                     Những trải nghiệm ẩm thực tuyệt vời nhất, cảm hứng và câu chuyện trong ẩm thực.
                  </Text>
               </View>
               
               {/* Action Buttons */}
               <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                     style={styles.joinButton}
                     onPress={() => router.push('/auth/signup-form')}
                     activeOpacity={0.9}
                  >
                     <Animated.View style={[styles.joinButtonGradientWrap, { transform: [{ scale: joinPulse }] }]}>
                        <LinearGradient
                           colors={["#FF8A00", "#FF6B00"]}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 1 }}
                           style={styles.joinButtonGradient}
                        >
                           <Ionicons name="person-add" size={20} color="#FFF" style={styles.buttonIcon} />
                           <Text style={styles.joinButtonText}>Tham Gia</Text>
                        </LinearGradient>
                     </Animated.View>
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
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   gradient: {
      flex: 1,
      position: 'relative',
   },
   gradientLayer: {
      ...StyleSheet.absoluteFillObject,
   },
   floatingIcon: {
      position: 'absolute',
      fontSize: 22,
      opacity: 0.7,
   },
   floatA: { top: 80, right: 24 },
   floatB: { top: 140, left: 18 },
   floatC: { top: 220, right: 60 },
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
      backgroundColor: 'transparent',
      borderRadius: 16,
      overflow: 'hidden',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: '#FF8A00',
      shadowOffset: {
         width: 0,
         height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
   },
   joinButtonGradientWrap: {
      width: '100%',
      borderRadius: 16,
   },
   joinButtonGradient: {
      width: '100%',
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.8)',
   },
   joinButtonText: {
      fontSize: 17,
      fontWeight: '700',
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