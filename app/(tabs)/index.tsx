'use client'

import { CrossPlatformGradient } from '@/components/CrossPlatformGradient'
import { mockPosts } from '@/data/mockData'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import {
   Dimensions,
   Pressable,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import Animated, {
   useAnimatedStyle,
   useSharedValue,
   withSpring,
   withTiming,
} from 'react-native-reanimated'

// Conditional haptics import
let Haptics: any = null
try {
   Haptics = require('expo-haptics')
} catch (error) {
   // Haptics not available, create mock
   Haptics = {
      impactAsync: () => Promise.resolve(),
      ImpactFeedbackStyle: {
         Light: 'light',
         Medium: 'medium',
         Heavy: 'heavy',
      },
   }
}

const { width } = Dimensions.get('window')
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function HomeScreen() {
   const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
   const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set())

   const toggleLike = async (postId: string) => {
      try {
         await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } catch (error) {
         // Haptics not available
      }
      const newLiked = new Set(likedPosts)
      newLiked.has(postId) ? newLiked.delete(postId) : newLiked.add(postId)
      setLikedPosts(newLiked)
   }

   const toggleSave = async (postId: string) => {
      try {
         await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      } catch (error) {
         // Haptics not available
      }
      const newSaved = new Set(savedPosts)
      newSaved.has(postId) ? newSaved.delete(postId) : newSaved.add(postId)
      setSavedPosts(newSaved)
   }

   return (
      <SafeAreaView style={styles.container}>
         {/* Enhanced Header */}
         {/* <View style={styles.header}>
            <View style={styles.headerContent}>
               <View>
                  <Text style={styles.headerTitle}>ColorBite</Text>
                  <Text style={styles.headerSubtitle}>Discover amazing food</Text>
               </View>
               <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={async () => {
                     try {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                     } catch (error) {
                        // Haptics not available
                     }
                  }}
               >
                  <Ionicons name="notifications-outline" size={22} color="#374151" />
                  <View style={styles.notificationBadge} />
               </TouchableOpacity>
            </View>
         </View> */}

         <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
         >
            {/* Enhanced Weekly Theme Card */}
            <View style={styles.themeCardContainer}>
               <TouchableOpacity
                  style={styles.themeCard}
                  onPress={async () => {
                     try {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                     } catch (error) {
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
                           <Text style={styles.themeTitle}>This Week's Theme</Text>
                           <Text style={styles.themeHashtag}>#ComfortFoodVibes</Text>
                           <TouchableOpacity
                              style={styles.joinButton}
                              onPress={async () => {
                                 try {
                                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                 } catch (error) {
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

            {/* Enhanced Posts Feed */}
            <View style={styles.postsContainer}>
               {mockPosts.map((post, index) => (
                  <PostCard
                     key={post.id}
                     post={post}
                     isLiked={likedPosts.has(post.id)}
                     isSaved={savedPosts.has(post.id)}
                     onToggleLike={() => toggleLike(post.id)}
                     onToggleSave={() => toggleSave(post.id)}
                     index={index}
                  />
               ))}
            </View>
         </ScrollView>
      </SafeAreaView>
   )
}

// Enhanced Post Card Component
function PostCard({
   post,
   isLiked,
   isSaved,
   onToggleLike,
   onToggleSave,
   index,
}: {
   post: any
   isLiked: boolean
   isSaved: boolean
   onToggleLike: () => void
   onToggleSave: () => void
   index: number
}) {
   const likeScale = useSharedValue(1)
   const saveScale = useSharedValue(1)
   const cardOpacity = useSharedValue(0)
   const cardTranslateY = useSharedValue(50)

   // Entrance animation
   React.useEffect(() => {
      cardOpacity.value = withTiming(1, { duration: 600 })
      cardTranslateY.value = withSpring(0, {
         damping: 15,
         stiffness: 100,
      })
   }, [])

   const animatedCardStyle = useAnimatedStyle(() => ({
      opacity: cardOpacity.value,
      transform: [{ translateY: cardTranslateY.value }],
   }))

   const animatedLikeStyle = useAnimatedStyle(() => ({
      transform: [{ scale: likeScale.value }],
   }))

   const animatedSaveStyle = useAnimatedStyle(() => ({
      transform: [{ scale: saveScale.value }],
   }))

   const handleLike = () => {
      likeScale.value = withSpring(1.2, { duration: 150 }, () => {
         likeScale.value = withSpring(1, { duration: 150 })
      })
      onToggleLike()
   }

   const handleSave = () => {
      saveScale.value = withSpring(1.2, { duration: 150 }, () => {
         saveScale.value = withSpring(1, { duration: 150 })
      })
      onToggleSave()
   }

   return (
      <Animated.View style={[styles.postCard, animatedCardStyle]}>
         {/* Post Header */}
         <View style={styles.postHeader}>
            <View style={styles.postHeaderContent}>
               <View style={styles.userInfo}>
                  <Image
                     source={{ uri: post.user.avatar }}
                     style={styles.avatar}
                     contentFit="cover"
                     transition={200}
                  />
                  <View>
                     <Text style={styles.userName}>{post.user.name}</Text>
                     <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                        <Text style={styles.locationText}>{post.location}</Text>
                        <Text style={styles.separator}>•</Text>
                        <Text style={styles.timeText}>{post.timeAgo}</Text>
                     </View>
                  </View>
               </View>
               <TouchableOpacity
                  style={styles.moreButton}
                  onPress={async () => {
                     try {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                     } catch (error) {
                        // Haptics not available
                     }
                  }}
               >
                  <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
               </TouchableOpacity>
            </View>
         </View>

         {/* Post Image */}
         <View style={styles.imageContainer}>
            <Image
               source={{ uri: post.image }}
               style={styles.postImage}
               contentFit="cover"
               transition={300}
            />
            {post.isPinned && (
               <View style={styles.pinnedBadge}>
                  <Text style={styles.pinnedText}>📌 Featured</Text>
               </View>
            )}
            <View style={styles.moodBadge}>
               <Text style={styles.moodText}>{post.mood}</Text>
            </View>
         </View>

         {/* Post Content */}
         <View style={styles.postContent}>
            <View style={styles.captionContainer}>
               <Text style={styles.caption}>{post.caption}</Text>
               <View style={styles.hashtagContainer}>
                  {post.hashtags.map((tag, tagIndex) => (
                     <TouchableOpacity key={tagIndex} style={styles.hashtag}>
                        <Text style={styles.hashtagText}>{tag}</Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {/* Enhanced Post Actions */}
            <View style={styles.actionsContainer}>
               <View style={styles.leftActions}>
                  <Animated.View style={animatedLikeStyle}>
                     <TouchableOpacity
                        onPress={handleLike}
                        style={styles.actionButton}
                        accessibilityLabel={`${isLiked ? 'Unlike' : 'Like'} post`}
                        accessibilityRole="button"
                     >
                        <Ionicons
                           name={isLiked ? 'heart' : 'heart-outline'}
                           size={22}
                           color={isLiked ? '#EF4444' : '#6B7280'}
                        />
                        <Text style={[styles.actionText, isLiked && styles.likedText]}>
                           {post.likes + (isLiked ? 1 : 0)}
                        </Text>
                     </TouchableOpacity>
                  </Animated.View>

                  <TouchableOpacity
                     style={styles.actionButton}
                     onPress={async () => {
                        try {
                           await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        } catch (error) {
                           // Haptics not available
                        }
                     }}
                  >
                     <Ionicons name="chatbubble-outline" size={22} color="#6B7280" />
                     <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={styles.actionButton}
                     onPress={async () => {
                        try {
                           await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        } catch (error) {
                           // Haptics not available
                        }
                     }}
                  >
                     <Ionicons name="share-outline" size={22} color="#6B7280" />
                     <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
               </View>

               <Animated.View style={animatedSaveStyle}>
                  <TouchableOpacity
                     onPress={handleSave}
                     style={styles.saveButton}
                     accessibilityLabel={`${isSaved ? 'Unsave' : 'Save'} post`}
                     accessibilityRole="button"
                  >
                     <Ionicons
                        name={isSaved ? 'bookmark' : 'bookmark-outline'}
                        size={22}
                        color={isSaved ? '#F97316' : '#6B7280'}
                     />
                  </TouchableOpacity>
               </Animated.View>
            </View>
         </View>
      </Animated.View>
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
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      paddingBottom: 20,
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
   postsContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
   },
   postCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#F3F4F6',
      overflow: 'hidden',
      marginBottom: 24,
   },
   postHeader: {
      padding: 16,
      paddingBottom: 12,
   },
   postHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   avatar: {
      height: 44,
      width: 44,
      borderRadius: 22,
      marginRight: 12,
   },
   userName: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111827',
   },
   locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
   },
   locationText: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: '500',
      marginLeft: 4,
   },
   separator: {
      fontSize: 12,
      color: '#9CA3AF',
      marginHorizontal: 4,
   },
   timeText: {
      fontSize: 12,
      color: '#6B7280',
   },
   moreButton: {
      padding: 8,
      borderRadius: 9999,
      backgroundColor: '#F9FAFB',
   },
   imageContainer: {
      position: 'relative',
   },
   postImage: {
      height: 320,
      width: '100%',
   },
   pinnedBadge: {
      position: 'absolute',
      left: 12,
      top: 12,
      borderRadius: 9999,
      backgroundColor: '#F59E0B',
      paddingHorizontal: 12,
      paddingVertical: 6,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
   },
   pinnedText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
   },
   moodBadge: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      borderRadius: 9999,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 12,
      paddingVertical: 6,
   },
   moodText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#FFFFFF',
   },
   postContent: {
      padding: 16,
   },
   captionContainer: {
      marginBottom: 16,
   },
   caption: {
      fontSize: 14,
      color: '#1F2937',
      lineHeight: 20,
      marginBottom: 8,
   },
   hashtagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
   },
   hashtag: {
      marginRight: 8,
      marginBottom: 4,
   },
   hashtagText: {
      fontSize: 12,
      color: '#2563EB',
      fontWeight: '500',
   },
   actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   leftActions: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 24,
   },
   actionText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '500',
      color: '#6B7280',
   },
   likedText: {
      color: '#EF4444',
   },
   saveButton: {
      padding: 4,
   },
})
