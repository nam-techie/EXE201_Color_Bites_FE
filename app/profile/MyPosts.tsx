'use client'

import { getDefaultAvatar } from '@/constants/defaultImages'
import { postService } from '@/services/PostService'
import type { PostResponse } from '@/type'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

const { width } = Dimensions.get('window')

// Normalize post data từ API response (similar to home screen)
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

export default function MyPosts() {
   const router = useRouter()
   const [posts, setPosts] = useState<PostResponse[]>([])
   const [isRefreshing, setIsRefreshing] = useState(false)
   const [showFilters, setShowFilters] = useState(false)
   const [selectedImageFilter, setSelectedImageFilter] = useState<'all' | 'with-images' | 'text-only'>('all')
   const [selectedTimeFilter, setSelectedTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
   const [searchQuery, setSearchQuery] = useState('')
   const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
   const [appliedImageFilter, setAppliedImageFilter] = useState<typeof selectedImageFilter>('all')
   const [appliedTimeFilter, setAppliedTimeFilter] = useState<typeof selectedTimeFilter>('all')
   const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
   const [appliedSortBy, setAppliedSortBy] = useState<typeof sortBy>('newest')

   const filteredAndSortedPosts = useMemo(() => {
      let filtered = [...posts]
      if (appliedImageFilter === 'with-images') filtered = filtered.filter(p => p.imageUrls?.length)
      if (appliedImageFilter === 'text-only') filtered = filtered.filter(p => !p.imageUrls?.length)
      if (appliedTimeFilter !== 'all') {
         const now = new Date()
         const since = new Date()
         if (appliedTimeFilter === 'today') since.setHours(0,0,0,0)
         if (appliedTimeFilter === 'week') { since.setDate(now.getDate()-7); since.setHours(0,0,0,0) }
         if (appliedTimeFilter === 'month') { since.setMonth(now.getMonth()-1); since.setHours(0,0,0,0) }
         filtered = filtered.filter(p => new Date(p.createdAt) >= since)
      }
      if (appliedSearchQuery.trim()) {
         const q = appliedSearchQuery.toLowerCase()
         filtered = filtered.filter(p => p.content.toLowerCase().includes(q) || p.tags.some(t => t.name.toLowerCase().includes(q)))
      }
      filtered.sort((a,b)=> appliedSortBy==='newest' ? new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime())
      return filtered
   }, [posts, appliedImageFilter, appliedTimeFilter, appliedSearchQuery, appliedSortBy])

   const load = useCallback(async () => {
      try {
         const res = await postService.getUserPosts(1, 50)
         
         if (res.content && res.content.length > 0) {
            // Normalize data trước khi set vào state
            const normalizedPosts = res.content.map(normalizePost)
            setPosts(normalizedPosts)
         } else {
            setPosts([])
         }
      } catch (error) {
         console.error('Error loading posts:', error)
         Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể tải bài viết' })
      } finally {
         setIsRefreshing(false)
      }
   }, [])

   useEffect(() => { load() }, [load])

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <View style={styles.headerContent}>
               <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="arrow-back" size={24} color="#111827" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Bài viết ({filteredAndSortedPosts.length})</Text>
               <View style={styles.headerSpacer} />
            </View>
         </View>

         {/* Enhanced Filter and Search Bar */}
         <View style={styles.filterContainer}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
               <Ionicons name="search-outline" size={18} color="#6B7280" />
               <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9CA3AF"
               />
               {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                     <Ionicons name="close-circle" size={18} color="#6B7280" />
                  </TouchableOpacity>
               )}
            </View>

            {/* Filter Toggle Button */}
            <TouchableOpacity 
               style={[styles.filterToggleButton, showFilters && styles.filterToggleButtonActive]}
               onPress={() => setShowFilters(!showFilters)}
               activeOpacity={0.7}
            >
               <Ionicons name="options-outline" size={18} color={showFilters ? "#FFFFFF" : "#F97316"} />
               <Text style={[styles.filterToggleText, showFilters && styles.filterToggleTextActive]}>
                  Bộ lọc
               </Text>
               <Ionicons 
                  name={showFilters ? "chevron-up" : "chevron-down"} 
                  size={14} 
                  color={showFilters ? "#FFFFFF" : "#F97316"} 
               />
            </TouchableOpacity>
         </View>

         {/* Enhanced Filter Panel */}
         {showFilters && (
            <View style={styles.filterPanel}>
               {/* Image Type Filter */}
               <View style={styles.filterSection}>
                  <View style={styles.filterSectionHeader}>
                     <Ionicons name="images-outline" size={16} color="#6B7280" />
                     <Text style={styles.filterSectionTitle}>Loại bài viết</Text>
                  </View>
                  <View style={styles.filterButtons}>
                     {[
                        { key: 'all', label: 'Tất cả', icon: 'grid-outline' },
                        { key: 'with-images', label: 'Có ảnh', icon: 'image-outline' },
                        { key: 'text-only', label: 'Chỉ text', icon: 'document-text-outline' }
                     ].map((filter) => (
                        <TouchableOpacity
                           key={filter.key}
                           style={[
                              styles.filterButton,
                              selectedImageFilter === filter.key && styles.filterButtonActive
                           ]}
                           onPress={() => setSelectedImageFilter(filter.key as any)}
                           activeOpacity={0.7}
                        >
                           <Ionicons 
                              name={filter.icon as any} 
                              size={14} 
                              color={selectedImageFilter === filter.key ? "#FFFFFF" : "#6B7280"} 
                           />
                           <Text style={[
                              styles.filterButtonText,
                              selectedImageFilter === filter.key && styles.filterButtonTextActive
                           ]}>
                              {filter.label}
                           </Text>
                        </TouchableOpacity>
                     ))}
                  </View>
               </View>

               {/* Time Filter */}
               <View style={styles.filterSection}>
                  <View style={styles.filterSectionHeader}>
                     <Ionicons name="time-outline" size={16} color="#6B7280" />
                     <Text style={styles.filterSectionTitle}>Thời gian</Text>
                  </View>
                  <View style={styles.filterButtons}>
                     {[
                        { key: 'all', label: 'Tất cả', icon: 'calendar-outline' },
                        { key: 'today', label: 'Hôm nay', icon: 'today-outline' },
                        { key: 'week', label: 'Tuần này', icon: 'calendar-outline' },
                        { key: 'month', label: 'Tháng này', icon: 'calendar-outline' }
                     ].map((filter) => (
                        <TouchableOpacity
                           key={filter.key}
                           style={[
                              styles.filterButton,
                              selectedTimeFilter === filter.key && styles.filterButtonActive
                           ]}
                           onPress={() => setSelectedTimeFilter(filter.key as any)}
                           activeOpacity={0.7}
                        >
                           <Ionicons 
                              name={filter.icon as any} 
                              size={14} 
                              color={selectedTimeFilter === filter.key ? "#FFFFFF" : "#6B7280"} 
                           />
                           <Text style={[
                              styles.filterButtonText,
                              selectedTimeFilter === filter.key && styles.filterButtonTextActive
                           ]}>
                              {filter.label}
                           </Text>
                        </TouchableOpacity>
                     ))}
                  </View>
               </View>

               {/* Sort Options */}
               <View style={styles.filterSection}>
                  <View style={styles.filterSectionHeader}>
                     <Ionicons name="swap-vertical-outline" size={16} color="#6B7280" />
                     <Text style={styles.filterSectionTitle}>Sắp xếp</Text>
                  </View>
                  <View style={styles.filterButtons}>
                     {[
                        { key: 'newest', label: 'Mới nhất' },
                        { key: 'oldest', label: 'Cũ nhất' }
                     ].map((filter) => (
                        <TouchableOpacity
                           key={filter.key}
                           style={[
                              styles.filterButton,
                              sortBy === filter.key && styles.filterButtonActive
                           ]}
                           onPress={() => setSortBy(filter.key as any)}
                           activeOpacity={0.7}
                        >
                           <Text style={[
                              styles.filterButtonText,
                              sortBy === filter.key && styles.filterButtonTextActive
                           ]}>
                              {filter.label}
                           </Text>
                        </TouchableOpacity>
                     ))}
                  </View>
               </View>

               {/* Apply and Clear Filters Buttons */}
               <View style={styles.filterActionsContainer}>
                  <TouchableOpacity 
                     style={styles.applyFiltersButton}
                     onPress={() => {
                        setAppliedImageFilter(selectedImageFilter)
                        setAppliedTimeFilter(selectedTimeFilter)
                        setAppliedSearchQuery(searchQuery)
                        setAppliedSortBy(sortBy)
                        setShowFilters(false)
                     }}
                     activeOpacity={0.7}
                  >
                     <Ionicons name="checkmark-outline" size={16} color="#FFFFFF" />
                     <Text style={styles.applyFiltersText}>Áp dụng</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                     style={styles.clearFiltersButton}
                     onPress={() => {
                        setSelectedImageFilter('all')
                        setSelectedTimeFilter('all')
                        setSearchQuery('')
                        setSortBy('newest')
                        setAppliedImageFilter('all')
                        setAppliedTimeFilter('all')
                        setAppliedSearchQuery('')
                        setAppliedSortBy('newest')
                     }}
                     activeOpacity={0.7}
                  >
                     <Text style={styles.clearFiltersText}>Xóa tất cả bộ lọc</Text>
                  </TouchableOpacity>
               </View>
            </View>
         )}

         {/* List of all user posts */}
         <FlatList
            data={filteredAndSortedPosts}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: post }) => (
               <PostCard
                  post={post}
                  onCommentPress={() => {
                     // Handle comment press
                  }}
               />
            )}
            refreshControl={
               <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={() => { setIsRefreshing(true); load() }}
                  tintColor="#F97316"
               />
            }
            ListEmptyComponent={() => (
               <View style={styles.emptyState}>
                  <ActivityIndicator color="#F97316" />
                  <Text style={styles.emptyStateText}>Đang tải bài viết...</Text>
               </View>
            )}
         />
      </SafeAreaView>
   )
}

// Enhanced PostCard component for list view - similar to community screen
function PostCard({ 
   post, 
   onCommentPress 
}: { 
   post: PostResponse
   onCommentPress: () => void
}) {
   const [isLiked, setIsLiked] = useState(post.hasReacted || false)

   const handleToggleLike = useCallback(async () => {
      try {
         setIsLiked(!isLiked)
         // You can call postService.toggleReaction(post.id) here
      } catch (error) {
         console.error('Error toggling like:', error)
         setIsLiked(isLiked) // Revert on error
      }
   }, [isLiked])

   // Format time ago helper function
   const formatTimeAgo = (dateString: string): string => {
      const now = new Date()
      const postDate = new Date(dateString)
      
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

   return (
      <View style={styles.postCard}>
         {/* Post Header */}
         <View style={styles.postHeader}>
            <View style={styles.postHeaderContent}>
               <View style={styles.userInfo}>
                  <Image
                     source={{ uri: post.authorAvatar || getDefaultAvatar(post.authorName) }}
                     style={styles.postCardAvatar}
                     contentFit="cover"
                  />
                  <View>
                     <Text style={styles.postCardUserName}>{post.authorName || 'Unknown User'}</Text>
                     <View style={styles.postCardLocationContainer}>
                        <Text style={styles.postCardTimeText}>
                           {formatTimeAgo(post.createdAt)}
                        </Text>
                        {post.moodName && (
                           <>
                              <Text style={styles.postCardSeparator}>•</Text>
                              <Text style={styles.postCardMoodText}>{post.moodEmoji} {post.moodName}</Text>
                           </>
                        )}
                     </View>
                  </View>
               </View>
               <TouchableOpacity style={styles.postCardMoreButton}>
                  <Ionicons name="ellipsis-horizontal" size={16} color="#6B7280" />
               </TouchableOpacity>
            </View>
         </View>

         {/* Post Images - Only show if there are images */}
         {post.imageUrls && post.imageUrls.length > 0 && (
            <View style={styles.postCardImageContainer}>
            <ScrollView 
               horizontal 
               pagingEnabled 
               showsHorizontalScrollIndicator={false}
                  style={styles.postCardImageScrollView}
            >
               {post.imageUrls.map((imageUrl, index) => (
                  <Image
                     key={index}
                     source={{ uri: imageUrl }}
                     style={styles.postCardImage}
                     contentFit="cover"
                  />
               ))}
            </ScrollView>
               {/* Multiple images indicator */}
               {post.imageUrls.length > 1 && (
                  <View style={styles.multipleImagesIndicator}>
                     <Text style={styles.multipleImagesText}>
                        {post.imageUrls.length}
                     </Text>
                  </View>
               )}
            </View>
         )}

         {/* Post Content */}
         <View style={styles.postCardContent}>
            <Text style={styles.postCardCaption}>{post.content}</Text>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
               <View style={styles.postCardTagsContainer}>
                  {post.tags.map((tag) => (
                     <View key={tag.id} style={styles.postCardTag}>
                        <Text style={styles.postCardTagText}>#{tag.name}</Text>
                     </View>
                  ))}
               </View>
            )}

            {/* Actions */}
            <View style={styles.postCardActions}>
               <View style={styles.postCardActionsLeft}>
                  <TouchableOpacity 
                     style={styles.postCardActionButton}
                     onPress={handleToggleLike}
                  >
                     <Ionicons 
                        name={isLiked ? 'heart' : 'heart-outline'} 
                        size={22} 
                        color={isLiked ? '#EF4444' : '#6B7280'} 
                     />
                     <Text style={[styles.postCardActionText, isLiked && styles.likedText]}>
                        {post.reactionCount}
                     </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                     style={styles.postCardActionButton}
                     onPress={onCommentPress}
                  >
                     <Ionicons name="chatbubble-outline" size={22} color="#6B7280" />
                     <Text style={styles.postCardActionText}>{post.commentCount}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.postCardActionButton}>
                     <Ionicons name="share-outline" size={22} color="#6B7280" />
                     <Text style={styles.postCardActionText}>Chia sẻ</Text>
                  </TouchableOpacity>
               </View>

               <TouchableOpacity style={styles.postCardSaveButton}>
                  <Ionicons name="bookmark-outline" size={22} color="#6B7280" />
               </TouchableOpacity>
            </View>
         </View>
      </View>
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
   backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
   },
   headerSpacer: {
      width: 40,
   },
   // Enhanced Filter styles
   filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      gap: 12,
   },
   searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 10,
      borderWidth: 1,
      borderColor: '#E2E8F0',
   },
   searchInput: {
      flex: 1,
      fontSize: 15,
      color: '#1E293B',
      fontWeight: '400',
   },
   filterToggleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF7ED',
      borderWidth: 1,
      borderColor: '#FED7AA',
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 8,
      shadowColor: '#F97316',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
   },
   filterToggleButtonActive: {
      backgroundColor: '#F97316',
      borderColor: '#F97316',
   },
   filterToggleText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#F97316',
   },
   filterToggleTextActive: {
      color: '#FFFFFF',
   },
   // Enhanced Filter Panel
   filterPanel: {
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
      paddingHorizontal: 16,
      paddingVertical: 20,
   },
   filterSection: {
      marginBottom: 20,
   },
   filterSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
   },
   filterSectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#1E293B',
      letterSpacing: -0.2,
   },
   filterButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
   },
   filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
      gap: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 2,
      elevation: 1,
   },
   filterButtonActive: {
      backgroundColor: '#F97316',
      borderColor: '#F97316',
      shadowColor: '#F97316',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
   },
   filterButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#475569',
   },
   filterButtonTextActive: {
      color: '#FFFFFF',
   },
   // Filter Actions Container
   filterActionsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
   },
   applyFiltersButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F97316',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      gap: 8,
      shadowColor: '#F97316',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
   },
   applyFiltersText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
   },
   clearFiltersButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EF4444',
      borderWidth: 1,
      borderColor: '#DC2626',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      gap: 8,
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
   },
   clearFiltersText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
   },
   // Empty state
   emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
   },
   emptyStateText: {
      marginTop: 12,
      fontSize: 16,
      color: '#9CA3AF',
      textAlign: 'center',
   },
   // Multiple images indicator
   multipleImagesIndicator: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: 12,
      padding: 4,
   },
   multipleImagesText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
   },
   // PostCard styles
   postCard: {
      backgroundColor: '#FFFFFF',
      marginBottom: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      marginHorizontal: 16,
   },
   postHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
   },
   postHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
   },
   postCardAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
   },
   postCardUserName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
   },
   postCardLocationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
   },
   postCardTimeText: {
      fontSize: 12,
      color: '#6B7280',
   },
   postCardSeparator: {
      fontSize: 12,
      color: '#6B7280',
      marginHorizontal: 4,
   },
   postCardMoodText: {
      fontSize: 12,
      color: '#6B7280',
   },
   postCardMoreButton: {
      padding: 8,
   },
   postCardImageContainer: {
      position: 'relative',
   },
   postCardImageScrollView: {
      height: 300,
   },
   postCardImage: {
      width: width,
      height: 300,
   },
   postCardContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
   },
   postCardCaption: {
      fontSize: 15,
      lineHeight: 22,
      color: '#374151',
      marginBottom: 12,
   },
   postCardTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
   },
   postCardTag: {
      backgroundColor: '#EFF6FF',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 8,
      marginBottom: 8,
   },
   postCardTagText: {
      fontSize: 12,
      color: '#1D4ED8',
      fontWeight: '500',
   },
   postCardActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
   },
   postCardActionsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   postCardActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
   },
   postCardActionText: {
      marginLeft: 6,
      fontSize: 14,
      color: '#6B7280',
   },
   likedText: {
      color: '#EF4444',
   },
   postCardSaveButton: {
      padding: 4,
   },
})


