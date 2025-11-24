'use client'

import { formatOpeningHours, getCuisineIcon } from '@/services/MapService'
import { Restaurant } from '@/type/location'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import {
   Alert,
   Linking,
   Modal,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
   restaurant: Restaurant | null
   visible: boolean
   onClose: () => void
   onNavigateToRestaurant?: (restaurant: Restaurant) => void
}

export default function RestaurantDetailModal({ restaurant, visible, onClose, onNavigateToRestaurant }: Props) {
   if (!restaurant) return null

   const handleCall = () => {
      if (restaurant.tags.phone) {
         const phoneNumber = restaurant.tags.phone.replace(/\s/g, '')
         Linking.openURL(`tel:${phoneNumber}`)
      } else {
         Alert.alert('Thông báo', 'Không có số điện thoại')
      }
   }

   const handleWebsite = () => {
      if (restaurant.tags.website) {
         Linking.openURL(restaurant.tags.website)
      } else {
         Alert.alert('Thông báo', 'Không có website')
      }
   }

   const handleDirections = () => {
      if (onNavigateToRestaurant) {
         // Đóng modal và chuyển về map với route planning
         onClose()
         onNavigateToRestaurant(restaurant)
      } else {
         // Fallback: mở Google Maps nếu không có callback
         const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lon}`
         Linking.openURL(url)
      }
   }

   const getAddress = () => {
      // Ưu tiên formatted_address từ Goong
      if (restaurant.formatted_address) {
         return restaurant.formatted_address
      }
      // Fallback về OSM data
      const street = restaurant.tags['addr:street']
      const number = restaurant.tags['addr:housenumber']
      if (street && number) {
         return `${number} ${street}`
      }
      return street || 'Không rõ địa chỉ'
   }

   const getDietaryInfo = () => {
      const info = []
      if (
         restaurant.tags['diet:vegetarian'] === 'yes' ||
         restaurant.tags['diet:vegetarian'] === 'only'
      ) {
         info.push('Chay')
      }
      if (restaurant.tags['diet:vegan'] === 'yes' || restaurant.tags['diet:vegan'] === 'only') {
         info.push('Thuần chay')
      }
      return info.join(', ')
   }

   const cuisineIcon = getCuisineIcon(restaurant.tags.cuisine || '')

   return (
      <Modal
         visible={visible}
         animationType="slide"
         presentationStyle="pageSheet"
         onRequestClose={onClose}
      >
         <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header with gradient */}
            <LinearGradient
               colors={['#F9FAFB', '#FFFFFF']}
               start={{ x: 0, y: 0 }}
               end={{ x: 0, y: 1 }}
               style={styles.header}
            >
               <Text style={styles.title} numberOfLines={2}>
                  {restaurant.name}
               </Text>
               <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={20} color="#6b7280" />
               </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
               {/* Cuisine Type - Card Layout */}
               <View style={styles.cuisineContainer}>
                  <View style={styles.cuisineIconWrapper}>
                     <MaterialCommunityIcons name={cuisineIcon.name} size={24} color={cuisineIcon.color} />
                  </View>
                  <View style={styles.cuisineTextWrapper}>
                     <Text style={styles.cuisineLabel}>Loại hình</Text>
                     <Text style={styles.cuisineText}>{restaurant.tags.cuisine || 'Quán ăn'}</Text>
                  </View>
               </View>

               {/* Address - Info Card */}
               <View style={styles.infoCard}>
                  <View style={styles.infoHeader}>
                     <MaterialCommunityIcons name="map-marker" size={20} color="#3B82F6" />
                     <Text style={styles.infoLabel}>Địa chỉ</Text>
                  </View>
                  <Text style={styles.infoText}>{getAddress()}</Text>
               </View>

               {/* Opening Hours - Info Card */}
               {restaurant.tags.opening_hours && (
                  <View style={styles.infoCard}>
                     <View style={styles.infoHeader}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color="#10B981" />
                        <Text style={styles.infoLabel}>Giờ mở cửa</Text>
                     </View>
                     <Text style={styles.infoText}>{formatOpeningHours(restaurant.tags.opening_hours)}</Text>
                  </View>
               )}

               {/* Dietary Information - Info Card */}
               {getDietaryInfo() && (
                  <View style={styles.infoCard}>
                     <View style={styles.infoHeader}>
                        <MaterialCommunityIcons name="leaf" size={20} color="#22C55E" />
                        <Text style={styles.infoLabel}>Thông tin đặc biệt</Text>
                     </View>
                     <Text style={styles.infoText}>{getDietaryInfo()}</Text>
                  </View>
               )}

               {/* Contact Information */}
               {(restaurant.tags.phone || restaurant.tags.website) && (
                  <View style={styles.contactSection}>
                     {restaurant.tags.phone && (
                        <TouchableOpacity onPress={handleCall} style={styles.contactButton}>
                           <View style={styles.contactIconWrapper}>
                              <MaterialCommunityIcons name="phone" size={20} color="#16a34a" />
                           </View>
                           <Text style={styles.contactText}>{restaurant.tags.phone}</Text>
                        </TouchableOpacity>
                     )}
                     {restaurant.tags.website && (
                        <TouchableOpacity onPress={handleWebsite} style={styles.websiteButton}>
                           <View style={styles.contactIconWrapper}>
                              <MaterialCommunityIcons name="web" size={20} color="#2563eb" />
                           </View>
                           <Text style={styles.websiteText} numberOfLines={1}>Website</Text>
                        </TouchableOpacity>
                     )}
                  </View>
               )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
               <TouchableOpacity onPress={handleDirections} style={styles.directionsButton}>
                  <LinearGradient
                     colors={['#3B82F6', '#2563EB']}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 0 }}
                     style={styles.directionsButtonGradient}
                  >
                     <MaterialCommunityIcons name="map" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                     <Text style={styles.directionsText}>Chỉ đường</Text>
                  </LinearGradient>
               </TouchableOpacity>
            </View>
         </SafeAreaView>
      </Modal>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#ffffff',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
   },
   title: {
      fontSize: 22,
      fontWeight: 'bold',
      flex: 1,
      marginRight: 16,
      color: '#111827',
      lineHeight: 28,
   },
   closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#f3f4f6',
      alignItems: 'center',
      justifyContent: 'center',
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      padding: 20,
   },
   // Cuisine Container - Card Layout
   cuisineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      padding: 16,
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#3B82F6',
   },
   cuisineIconWrapper: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#EFF6FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
   },
   cuisineTextWrapper: {
      flex: 1,
   },
   cuisineLabel: {
      fontSize: 12,
      color: '#6B7280',
      marginBottom: 4,
      textTransform: 'uppercase',
      fontWeight: '600',
      letterSpacing: 0.5,
   },
   cuisineText: {
      fontSize: 16,
      color: '#111827',
      fontWeight: '600',
      textTransform: 'capitalize',
   },
   // Info Cards
   infoCard: {
      marginBottom: 16,
      padding: 16,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
   },
   infoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
   },
   infoLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#374151',
      marginLeft: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
   },
   infoText: {
      fontSize: 15,
      color: '#1f2937',
      lineHeight: 22,
      marginLeft: 28,
   },
   // Contact Section
   contactSection: {
      marginBottom: 24,
   },
   contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      padding: 14,
      backgroundColor: '#F0FDF4',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#D1FAE5',
   },
   contactIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
   },
   contactText: {
      color: '#15803d',
      fontWeight: '500',
      fontSize: 15,
      flex: 1,
   },
   websiteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      backgroundColor: '#EFF6FF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#DBEAFE',
   },
   websiteText: {
      color: '#1d4ed8',
      fontWeight: '500',
      fontSize: 15,
      flex: 1,
   },
   actionContainer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      backgroundColor: '#ffffff',
   },
   directionsButton: {
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#3b82f6',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
   },
   directionsButtonGradient: {
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   directionsText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 16,
   },
})