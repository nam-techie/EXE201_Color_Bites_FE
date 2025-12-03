import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
   ActivityIndicator,
   FlatList,
   RefreshControl,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
   PaginatedRestaurantResponse,
   RestaurantResponse,
   restaurantService,
} from '@/services/RestaurantService'

const PAGE_SIZE = 10

export default function RestaurantListScreen() {
   const router = useRouter()
   const [restaurants, setRestaurants] = useState<RestaurantResponse[]>([])
   const [loading, setLoading] = useState(true)
   const [refreshing, setRefreshing] = useState(false)
   const [currentPage, setCurrentPage] = useState(1)
   const [totalPages, setTotalPages] = useState(0)
   const [totalElements, setTotalElements] = useState(0)

   // Fetch restaurants for a specific page
   const fetchRestaurants = useCallback(async (pageNum: number, isRefresh: boolean = false) => {
      try {
         if (isRefresh) {
            setRefreshing(true)
         } else {
            setLoading(true)
         }

         const response: PaginatedRestaurantResponse = await restaurantService.getAllRestaurants(pageNum, PAGE_SIZE)

         setRestaurants(response.content || [])
         setTotalElements(response.totalElements)
         setTotalPages(response.totalPages)
         setCurrentPage(pageNum)
      } catch (error) {
         console.error('Error fetching restaurants:', error)
      } finally {
         setLoading(false)
         setRefreshing(false)
      }
   }, [])

   // Initial load
   useEffect(() => {
      fetchRestaurants(1)
   }, [fetchRestaurants])

   // Pull to refresh
   const onRefresh = useCallback(() => {
      fetchRestaurants(currentPage, true)
   }, [fetchRestaurants, currentPage])

   // Go to specific page
   const goToPage = useCallback((pageNum: number) => {
      if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
         fetchRestaurants(pageNum)
      }
   }, [totalPages, currentPage, fetchRestaurants])

   // Get first image from restaurant
   const getRestaurantImage = (restaurant: RestaurantResponse): string | null => {
      if (restaurant.images && restaurant.images.length > 0) {
         return restaurant.images[0].url
      }
      return null
   }

   // Format rating
   const formatRating = (rating?: number): string => {
      if (!rating) return 'N/A'
      return rating.toFixed(1)
   }

   // Generate page numbers to display
   const getPageNumbers = (): (number | string)[] => {
      const pages: (number | string)[] = []
      const maxVisiblePages = 5

      if (totalPages <= maxVisiblePages + 2) {
         // Show all pages if total is small
         for (let i = 1; i <= totalPages; i++) {
            pages.push(i)
         }
      } else {
         // Always show first page
         pages.push(1)

         if (currentPage > 3) {
            pages.push('...')
         }

         // Show pages around current page
         const start = Math.max(2, currentPage - 1)
         const end = Math.min(totalPages - 1, currentPage + 1)

         for (let i = start; i <= end; i++) {
            pages.push(i)
         }

         if (currentPage < totalPages - 2) {
            pages.push('...')
         }

         // Always show last page
         if (totalPages > 1) {
            pages.push(totalPages)
         }
      }

      return pages
   }

   // Render restaurant item
   const renderRestaurantItem = ({ item }: { item: RestaurantResponse }) => {
      const imageUrl = getRestaurantImage(item)

      return (
         <TouchableOpacity
            style={styles.restaurantCard}
            activeOpacity={0.7}
            onPress={() => {
               router.push({
                  pathname: '/restaurant-detail',
                  params: { id: item.id }
               })
            }}
         >
            {/* Restaurant Image */}
            <View style={styles.imageContainer}>
               {imageUrl ? (
                  <Image
                     source={{ uri: imageUrl }}
                     style={styles.restaurantImage}
                     contentFit="cover"
                  />
               ) : (
                  <View style={styles.placeholderImage}>
                     <Ionicons name="restaurant" size={32} color="#9CA3AF" />
                  </View>
               )}
               {item.featured && (
                  <View style={styles.featuredBadge}>
                     <Ionicons name="star" size={12} color="#FFFFFF" />
                     <Text style={styles.featuredText}>Nổi bật</Text>
                  </View>
               )}
            </View>

            {/* Restaurant Info */}
            <View style={styles.infoContainer}>
               <Text style={styles.restaurantName} numberOfLines={1}>
                  {item.name}
               </Text>

               {/* Address */}
               <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.addressText} numberOfLines={2}>
                     {item.address || 'Chưa có địa chỉ'}
                  </Text>
               </View>

               {/* Rating & Price */}
               <View style={styles.metaRow}>
                  {item.rating && (
                     <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FBBF24" />
                        <Text style={styles.ratingText}>{formatRating(item.rating)}</Text>
                     </View>
                  )}
                  {item.price && (
                     <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>{item.price}</Text>
                     </View>
                  )}
                  {item.district && (
                     <View style={styles.districtContainer}>
                        <Text style={styles.districtText}>{item.district}</Text>
                     </View>
                  )}
               </View>

               {/* Types/Categories */}
               {item.types && item.types.length > 0 && (
                  <View style={styles.typesContainer}>
                     {item.types.slice(0, 3).map((type, index) => (
                        <View key={index} style={styles.typeTag}>
                           {type.emoji && <Text style={styles.typeEmoji}>{type.emoji}</Text>}
                           <Text style={styles.typeText}>{type.name}</Text>
                        </View>
                     ))}
                  </View>
               )}
            </View>

            {/* Arrow */}
            <View style={styles.arrowContainer}>
               <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
         </TouchableOpacity>
      )
   }

   // Render pagination
   const renderPagination = () => {
      if (totalPages <= 1) return null

      const pageNumbers = getPageNumbers()

      return (
         <View style={styles.paginationContainer}>
            {/* Previous button */}
            <TouchableOpacity
               style={[styles.pageButton, styles.navButton, currentPage === 1 && styles.pageButtonDisabled]}
               onPress={() => goToPage(currentPage - 1)}
               disabled={currentPage === 1}
            >
               <Ionicons name="chevron-back" size={18} color={currentPage === 1 ? '#D1D5DB' : '#374151'} />
            </TouchableOpacity>

            {/* Page numbers */}
            <ScrollView
               horizontal
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.pageNumbersContainer}
            >
               {pageNumbers.map((pageNum, index) => {
                  if (pageNum === '...') {
                     return (
                        <View key={`ellipsis-${index}`} style={styles.ellipsis}>
                           <Text style={styles.ellipsisText}>...</Text>
                        </View>
                     )
                  }

                  const isActive = pageNum === currentPage
                  return (
                     <TouchableOpacity
                        key={pageNum}
                        style={[styles.pageButton, isActive && styles.pageButtonActive]}
                        onPress={() => goToPage(pageNum as number)}
                     >
                        <Text style={[styles.pageButtonText, isActive && styles.pageButtonTextActive]}>
                           {pageNum}
                        </Text>
                     </TouchableOpacity>
                  )
               })}
            </ScrollView>

            {/* Next button */}
            <TouchableOpacity
               style={[styles.pageButton, styles.navButton, currentPage === totalPages && styles.pageButtonDisabled]}
               onPress={() => goToPage(currentPage + 1)}
               disabled={currentPage === totalPages}
            >
               <Ionicons name="chevron-forward" size={18} color={currentPage === totalPages ? '#D1D5DB' : '#374151'} />
            </TouchableOpacity>
         </View>
      )
   }

   // Render empty state
   const renderEmpty = () => {
      if (loading) return null
      return (
         <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Chưa có nhà hàng nào</Text>
            <Text style={styles.emptySubtitle}>Hãy thử lại sau</Text>
         </View>
      )
   }

   return (
      <SafeAreaView style={styles.container} edges={['top']}>
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
               <Text style={styles.headerTitle}>Tất cả nhà hàng</Text>
               {totalElements > 0 && (
                  <Text style={styles.headerSubtitle}>
                     {totalElements} nhà hàng - Trang {currentPage}/{totalPages}
                  </Text>
               )}
            </View>
            <View style={styles.headerRight} />
         </View>

         {/* Content */}
         {loading ? (
            <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#F97316" />
               <Text style={styles.loadingText}>Đang tải danh sách...</Text>
            </View>
         ) : (
            <>
               <FlatList
                  data={restaurants}
                  renderItem={renderRestaurantItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                     <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#F97316']}
                        tintColor="#F97316"
                     />
                  }
                  ListEmptyComponent={renderEmpty}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
               />

               {/* Pagination */}
               {renderPagination()}
            </>
         )}
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
   },
   backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
   },
   headerTitleContainer: {
      flex: 1,
      marginLeft: 12,
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#111827',
   },
   headerSubtitle: {
      fontSize: 13,
      color: '#6B7280',
      marginTop: 2,
   },
   headerRight: {
      width: 40,
   },
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: '#6B7280',
   },
   listContent: {
      padding: 16,
      paddingBottom: 80,
   },
   restaurantCard: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
   },
   imageContainer: {
      width: 80,
      height: 80,
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative',
   },
   restaurantImage: {
      width: '100%',
      height: '100%',
   },
   placeholderImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
   },
   featuredBadge: {
      position: 'absolute',
      top: 4,
      left: 4,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F97316',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
   },
   featuredText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 2,
   },
   infoContainer: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'center',
   },
   restaurantName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 4,
   },
   infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 6,
   },
   addressText: {
      flex: 1,
      fontSize: 13,
      color: '#6B7280',
      marginLeft: 4,
      lineHeight: 18,
   },
   metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 6,
   },
   ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
   },
   ratingText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#B45309',
      marginLeft: 2,
   },
   priceContainer: {
      backgroundColor: '#DCFCE7',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
   },
   priceText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#166534',
   },
   districtContainer: {
      backgroundColor: '#E0E7FF',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
   },
   districtText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#3730A3',
   },
   typesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
   },
   typeTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
   },
   typeEmoji: {
      fontSize: 12,
      marginRight: 2,
   },
   typeText: {
      fontSize: 11,
      color: '#4B5563',
   },
   arrowContainer: {
      justifyContent: 'center',
      paddingLeft: 8,
   },
   separator: {
      height: 12,
   },
   emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
   },
   emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
      marginTop: 16,
   },
   emptySubtitle: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 4,
   },
   // Pagination styles
   paginationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
   },
   pageNumbersContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   pageButton: {
      minWidth: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 2,
   },
   navButton: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E5E7EB',
   },
   pageButtonActive: {
      backgroundColor: '#F97316',
   },
   pageButtonDisabled: {
      opacity: 0.5,
   },
   pageButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#374151',
   },
   pageButtonTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
   },
   ellipsis: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
   },
   ellipsisText: {
      fontSize: 14,
      color: '#6B7280',
   },
})
