'use client'

import { getDefaultAvatar } from '@/constants/defaultImages'
import { useAuth } from '@/context/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useState } from 'react'
import {
   Alert,
   Dimensions,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'

const { width } = Dimensions.get('window')
const postWidth = (width - 32 - 4) / 3 // Account for padding and gaps

const userStats = {
   posts: 127,
   followers: 1234,
   following: 456,
   places: 89,
}

const userPosts = [
   { id: '1', image: 'https://picsum.photos/id/1011/400/400', likes: 45 },
   { id: '2', image: 'https://picsum.photos/id/1015/400/400', likes: 67 },
   { id: '3', image: 'https://picsum.photos/id/1027/400/400', likes: 89 },
   { id: '4', image: 'https://picsum.photos/id/1035/400/400', likes: 34 },
   { id: '5', image: 'https://picsum.photos/id/1043/400/400', likes: 56 },
   { id: '6', image: 'https://picsum.photos/id/1052/400/400', likes: 78 },
]

export default function ProfileScreen() {
   const [activeTab, setActiveTab] = useState('posts')
   const { user, logout } = useAuth()

   const handleLogout = async () => {
      Alert.alert(
         'Đăng xuất',
         'Bạn có chắc chắn muốn đăng xuất?',
         [
            { text: 'Hủy', style: 'cancel' },
            { 
               text: 'Đăng xuất', 
               style: 'destructive',
               onPress: async () => {
                  try {
                     await logout()
                  } catch (error) {
                     console.error('Logout error:', error)
                     Alert.alert('Lỗi', 'Không thể đăng xuất')
                  }
               }
            }
         ]
      )
   }

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <View style={styles.headerContent}>
               <Text style={styles.headerTitle}>Profile</Text>
                               <View style={styles.headerActions}>
                   <TouchableOpacity 
                      style={styles.headerButton}
                      onPress={() => Alert.alert('Chia sẻ', 'Tính năng chia sẻ sắp ra mắt!')}
                      activeOpacity={0.8}
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                   >
                      <Ionicons name="share-outline" size={20} color="#6B7280" />
                   </TouchableOpacity>
                   <TouchableOpacity 
                      style={styles.logoutButton} 
                      onPress={handleLogout}
                      activeOpacity={0.8}
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                   >
                      <Ionicons name="log-out-outline" size={16} color="#DC2626" />
                      <Text style={styles.logoutText}>Đăng xuất</Text>
                   </TouchableOpacity>
                </View>
            </View>
         </View>

         <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Profile Info */}
            <View style={styles.profileSection}>
               <Image
                  source={{ uri: user?.avatar || getDefaultAvatar(user?.name, user?.email) }}
                  style={styles.profileImage}
                  contentFit="cover"
               />
               <View style={styles.nameContainer}>
                  <Text style={styles.userName}>{user?.name || 'User'}</Text>
                  <View style={styles.proBadge}>
                     <Ionicons name="star" size={12} color="white" />
                     <Text style={styles.proBadgeText}>PRO</Text>
                  </View>
               </View>
               <Text style={styles.userBio}>Food enthusiast & explorer 🍜✨</Text>

               {/* Stats */}
               <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                     <Text style={styles.statNumber}>{userStats.posts}</Text>
                     <Text style={styles.statLabel}>Posts</Text>
                  </View>
                  <View style={styles.statItem}>
                     <Text style={styles.statNumber}>{userStats.followers}</Text>
                     <Text style={styles.statLabel}>Followers</Text>
                  </View>
                  <View style={styles.statItem}>
                     <Text style={styles.statNumber}>{userStats.following}</Text>
                     <Text style={styles.statLabel}>Following</Text>
                  </View>
                  <View style={styles.statItem}>
                     <Text style={styles.statNumber}>{userStats.places}</Text>
                     <Text style={styles.statLabel}>Places</Text>
                  </View>
               </View>

                               <TouchableOpacity 
                   style={styles.editProfileButton}
                   onPress={() => {
                      Alert.alert('Edit Profile', 'Edit profile feature coming soon!')
                   }}
                   activeOpacity={0.8}
                   hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                   <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Premium Analytics */}
            <View style={styles.analyticsSection}>
               <View style={styles.analyticsHeader}>
                  <View style={styles.analyticsTitle}>
                     <Ionicons name="bar-chart" size={20} color="#EA580C" />
                     <Text style={styles.analyticsTitleText}>Analytics</Text>
                  </View>
                  <View style={styles.analyticsBadge}>
                     <Text style={styles.analyticsBadgeText}>PRO</Text>
                  </View>
               </View>
               <View style={styles.analyticsGrid}>
                  <View style={styles.analyticsItem}>
                     <Text style={styles.analyticsLabel}>Top Interactor</Text>
                     <Text style={styles.analyticsValue}>@sarah_foodie</Text>
                  </View>
                  <View style={styles.analyticsItem}>
                     <Text style={styles.analyticsLabel}>Avg. Likes</Text>
                     <Text style={styles.analyticsValue}>64 per post</Text>
                  </View>
                  <View style={styles.analyticsItem}>
                     <Text style={styles.analyticsLabel}>Best Time</Text>
                     <Text style={styles.analyticsValue}>7-9 PM</Text>
                  </View>
                  <View style={styles.analyticsItem}>
                     <Text style={styles.analyticsLabel}>Top Cuisine</Text>
                     <Text style={styles.analyticsValue}>Asian Food</Text>
                  </View>
               </View>
            </View>

            {/* Content Tabs */}
            <View style={styles.tabsContainer}>
               <View style={styles.tabsWrapper}>
                  <TouchableOpacity
                     onPress={() => setActiveTab('posts')}
                     style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                  >
                     <Ionicons
                        name="grid-outline"
                        size={16}
                        color={activeTab === 'posts' ? 'white' : '#6B7280'}
                     />
                     <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                        Posts
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => setActiveTab('places')}
                     style={[styles.tab, activeTab === 'places' && styles.activeTab]}
                  >
                     <Ionicons
                        name="location-outline"
                        size={16}
                        color={activeTab === 'places' ? 'white' : '#6B7280'}
                     />
                     <Text style={[styles.tabText, activeTab === 'places' && styles.activeTabText]}>
                        Places
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>

            {/* Content */}
            {activeTab === 'posts' ? (
               <View style={styles.postsGrid}>
                  {(userPosts || []).map((post, index) => (
                     <View
                        key={post.id}
                        style={[styles.postItem, { marginRight: (index + 1) % 3 === 0 ? 0 : 2 }]}
                     >
                        <View style={styles.postImageContainer}>
                           <Image
                              source={{ uri: post.image }}
                              style={styles.postImage}
                              contentFit="cover"
                           />
                           <View style={styles.likesOverlay}>
                              <Text style={styles.likesText}>❤️ {post.likes}</Text>
                           </View>
                        </View>
                     </View>
                  ))}
               </View>
            ) : (
               <View style={styles.placesList}>
                  {[1, 2, 3, 4].map((i) => (
                     <TouchableOpacity key={i} style={styles.placeItem}>
                        <View style={styles.placeContent}>
                           <Image
                              source={{
                                 uri: `https://picsum.photos/seed/restaurant${i}/100/100`,
                              }}
                              style={styles.placeImage}
                              contentFit="cover"
                           />

                           <View style={styles.placeInfo}>
                              <Text style={styles.placeName}>Restaurant {i}</Text>
                              <Text style={styles.placeVisits}>Visited 3 times</Text>
                           </View>
                           <View style={styles.placeRating}>
                              <Text style={styles.placeRatingText}>⭐ 4.{5 + i}</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>
            )}
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
   headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
   },
   headerActions: {
      flexDirection: 'row',
   },
   headerButton: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: 8,
      marginLeft: 8,
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      padding: 16,
   },
   profileSection: {
      marginBottom: 24,
      alignItems: 'center',
   },
   profileImage: {
      marginBottom: 16,
      height: 96,
      width: 96,
      borderRadius: 48,
   },
   nameContainer: {
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
   },
   userName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#111827',
      marginRight: 8,
   },
   proBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 4,
      backgroundColor: '#F97316',
      paddingHorizontal: 8,
      paddingVertical: 4,
   },
   proBadgeText: {
      marginLeft: 4,
      fontSize: 12,
      fontWeight: '500',
      color: '#FFFFFF',
   },
   userBio: {
      marginBottom: 16,
      textAlign: 'center',
      color: '#4B5563',
      fontSize: 14,
   },
   statsContainer: {
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'center',
   },
   statItem: {
      alignItems: 'center',
      marginHorizontal: 16,
   },
   statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#111827',
   },
   statLabel: {
      fontSize: 14,
      color: '#6B7280',
   },
   editProfileButton: {
      marginBottom: 16,
      width: '100%',
      borderRadius: 8,
      backgroundColor: '#F97316',
      paddingVertical: 12,
   },
   editProfileButtonText: {
      textAlign: 'center',
      fontWeight: '500',
      color: '#FFFFFF',
   },
   analyticsSection: {
      marginBottom: 24,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FED7AA',
      backgroundColor: '#FFF7ED',
      padding: 16,
   },
   analyticsHeader: {
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   analyticsTitle: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   analyticsTitleText: {
      marginLeft: 8,
      fontWeight: '600',
      color: '#9A3412',
   },
   analyticsBadge: {
      borderRadius: 4,
      backgroundColor: '#F97316',
      paddingHorizontal: 8,
      paddingVertical: 4,
   },
   analyticsBadgeText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#FFFFFF',
   },
   analyticsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
   },
   analyticsItem: {
      marginBottom: 8,
      width: '50%',
   },
   analyticsLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#C2410C',
   },
   analyticsValue: {
      fontSize: 14,
      color: '#EA580C',
   },
   tabsContainer: {
      marginBottom: 16,
      overflow: 'hidden',
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
   },
   tabsWrapper: {
      flexDirection: 'row',
   },
   tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      backgroundColor: '#F3F4F6',
   },
   activeTab: {
      backgroundColor: '#F97316',
   },
   tabText: {
      marginLeft: 4,
      color: '#4B5563',
      fontSize: 14,
   },
   activeTabText: {
      color: '#FFFFFF',
   },
   postsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -1,
   },
   postItem: {
      marginBottom: 4,
      width: postWidth,
   },
   postImageContainer: {
      position: 'relative',
      aspectRatio: 1,
   },
   postImage: {
      height: '100%',
      width: '100%',
      borderRadius: 8,
   },
   likesOverlay: {
      position: 'absolute',
      bottom: 4,
      right: 4,
      borderRadius: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingHorizontal: 4,
      paddingVertical: 2,
   },
   likesText: {
      fontSize: 12,
      color: '#FFFFFF',
   },
   placesList: {
      gap: 12,
   },
   placeItem: {
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
   placeVisits: {
      fontSize: 14,
      color: '#6B7280',
   },
   placeRating: {
      borderRadius: 4,
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 8,
      paddingVertical: 4,
   },
       placeRatingText: {
       fontSize: 12,
       color: '#111827',
    },
    logoutButton: {
       flexDirection: 'row',
       alignItems: 'center',
       borderRadius: 8,
       borderWidth: 1,
       borderColor: '#DC2626',
       backgroundColor: '#FEF2F2',
       paddingHorizontal: 12,
       paddingVertical: 8,
       marginLeft: 8,
    },
    logoutText: {
       marginLeft: 4,
       fontSize: 14,
       fontWeight: '500',
       color: '#DC2626',
    },
 })
