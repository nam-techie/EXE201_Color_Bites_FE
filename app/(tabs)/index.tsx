'use client'

import { CrossPlatformGradient } from '@/components/CrossPlatformGradient'
import { CommentModal } from '@/components/common/CommentModal'
import ImageGallery from '@/components/common/ImageGallery'
import { getDefaultAvatar } from '@/constants/defaultImages'
import { postService } from '@/services/PostService'
import type { PostResponse } from '@/type'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'
import { Image } from 'expo-image'
import React, { useCallback, useEffect, useState } from 'react'
import {
   ActivityIndicator,
   RefreshControl,
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
import Toast from 'react-native-toast-message'

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

// Removed unused width and AnimatedPressable to avoid lint/runtime errors

// Normalize post data từ API response
function normalizePost(p: any): PostResponse {
   // Gộp đủ fallback để hiển thị mượt - Fix author structure mapping
   const authorName = p.author?.authorName ?? p.authorName ?? 'Unknown User'
   const authorAvatar = p.author?.authorAvatar ?? p.authorAvatar ?? null

   // Ép số an toàn, nếu null/undef ⇒ 0
   const reactionCount = Number(p.reactionCount ?? 0) || 0
   const commentCount = Number(p.commentCount ?? 0) || 0

   // Chuẩn hóa createdAt về ISO string để formatTimeAgo không lỗi
   let createdAt: string = p.createdAt
   if (Array.isArray(p.createdAt)) {
      // Trường hợp LocalDateTime về dạng [yyyy, mm, dd, HH, MM, SS, nano]
      const [y, m, d, hh = 0, mm = 0, ss = 0] = p.createdAt
      createdAt = new Date(y, (m ?? 1) - 1, d, hh, mm, ss).toISOString()
   } else if (p.createdAt && typeof p.createdAt === 'object' && p.createdAt.year) {
      // Trường hợp object {year, month, day, hour...}
      const { year, month, day, hour = 0, minute = 0, second = 0 } = p.createdAt
      createdAt = new Date(year, month - 1, day, hour, minute, second).toISOString()
   } else if (!p.createdAt) {
      createdAt = new Date().toISOString()
   }

   // Parse imageUrls từ JSON string format thành array URL
   let parsedImageUrls: string[] = []
   if (Array.isArray(p.imageUrls)) {
      parsedImageUrls = p.imageUrls
         .map((item: any) => {
            try {
               // Nếu là JSON string, parse nó
               if (typeof item === 'string' && item.includes('{"url":')) {
                  const parsed = JSON.parse(item)
                  return parsed.url
               }
               // Nếu đã là URL string thuần
               return typeof item === 'string' ? item : null
            } catch {
               console.warn('Failed to parse image URL:', item)
               return null
            }
         })
         .filter((url: string | null) => url && url.trim())
   }

   return {
      id: String(p.id),
      accountId: p.author?.accountId ?? p.accountId ?? '',
      authorName,
      authorAvatar,
      content: p.content ?? '',
      moodId: p.moodId ?? '',
      moodName: p.moodName ?? '',
      moodEmoji: p.moodEmoji ?? '',
      imageUrls: parsedImageUrls,
      videoUrl: p.videoUrl ?? null,
      reactionCount,
      commentCount,
      tags: Array.isArray(p.tags) ? p.tags : [],
      isOwner: Boolean(p.isOwner),
      hasReacted: Boolean(p.hasReacted),
      userReactionType: p.userReactionType ?? null,
      createdAt,
      updatedAt: p.updatedAt ?? ''
   } as PostResponse
}

// Format time ago helper function
function formatTimeAgo(dateString: string): string {
   const now = new Date()
   const postDate = new Date(dateString)
   
   // Check if date is valid
   if (isNaN(postDate.getTime())) {
      return 'Không xác định'
   }
   
   const diffMs = now.getTime() - postDate.getTime()
   const diffMins = Math.floor(diffMs / (1000 * 60))
   const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

   if (diffMins < 1) return 'Vừa xong'
   if (diffMins < 60) return `${diffMins} phút trước`
   if (diffHours < 24) return `${diffHours} giờ trước`
   if (diffDays < 7) return `${diffDays} ngày trước`
   
   return postDate.toLocaleDateString('vi-VN')
}

export default function HomeScreen() {
   const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
   const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set())
   const [posts, setPosts] = useState<PostResponse[]>([])
   const [isLoading, setIsLoading] = useState(true)
   const [isRefreshing, setIsRefreshing] = useState(false)
   const [page, setPage] = useState(1)
   const [hasMorePosts, setHasMorePosts] = useState(true)
   const [commentModalVisible, setCommentModalVisible] = useState(false)
   const [selectedPostId, setSelectedPostId] = useState<string>('')

   // Load posts from API - Wrapped với useCallback để tránh infinite loop
   const loadPosts = useCallback(async (pageNumber: number = 1, append: boolean = false) => {
      try {
         const response = await postService.getAllPosts(pageNumber, 10)
         
         if (response.content) {
            // Normalize data trước khi set vào state
            const normalizedPosts = response.content.map(normalizePost)
            
            if (append) {
               setPosts(prevPosts => [...prevPosts, ...normalizedPosts])
            } else {
               setPosts(normalizedPosts)
            }
            
            setHasMorePosts(!response.last)
            setPage(pageNumber)
         }
      } catch (error) {
         console.error('Error loading posts:', error)
         
         Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: error instanceof Error ? error.message : 'Không thể tải bài viết',
         })
      } finally {
         setIsLoading(false)
         setIsRefreshing(false)
      }
   }, []) // Remove unnecessary dependency

   // Refresh posts - Wrapped với useCallback
   const handleRefresh = useCallback(async () => {
      setIsRefreshing(true)
      await loadPosts(1, false)
   }, [loadPosts])

   // Load posts on component mount - Chỉ chạy 1 lần khi mount
   useEffect(() => {
      loadPosts(1, false)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []) // Empty dependency để tránh infinite loop

   // Refresh posts when tab is focused (when user taps Home tab)
   useFocusEffect(
      useCallback(() => {
         // Chỉ refresh nếu đã có posts (không phải lần đầu load)
         if (posts.length > 0) {
            console.log('🏠 Home tab focused - refreshing posts...')
            handleRefresh()
         }
      }, [posts.length, handleRefresh])
   )

   // Load more posts (pagination) - Với proper throttling
   const loadMorePosts = useCallback(async () => {
      if (!isLoading && hasMorePosts) {
         setIsLoading(true)
         await loadPosts(page + 1, true)
      }
   }, [isLoading, hasMorePosts, page, loadPosts])

   const toggleLike = async (postId: string) => {
      try {
         await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } catch {
         // Haptics not available
      }

      try {
         // Call API to toggle reaction and get response data
         const reactionData = await postService.toggleReaction(postId)
         
         // Update local state based on API response
         const newLiked = new Set(likedPosts)
         if (reactionData.isLiked) {
            newLiked.add(postId)
         } else {
            newLiked.delete(postId)
         }
         setLikedPosts(newLiked)

         // Update posts state with new reaction count
         setPosts(prevPosts => 
            prevPosts.map(post => 
               post.id === postId 
                  ? { 
                     ...post, 
                     reactionCount: reactionData.reactionCount,
                     hasReacted: reactionData.isLiked
                   }
                  : post
            )
         )

         // Success - no toast needed, visual feedback from heart icon is sufficient
      } catch (error) {
         console.error('Error toggling like:', error)
         Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Không thể cập nhật reaction',
         })
      }
   }

   const toggleSave = async (postId: string) => {
      try {
         await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      } catch {
         // Haptics not available
      }
      const newSaved = new Set(savedPosts)
      if (newSaved.has(postId)) {
         newSaved.delete(postId)
      } else {
         newSaved.add(postId)
      }
      setSavedPosts(newSaved)
   }

   const openCommentModal = (postId: string) => {
      setSelectedPostId(postId)
      setCommentModalVisible(true)
   }

   const closeCommentModal = () => {
      setCommentModalVisible(false)
      setSelectedPostId('')
   }

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

         <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
               <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={['#F97316']}
                  tintColor="#F97316"
               />
            }
            onScroll={({ nativeEvent }) => {
               // Load more posts when near bottom - Giống Facebook
               const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
               const paddingToBottom = 100 // Tăng lên để load sớm hơn
               if (
                  layoutMeasurement.height + contentOffset.y >= 
                  contentSize.height - paddingToBottom &&
                  !isLoading &&
                  hasMorePosts
               ) {
                  loadMorePosts()
               }
            }}
            scrollEventThrottle={1000} // Giảm frequency để tránh spam
         >
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

            {/* Enhanced Posts Feed */}
            <View style={styles.postsContainer}>
               {isLoading && posts.length === 0 ? (
                  <View style={styles.loadingContainer}>
                     <ActivityIndicator size="large" color="#F97316" />
                     <Text style={styles.loadingText}>Đang tải bài viết...</Text>
                  </View>
               ) : posts.length === 0 ? (
                  <View style={styles.emptyContainer}>
                     <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
                     <Text style={styles.emptyText}>Chưa có bài viết nào</Text>
                     <Text style={styles.emptySubtext}>Hãy tạo bài viết đầu tiên của bạn!</Text>
                  </View>
               ) : (
                  (posts || []).map((post, index) => (
                  <PostCard
                     key={post.id}
                     post={post}
                     isLiked={likedPosts.has(post.id)}
                     isSaved={savedPosts.has(post.id)}
                     onToggleLike={() => toggleLike(post.id)}
                     onToggleSave={() => toggleSave(post.id)}
                     onCommentPress={() => openCommentModal(post.id)}
                     index={index}
                  />
               )))}

               {/* Loading more indicator */}
               {isLoading && posts.length > 0 && (
                  <View style={styles.loadMoreContainer}>
                     <ActivityIndicator size="small" color="#F97316" />
                     <Text style={styles.loadMoreText}>Đang tải thêm...</Text>
                  </View>
               )}
               
               {/* No more posts indicator */}
               {!hasMorePosts && posts.length > 0 && (
                  <View style={styles.endContainer}>
                     <Text style={styles.endText}>Bạn đã xem hết tất cả bài viết</Text>
                  </View>
               )}
            </View>
         </ScrollView>

         {/* Comment Modal */}
         <CommentModal
            visible={commentModalVisible}
            postId={selectedPostId}
            onClose={closeCommentModal}
         />
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
   onCommentPress,
   index,
}: {
   post: PostResponse
   isLiked: boolean
   isSaved: boolean
   onToggleLike: () => void
   onToggleSave: () => void
   onCommentPress: () => void
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
   }, [cardOpacity, cardTranslateY])

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
                     source={{ uri: post.authorAvatar || getDefaultAvatar(post.authorName) }}
                     style={styles.avatar}
                     contentFit="cover"
                     transition={200}
                  />
                  <View>
                     <Text style={styles.userName}>{post.authorName || 'Unknown User'}</Text>
                     <View style={styles.locationContainer}>
                        <Text style={styles.timeText}>{formatTimeAgo(post.createdAt)}</Text>
                        {post.moodName && (
                           <>
                              <Text style={styles.separator}>•</Text>
                              <Text style={styles.moodText}>{post.moodEmoji} {post.moodName}</Text>
                           </>
                        )}
                     </View>
                  </View>
               </View>
               <TouchableOpacity
                  style={styles.moreButton}
                  onPress={async () => {
                     try {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                     } catch {
                        // Haptics not available
                     }
                  }}
               >
                  <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
               </TouchableOpacity>
            </View>
         </View>


         {/* Post Images/Video */}
         {(post.imageUrls && Array.isArray(post.imageUrls) && post.imageUrls.length > 0) || post.videoUrl ? (
            <View style={styles.imageContainer}>
               {post.imageUrls && Array.isArray(post.imageUrls) && post.imageUrls.length > 0 ? (
                  <ImageGallery imageUrls={post.imageUrls} />
               ) : post.videoUrl ? (
                  <View style={styles.videoContainer}>
                     <Text style={styles.videoPlaceholder}>📹 Video Content</Text>
                  </View>
               ) : null}
            </View>
         ) : null}

         {/* Post Content */}
         <View style={styles.postContent}>
            <View style={styles.captionContainer}>
               <Text style={styles.caption}>{post.content}</Text>
               <View style={styles.hashtagContainer}>
                  {(post.tags && Array.isArray(post.tags) ? post.tags : []).map((tag, tagIndex: number) => (
                     <TouchableOpacity key={tag?.id || tagIndex} style={styles.hashtag}>
                        <Text style={styles.hashtagText}>#{tag?.name || 'tag'}</Text>
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
                           name={post.hasReacted ? 'heart' : 'heart-outline'}
                           size={22}
                           color={post.hasReacted ? '#EF4444' : '#6B7280'}
                        />
                        <Text style={[styles.actionText, post.hasReacted && styles.likedText]}>
                           {Number.isFinite(post.reactionCount) ? post.reactionCount : 0}
                        </Text>
                     </TouchableOpacity>
                  </Animated.View>

                  <TouchableOpacity
                     style={styles.actionButton}
                     onPress={async () => {
                        try {
                           await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        } catch {
                           // Haptics not available
                        }
                        onCommentPress()
                     }}
                  >
                     <Ionicons name="chatbubble-outline" size={22} color="#6B7280" />
                     <Text style={styles.actionText}>{Number.isFinite(post.commentCount) ? post.commentCount : 0}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     style={styles.actionButton}
                     onPress={async () => {
                        try {
                           await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        } catch {
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
   loadingContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
   },
   loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
   },
   emptyContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
   },
   emptyText: {
      marginTop: 16,
      fontSize: 18,
      fontWeight: '600',
      color: '#374151',
      textAlign: 'center',
   },
   emptySubtext: {
      marginTop: 8,
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'center',
   },
   loadMoreContainer: {
      padding: 20,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
   },
   loadMoreText: {
      marginLeft: 8,
      fontSize: 14,
      color: '#6B7280',
   },
   endContainer: {
      padding: 20,
      alignItems: 'center',
   },
   endText: {
      fontSize: 14,
      color: '#9CA3AF',
      textAlign: 'center',
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
   moodText: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: '500',
   },
   videoContainer: {
      height: 320,
      width: '100%',
      backgroundColor: '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
   },
   videoPlaceholder: {
      fontSize: 16,
      color: '#6B7280',
      fontWeight: '500',
   },
   imageCountBadge: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      borderRadius: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
   },
   imageCountText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
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
