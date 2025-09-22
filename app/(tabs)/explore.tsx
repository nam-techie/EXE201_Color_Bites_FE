'use client'

import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useState } from 'react'
import {
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native'

const trendingHashtags = [
   { tag: '#ComfortFoodVibes', posts: 1234, trending: true },
   { tag: '#LocalEats', posts: 856, trending: false },
   { tag: '#HealthyChoices', posts: 642, trending: true },
   { tag: '#WeekendTreats', posts: 423, trending: false },
   { tag: '#FoodieLife', posts: 1567, trending: true },
]
const featuredUsers = [
   {
      id: '1',
      name: 'Sarah Chen',
      username: '@sarahfoodie',
      followers: '12.3K',
      avatar: 'https://i.pravatar.cc/40?img=11',
   },
   {
      id: '2',
      name: 'Mike Johnson',
      username: '@mikeeats',
      followers: '8.7K',
      avatar: 'https://i.pravatar.cc/40?img=15',
   },
   {
      id: '3',
      name: 'Lisa Park',
      username: '@lisaloves',
      followers: '15.2K',
      avatar: 'https://i.pravatar.cc/40?img=32',
   },
]
const nearbyPlaces = [
   {
      id: '1',
      name: 'Cozy Corner Cafe',
      distance: '0.2 km',
      rating: 4.8,
      image: 'https://picsum.photos/id/102/60/60',
   },
   {
      id: '2',
      name: 'Spice Garden',
      distance: '0.5 km',
      rating: 4.6,
      image: 'https://picsum.photos/id/103/60/60',
   },
   {
      id: '3',
      name: 'Fresh Bowl',
      distance: '0.8 km',
      rating: 4.7,
      image: 'https://picsum.photos/id/104/60/60',
   },
]

export default function ExploreScreen() {
   const [searchQuery, setSearchQuery] = useState('')

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <Text style={styles.headerTitle}>Explore</Text>
            <View style={styles.searchContainer}>
               <Ionicons
                  name="search-outline"
                  size={16}
                  color="#9CA3AF"
                  style={styles.searchIcon}
               />
               <TextInput
                  placeholder="Search food, places, people..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                  placeholderTextColor="#9CA3AF"
               />
            </View>
         </View>

         <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Trending Hashtags */}
            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <Ionicons name="trending-up" size={20} color="#F97316" />
                  <Text style={styles.sectionTitle}>Trending This Week</Text>
               </View>
               <View style={styles.sectionContent}>
                  {(trendingHashtags || []).map((item, index) => (
                     <TouchableOpacity key={index} style={styles.hashtagCard}>
                        <View style={styles.hashtagContent}>
                           <View>
                              <View style={styles.hashtagHeader}>
                                 <Text style={styles.hashtagText}>{item.tag}</Text>
                                 {item.trending && (
                                    <View style={styles.hotBadge}>
                                       <Text style={styles.hotBadgeText}>🔥 Hot</Text>
                                    </View>
                                 )}
                              </View>
                              <Text style={styles.postsCount}>
                                 {item.posts.toLocaleString()} posts
                              </Text>
                           </View>
                           <TouchableOpacity style={styles.joinButton}>
                              <Text style={styles.joinButtonText}>Join</Text>
                           </TouchableOpacity>
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {/* Featured Foodies */}
            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <Ionicons name="people" size={20} color="#F97316" />
                  <Text style={styles.sectionTitle}>Featured Foodies</Text>
               </View>
               <View style={styles.sectionContent}>
                  {(featuredUsers || []).map((user) => (
                     <TouchableOpacity key={user.id} style={styles.userCard}>
                        <View style={styles.userContent}>
                           <View style={styles.userInfo}>
                              <Image
                                 source={{ uri: user.avatar }}
                                 style={styles.userAvatar}
                                 contentFit="cover"
                              />
                              <View>
                                 <Text style={styles.userName}>{user.name}</Text>
                                 <Text style={styles.userUsername}>{user.username}</Text>
                                 <Text style={styles.userFollowers}>
                                    {user.followers} followers
                                 </Text>
                              </View>
                           </View>
                           <TouchableOpacity style={styles.followButton}>
                              <Text style={styles.followButtonText}>Follow</Text>
                           </TouchableOpacity>
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {/* Nearby Places */}
            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <Ionicons name="location" size={20} color="#F97316" />
                  <Text style={styles.sectionTitle}>Nearby Places</Text>
               </View>
               <View style={styles.sectionContent}>
                  {(nearbyPlaces || []).map((place) => (
                     <TouchableOpacity key={place.id} style={styles.placeCard}>
                        <View style={styles.placeContent}>
                           <Image
                              source={{ uri: place.image }}
                              style={styles.placeImage}
                              contentFit="cover"
                           />
                           <View style={styles.placeInfo}>
                              <Text style={styles.placeName}>{place.name}</Text>
                              <View style={styles.placeDetails}>
                                 <Text style={styles.placeDistance}>{place.distance}</Text>
                                 <Text style={styles.placeSeparator}>•</Text>
                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons
                                       name="star"
                                       size={14}
                                       color="#FBBF24"
                                       style={{ marginRight: 4 }}
                                    />
                                    <Text style={styles.placeRating}>{place.rating}</Text>
                                 </View>
                              </View>
                           </View>
                           <TouchableOpacity style={styles.checkInButton}>
                              <Text style={styles.checkInButtonText}>Check In</Text>
                           </TouchableOpacity>
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {/* Premium Challenge */}
            <View style={styles.premiumChallenge}>
               <View style={styles.premiumContent}>
                  <View style={styles.proBadge}>
                     <Text style={styles.proBadgeText}>PRO Challenge</Text>
                  </View>
                  <Text style={styles.challengeTitle}>7 Days Healthy Eating</Text>
                  <Text style={styles.challengeDescription}>
                     Create your own food challenge and invite friends!
                  </Text>
                  <TouchableOpacity style={styles.startChallengeButton}>
                     <Text style={styles.startChallengeButtonText}>Start Challenge</Text>
                  </TouchableOpacity>
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
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
   },
   headerTitle: {
      marginBottom: 12,
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
   },
   searchContainer: {
      position: 'relative',
   },
   searchIcon: {
      position: 'absolute',
      left: 12,
      top: 12,
      zIndex: 1,
   },
   searchInput: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      paddingVertical: 12,
      paddingLeft: 40,
      paddingRight: 16,
      fontSize: 14,
      color: '#111827',
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      padding: 16,
   },
   section: {
      marginBottom: 24,
   },
   sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
   },
   sectionTitle: {
      marginLeft: 8,
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
   },
   sectionContent: {
      gap: 8,
   },
   hashtagCard: {
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: 8,
   },
   hashtagContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   hashtagHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
   },
   hashtagText: {
      fontWeight: '600',
      color: '#2563EB',
      marginRight: 8,
   },
   hotBadge: {
      borderRadius: 4,
      backgroundColor: '#EF4444',
      paddingHorizontal: 8,
      paddingVertical: 4,
   },
   hotBadgeText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '500',
   },
   postsCount: {
      fontSize: 14,
      color: '#6B7280',
   },
   joinButton: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 12,
      paddingVertical: 4,
   },
   joinButtonText: {
      fontSize: 14,
      color: '#4B5563',
   },
   userCard: {
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: 12,
   },
   userContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   userAvatar: {
      height: 48,
      width: 48,
      borderRadius: 24,
      marginRight: 12,
   },
   userName: {
      fontWeight: '600',
      color: '#111827',
      fontSize: 16,
   },
   userUsername: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 2,
   },
   userFollowers: {
      fontSize: 12,
      color: '#9CA3AF',
      marginTop: 2,
   },
   followButton: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 12,
      paddingVertical: 4,
   },
   followButtonText: {
      fontSize: 14,
      color: '#4B5563',
   },
   placeCard: {
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: 12,
   },
   placeContent: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   placeImage: {
      height: 48,
      width: 48,
      borderRadius: 8,
      marginRight: 12,
   },
   placeInfo: {
      flex: 1,
   },
   placeName: {
      fontWeight: '600',
      color: '#111827',
      fontSize: 16,
   },
   placeDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
   },
   placeDistance: {
      fontSize: 14,
      color: '#6B7280',
   },
   placeSeparator: {
      fontSize: 14,
      color: '#6B7280',
      marginHorizontal: 8,
   },
   placeRating: {
      fontSize: 14,
      color: '#6B7280',
   },
   checkInButton: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 12,
      paddingVertical: 4,
   },
   checkInButtonText: {
      fontSize: 14,
      color: '#4B5563',
   },
   premiumChallenge: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FED7AA',
      backgroundColor: '#FFF7ED',
      padding: 16,
      marginTop: 8,
   },
   premiumContent: {
      alignItems: 'center',
   },
   proBadge: {
      borderRadius: 4,
      backgroundColor: '#F97316',
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginBottom: 8,
   },
   proBadgeText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#FFFFFF',
   },
   challengeTitle: {
      fontWeight: '600',
      color: '#111827',
      fontSize: 16,
      marginBottom: 4,
   },
   challengeDescription: {
      textAlign: 'center',
      fontSize: 14,
      color: '#4B5563',
      marginBottom: 12,
      lineHeight: 20,
   },
   startChallengeButton: {
      borderRadius: 8,
      backgroundColor: '#F97316',
      paddingHorizontal: 24,
      paddingVertical: 8,
   },
   startChallengeButtonText: {
      fontWeight: '500',
      color: '#FFFFFF',
      fontSize: 14,
   },
})
