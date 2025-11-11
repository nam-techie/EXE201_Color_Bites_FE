'use client'

import { CrossPlatformGradient } from '@/components/CrossPlatformGradient'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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

// Mock data for moods
const moodCategories = [
   {
      id: '1',
      name: 'Snacks',
      image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop',
   },
   {
      id: '2',
      name: 'Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
   },
   {
      id: '3',
      name: 'Biryani',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
   },
   {
      id: '4',
      name: 'Dessert',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
   },
]

const popularMoods = [
   {
      id: '1',
      name: 'Burger Bliss',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      rating: 4.5,
      time: '15-20 min',
   },
   {
      id: '2',
      name: 'Sushi Heaven',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop',
      rating: 4.8,
      time: '20-25 min',
   },
   {
      id: '3',
      name: 'Pasta Paradise',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
      rating: 4.6,
      time: '18-22 min',
   },
   {
      id: '4',
      name: 'Taco Fiesta',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop',
      rating: 4.7,
      time: '12-18 min',
   },
]

export default function HomeScreen() {
   return (
      <SafeAreaView style={styles.container}>
         <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
               <View style={styles.headerContent}>
                  <TouchableOpacity style={styles.notificationButton}>
                     <Ionicons name="notifications-outline" size={24} color="#111827" />
                     <View style={styles.notificationBadge} />
                  </TouchableOpacity>
                  <View style={styles.headerCenter}>
                     <Text style={styles.headerTitle}>Home</Text>
                     <Text style={styles.headerSubtitle}>Cravings happen, we deliver</Text>
                  </View>
                  <TouchableOpacity style={styles.favoriteButton}>
                     <Ionicons name="heart-outline" size={24} color="#111827" />
                  </TouchableOpacity>
               </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
               <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput
                     style={styles.searchInput}
                     placeholder="Name ur mood..."
                     placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity>
                     <Ionicons name="options-outline" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
               </View>
            </View>

            {/* Promo Banner */}
            <View style={styles.promoBannerContainer}>
               <TouchableOpacity style={styles.promoBanner}>
                  <CrossPlatformGradient
                     colors={['#FF6B35', '#FF1493']}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 1 }}
                     style={styles.gradientBanner}
                  >
                     <View style={styles.bannerContent}>
                        <View style={styles.bannerLeft}>
                           <Text style={styles.bannerTitle}>Explore food</Text>
                           <Text style={styles.bannerSubtitle}>around you</Text>
                           <Text style={styles.bannerDescription}>Discover amazing local flavors</Text>
                        </View>
                        <View style={styles.bannerRight}>
                           <Text style={styles.bannerEmoji}>🍜</Text>
                        </View>
                     </View>
                  </CrossPlatformGradient>
               </TouchableOpacity>
            </View>

            {/* What's your mood today? */}
            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>What's your mood today?</Text>
                  <TouchableOpacity>
                     <Text style={styles.viewAllText}>view all</Text>
                  </TouchableOpacity>
               </View>
               <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.moodScrollContainer}
               >
                  {moodCategories.map((mood) => (
                     <TouchableOpacity
                        key={mood.id}
                        style={styles.moodCard}
                        onPress={async () => {
                           try {
                              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                           } catch {
                              // Haptics not available
                           }
                        }}
                     >
                        <Image source={{ uri: mood.image }} style={styles.moodImage} />
                        <View style={styles.moodOverlay}>
                           <Text style={styles.moodName}>{mood.name}</Text>
                        </View>
                     </TouchableOpacity>
                  ))}
               </ScrollView>
            </View>

            {/* Popular moods you can get */}
            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Popular moods you can get</Text>
                  <TouchableOpacity>
                     <Text style={styles.viewAllText}>view all</Text>
                  </TouchableOpacity>
               </View>
               <View style={styles.popularMoodsGrid}>
                  {popularMoods.map((mood) => (
                     <TouchableOpacity
                        key={mood.id}
                        style={styles.popularMoodCard}
                        onPress={async () => {
                           try {
                              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                           } catch {
                              // Haptics not available
                           }
                        }}
                     >
                        <Image source={{ uri: mood.image }} style={styles.popularMoodImage} />
                        <View style={styles.popularMoodInfo}>
                           <Text style={styles.popularMoodName} numberOfLines={1}>
                              {mood.name}
                           </Text>
                           <View style={styles.popularMoodMeta}>
                              <View style={styles.ratingContainer}>
                                 <Ionicons name="star" size={14} color="#FFA500" />
                                 <Text style={styles.ratingText}>{mood.rating}</Text>
                              </View>
                              <Text style={styles.timeText}>{mood.time}</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  ))}
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
   header: {
      backgroundColor: '#FFFFFF',
      paddingBottom: 12,
   },
   headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 8,
   },
   headerCenter: {
      flex: 1,
      alignItems: 'center',
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#111827',
   },
   headerSubtitle: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 2,
   },
   notificationButton: {
      padding: 4,
      position: 'relative',
   },
   notificationBadge: {
      position: 'absolute',
      right: 2,
      top: 2,
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: '#EF4444',
      borderWidth: 1,
      borderColor: '#FFFFFF',
   },
   favoriteButton: {
      padding: 4,
   },
   searchContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#FFFFFF',
   },
   searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
   },
   searchInput: {
      flex: 1,
      fontSize: 15,
      color: '#111827',
   },
   promoBannerContainer: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 20,
   },
   promoBanner: {
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
   },
   gradientBanner: {
      padding: 20,
   },
   bannerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   bannerLeft: {
      flex: 1,
   },
   bannerTitle: {
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: 'bold',
   },
   bannerSubtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 6,
   },
   bannerDescription: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.95)',
      fontWeight: '500',
   },
   bannerRight: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   bannerEmoji: {
      fontSize: 48,
   },
   section: {
      marginBottom: 24,
   },
   sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
   },
   viewAllText: {
      fontSize: 14,
      color: '#FF6B35',
      fontWeight: '600',
   },
   moodScrollContainer: {
      paddingHorizontal: 20,
      gap: 12,
   },
   moodCard: {
      width: 120,
      height: 140,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#E5E7EB',
   },
   moodImage: {
      width: '100%',
      height: '100%',
   },
   moodOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: 10,
   },
   moodName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
   },
   popularMoodsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 14,
      gap: 12,
   },
   popularMoodCard: {
      width: '47%',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
   },
   popularMoodImage: {
      width: '100%',
      height: 140,
   },
   popularMoodInfo: {
      padding: 12,
   },
   popularMoodName: {
      fontSize: 15,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 6,
   },
   popularMoodMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   ratingText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#374151',
   },
   timeText: {
      fontSize: 12,
      color: '#6B7280',
   },
})