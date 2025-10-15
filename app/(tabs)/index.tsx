'use client'

import { CrossPlatformGradient } from '@/components/CrossPlatformGradient'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
   SafeAreaView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'

// Import haptics with error handling
import * as ExpoHaptics from 'expo-haptics'

// Create haptics wrapper with fallback
const Haptics = ExpoHaptics || {
   impactAsync: () => Promise.resolve(),
   ImpactFeedbackStyle: {
      Light: 'light',
      Medium: 'medium',
      Heavy: 'heavy',
   },
}

export default function HomeScreen() {
   return (
      <SafeAreaView style={styles.container}>
         {/* Enhanced Header */}
         <View style={styles.header}>
            <View style={styles.headerContent}>
               <View>
                  <Text style={styles.headerTitle}>MUMII</Text>
                  <Text style={styles.headerSubtitle}>Discover amazing food</Text>
               </View>
               <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={async () => {
                     try {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                     } catch {
                        // Haptics not available
                     }
                  }}
               >
                  <Ionicons name="notifications-outline" size={22} color="#374151" />
                  <View style={styles.notificationBadge} />
               </TouchableOpacity>
            </View>
         </View>

         {/* Enhanced Weekly Theme Card */}
         <View style={styles.themeCardContainer}>
            <TouchableOpacity
               style={styles.themeCard}
               onPress={async () => {
                  try {
                     await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                  } catch {
                     // Haptics not available
                  }
               }}
            >
               <CrossPlatformGradient
                  colors={['#fb923c', '#ec4899', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientContent}
               >
                  <View style={styles.themeCardContent}>
                     <View style={styles.themeTextContainer}>
                        <Text style={styles.themeTitle}>This Week&apos;s Theme</Text>
                        <Text style={styles.themeHashtag}>#ComfortFoodVibes</Text>
                        <TouchableOpacity
                           style={styles.joinButton}
                           onPress={async () => {
                              try {
                                 await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                              } catch {
                                 // Haptics not available
                              }
                           }}
                        >
                           <Text style={styles.joinButtonText}>Join Challenge</Text>
                        </TouchableOpacity>
                     </View>
                     <View style={styles.themeEmoji}>
                        <Text style={styles.emojiText}>🍲</Text>
                     </View>
                  </View>
               </CrossPlatformGradient>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   header: {
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
      backgroundColor: '#FFFFFF',
   },
   headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingVertical: 16,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#111827',
      letterSpacing: -0.025,
   },
   headerSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
   },
   notificationButton: {
      borderRadius: 9999,
      backgroundColor: '#F9FAFB',
      padding: 12,
      position: 'relative',
   },
   notificationBadge: {
      position: 'absolute',
      right: -4,
      top: -4,
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: '#EF4444',
   },
   themeCardContainer: {
      marginHorizontal: 16,
      marginTop: 24,
   },
   themeCard: {
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
   },
   gradientContent: {
      padding: 24,
   },
   themeCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   themeTextContainer: {
      flex: 1,
   },
   themeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
   },
   themeHashtag: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
   },
   joinButton: {
      alignSelf: 'flex-start',
      borderRadius: 9999,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 16,
      paddingVertical: 8,
   },
   joinButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
   },
   themeEmoji: {
      marginLeft: 16,
   },
   emojiText: {
      fontSize: 32,
   },
})