import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
   ActivityIndicator,
   Dimensions,
   Linking,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
   RestaurantResponse,
   restaurantService,
} from '@/services/RestaurantService'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function RestaurantDetailScreen() {
   const router = useRouter()
   const { id } = useLocalSearchParams<{ id: string }>()
   const [restaurant, setRestaurant] = useState<RestaurantResponse | null>(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   const [currentImageIndex, setCurrentImageIndex] = useState(0)

   // Fetch restaurant detail
   useEffect(() => {
      const fetchRestaurantDetail = async () => {
         if (!id) {
            setError('Không tìm thấy ID nhà hàng')
            setLoading(false)
            return
         }

         try {
            setLoading(true)
            setError(null)
            const data = await restaurantService.getRestaurantById(id)
            
            if (data) {
               setRestaurant(data)
            } else {
               setError('Không thể tải thông tin nhà hàng')
            }
         } catch (err) {
            console.error('Error fetching restaurant:', err)
            setError('Đã xảy ra lỗi khi tải thông tin nhà hàng')
         } finally {
            setLoading(false)
         }
      }

      fetchRestaurantDetail()
   }, [id])

   // Open Google Maps
   const openMaps = () => {
      if (restaurant?.latitude && restaurant?.longitude) {
         const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`
         Linking.openURL(url)
      }
   }

   // Format rating
   const formatRating = (rating?: number): string => {
      if (!rating) return 'Chưa có đánh giá'
      return rating.toFixed(1)
   }

   // Render loading state
   if (loading) {
      return (
         <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
               <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#111827" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Chi tiết nhà hàng</Text>
               <View style={styles.headerRight} />
            </View>
            <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#F97316" />
               <Text style={styles.loadingText}>Đang tải thông tin...</Text>
            </View>
         </SafeAreaView>
      )
   }

   // Render error state
   if (error || !restaurant) {
      return (
         <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
               <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#111827" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Chi tiết nhà hàng</Text>
               <View style={styles.headerRight} />
            </View>
            <View style={styles.errorContainer}>
               <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
               <Text style={styles.errorTitle}>Không thể tải dữ liệu</Text>
               <Text style={styles.errorSubtitle}>{error || 'Vui lòng thử lại sau'}</Text>
               <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
                  <Text style={styles.retryButtonText}>Quay lại</Text>
               </TouchableOpacity>
            </View>
         </SafeAreaView>
      )
   }

   // Get images
   const images = restaurant.images && restaurant.images.length > 0 
      ? restaurant.images 
      : []

   return (
      <SafeAreaView style={styles.container} edges={['top']}>
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
               <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{restaurant.name}</Text>
            <View style={styles.headerRight}>
               {restaurant.isFavorited !== null && (
                  <TouchableOpacity style={styles.favoriteButton}>
                     <Ionicons 
                        name={restaurant.isFavorited ? "heart" : "heart-outline"} 
                        size={24} 
                        color={restaurant.isFavorited ? "#EF4444" : "#6B7280"} 
                     />
                  </TouchableOpacity>
               )}
            </View>
         </View>

         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Image Gallery */}
            {images.length > 0 ? (
               <View style={styles.imageGallery}>
                  <ScrollView
                     horizontal
                     pagingEnabled
                     showsHorizontalScrollIndicator={false}
                     onMomentumScrollEnd={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
                        setCurrentImageIndex(index)
                     }}
                  >
                     {images.map((img, index) => (
                        <Image
                           key={index}
                           source={{ uri: img.url }}
                           style={styles.galleryImage}
                           contentFit="cover"
                        />
                     ))}
                  </ScrollView>
                  {images.length > 1 && (
                     <View style={styles.imageIndicator}>
                        <Text style={styles.imageIndicatorText}>
                           {currentImageIndex + 1} / {images.length}
                        </Text>
                     </View>
                  )}
               </View>
            ) : (
               <View style={styles.placeholderImage}>
                  <Ionicons name="restaurant" size={64} color="#9CA3AF" />
                  <Text style={styles.placeholderText}>Chưa có hình ảnh</Text>
               </View>
            )}

            {/* Restaurant Info */}
            <View style={styles.infoSection}>
               {/* Name & Featured */}
               <View style={styles.nameRow}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  {restaurant.featured && (
                     <View style={styles.featuredBadge}>
                        <Ionicons name="star" size={14} color="#FFFFFF" />
                        <Text style={styles.featuredText}>Nổi bật</Text>
                     </View>
                  )}
               </View>

               {/* Rating */}
               <View style={styles.ratingRow}>
                  <Ionicons name="star" size={20} color="#FBBF24" />
                  <Text style={styles.ratingText}>{formatRating(restaurant.rating)}</Text>
                  {restaurant.favoriteCount !== null && restaurant.favoriteCount !== undefined && (
                     <Text style={styles.favoriteCountText}>
                        ({restaurant.favoriteCount} yêu thích)
                     </Text>
                  )}
               </View>

               {/* Address */}
               <TouchableOpacity style={styles.infoRow} onPress={openMaps}>
                  <View style={styles.infoIconContainer}>
                     <Ionicons name="location" size={20} color="#F97316" />
                  </View>
                  <View style={styles.infoContent}>
                     <Text style={styles.infoLabel}>Địa chỉ</Text>
                     <Text style={styles.infoValue}>{restaurant.address || 'Chưa cập nhật'}</Text>
                  </View>
                  <Ionicons name="navigate" size={20} color="#F97316" />
               </TouchableOpacity>

               {/* District */}
               {restaurant.district && (
                  <View style={styles.infoRow}>
                     <View style={styles.infoIconContainer}>
                        <Ionicons name="map" size={20} color="#3B82F6" />
                     </View>
                     <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Quận/Huyện</Text>
                        <Text style={styles.infoValue}>{restaurant.district}</Text>
                     </View>
                  </View>
               )}

               {/* Price */}
               {restaurant.price && (
                  <View style={styles.infoRow}>
                     <View style={styles.infoIconContainer}>
                        <Ionicons name="cash" size={20} color="#10B981" />
                     </View>
                     <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Mức giá</Text>
                        <Text style={styles.infoValue}>{restaurant.price}</Text>
                     </View>
                  </View>
               )}

               {/* Distance */}
               {restaurant.distance !== null && restaurant.distance !== undefined && (
                  <View style={styles.infoRow}>
                     <View style={styles.infoIconContainer}>
                        <Ionicons name="walk" size={20} color="#8B5CF6" />
                     </View>
                     <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Khoảng cách</Text>
                        <Text style={styles.infoValue}>
                           {restaurant.distance < 1000 
                              ? `${Math.round(restaurant.distance)} m` 
                              : `${(restaurant.distance / 1000).toFixed(1)} km`}
                        </Text>
                     </View>
                  </View>
               )}

               {/* Types/Categories */}
               {restaurant.types && restaurant.types.length > 0 && (
                  <View style={styles.typesSection}>
                     <Text style={styles.sectionTitle}>Loại hình</Text>
                     <View style={styles.typesContainer}>
                        {restaurant.types.map((type, index) => (
                           <View key={index} style={styles.typeTag}>
                              {type.emoji && <Text style={styles.typeEmoji}>{type.emoji}</Text>}
                              <Text style={styles.typeText}>{type.name}</Text>
                           </View>
                        ))}
                     </View>
                  </View>
               )}

               {/* Coordinates (for debugging) */}
               {restaurant.latitude && restaurant.longitude && (
                  <View style={styles.coordinatesSection}>
                     <Text style={styles.coordinatesLabel}>Tọa độ:</Text>
                     <Text style={styles.coordinatesValue}>
                        {restaurant.latitude.toFixed(6)}, {restaurant.longitude.toFixed(6)}
                     </Text>
                  </View>
               )}
            </View>
         </ScrollView>

         {/* Bottom Action Bar */}
         <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.directionsButton} onPress={openMaps}>
               <Ionicons name="navigate" size={20} color="#FFFFFF" />
               <Text style={styles.directionsButtonText}>Chỉ đường</Text>
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
   headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      color: '#111827',
      marginHorizontal: 12,
   },
   headerRight: {
      width: 40,
      alignItems: 'flex-end',
   },
   favoriteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
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
   errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
   },
   errorTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
      marginTop: 16,
   },
   errorSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 8,
      textAlign: 'center',
   },
   retryButton: {
      marginTop: 24,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: '#F97316',
      borderRadius: 8,
   },
   retryButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
   },
   content: {
      flex: 1,
   },
   imageGallery: {
      width: SCREEN_WIDTH,
      height: 250,
      position: 'relative',
   },
   galleryImage: {
      width: SCREEN_WIDTH,
      height: 250,
   },
   imageIndicator: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
   },
   imageIndicatorText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '500',
   },
   placeholderImage: {
      width: SCREEN_WIDTH,
      height: 200,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
   },
   placeholderText: {
      marginTop: 12,
      fontSize: 14,
      color: '#9CA3AF',
   },
   infoSection: {
      padding: 16,
   },
   nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
   },
   restaurantName: {
      flex: 1,
      fontSize: 24,
      fontWeight: '700',
      color: '#111827',
   },
   featuredBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F97316',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 16,
      marginLeft: 8,
   },
   featuredText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 4,
   },
   ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
   },
   ratingText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#B45309',
      marginLeft: 6,
   },
   favoriteCountText: {
      fontSize: 14,
      color: '#6B7280',
      marginLeft: 8,
   },
   infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: 14,
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
   },
   infoIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
   },
   infoContent: {
      flex: 1,
      marginLeft: 12,
   },
   infoLabel: {
      fontSize: 12,
      color: '#6B7280',
      marginBottom: 2,
   },
   infoValue: {
      fontSize: 15,
      fontWeight: '500',
      color: '#111827',
   },
   typesSection: {
      marginTop: 16,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 12,
   },
   typesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
   },
   typeTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E5E7EB',
   },
   typeEmoji: {
      fontSize: 16,
      marginRight: 6,
   },
   typeText: {
      fontSize: 14,
      color: '#374151',
      fontWeight: '500',
   },
   coordinatesSection: {
      marginTop: 20,
      padding: 12,
      backgroundColor: '#F3F4F6',
      borderRadius: 8,
   },
   coordinatesLabel: {
      fontSize: 12,
      color: '#6B7280',
   },
   coordinatesValue: {
      fontSize: 13,
      color: '#374151',
      fontFamily: 'monospace',
      marginTop: 4,
   },
   bottomBar: {
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
   },
   directionsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F97316',
      paddingVertical: 14,
      borderRadius: 12,
   },
   directionsButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 8,
   },
})

