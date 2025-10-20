'use client'

import { formatOpeningHours, getCuisineIcon } from '@/services/GoongMapService'
import { Restaurant } from '@/type/location'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
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
         <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
               <Text style={styles.title} numberOfLines={2}>
                  {restaurant.name}
               </Text>
               <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
               </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
               {/* Cuisine Type */}
               <View style={styles.cuisineContainer}>
                  <MaterialCommunityIcons name={cuisineIcon.name as ComponentProps<typeof MaterialCommunityIcons>['name']} size={24} color={cuisineIcon.color} style={styles.cuisineIcon} />
                  <Text style={styles.cuisineText}>{restaurant.tags.cuisine || 'Quán ăn'}</Text>
               </View>

               {/* Address */}
               <View style={styles.infoSection}>
                  <MaterialCommunityIcons name="map-marker" size={18} color="#6b7280" style={{ marginRight: 4 }} />
                  <Text style={styles.infoText}>{getAddress()}</Text>
               </View>

               {/* Opening Hours */}
               {restaurant.tags.opening_hours && (
                  <View style={styles.infoSection}>
                     <MaterialCommunityIcons name="clock-outline" size={18} color="#6b7280" style={{ marginRight: 4 }} />
                     <Text style={styles.infoText}>{formatOpeningHours(restaurant.tags.opening_hours)}</Text>
                  </View>
               )}

               {/* Dietary Information */}
               {getDietaryInfo() && (
                  <View style={styles.infoSection}>
                     <MaterialCommunityIcons name="leaf" size={18} color="#6b7280" style={{ marginRight: 4 }} />
                     <Text style={styles.infoText}>{getDietaryInfo()}</Text>
                  </View>
               )}

               {/* Contact Information */}
               {(restaurant.tags.phone || restaurant.tags.website) && (
                  <View style={styles.contactSection}>
                     {restaurant.tags.phone && (
                        <TouchableOpacity onPress={handleCall} style={styles.contactButton}>
                           <MaterialCommunityIcons name="phone" size={20} color="#16a34a" style={styles.contactIcon} />
                           <Text style={styles.contactText}>{restaurant.tags.phone}</Text>
                        </TouchableOpacity>
                     )}
                     {restaurant.tags.website && (
                        <TouchableOpacity onPress={handleWebsite} style={styles.websiteButton}>
                           <MaterialCommunityIcons name="web" size={20} color="#2563eb" style={styles.websiteIcon} />
                           <Text style={styles.websiteText} numberOfLines={1}>Website</Text>
                        </TouchableOpacity>
                     )}
                  </View>
               )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
               <TouchableOpacity onPress={handleDirections} style={styles.directionsButton}>
                  <MaterialCommunityIcons name="map" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.directionsText}>Chỉ đường</Text>
               </TouchableOpacity>
            </View>
         </View>
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
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
   },
   title: {
      fontSize: 20,
      fontWeight: 'bold',
      flex: 1,
      marginRight: 16,
   },
   closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#f3f4f6',
      alignItems: 'center',
      justifyContent: 'center',
   },
   closeButtonText: {
      color: '#6b7280',
      fontWeight: 'bold',
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      padding: 16,
   },
   cuisineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
   },
   cuisineIcon: {
      fontSize: 24,
      marginRight: 8,
   },
   cuisineText: {
      fontSize: 18,
      color: '#374151',
      textTransform: 'capitalize',
   },
   infoSection: {
      marginBottom: 16,
   },
   infoLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6b7280',
      marginBottom: 4,
   },
   infoText: {
      fontSize: 16,
      color: '#1f2937',
   },
   amenitiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
   },
   amenityTag: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
   },
   amenityText: {
      fontSize: 14,
   },
   blueTag: {
      backgroundColor: '#dbeafe',
   },
   blueText: {
      color: '#1e40af',
   },
   greenTag: {
      backgroundColor: '#dcfce7',
   },
   greenText: {
      color: '#166534',
   },
   redTag: {
      backgroundColor: '#fee2e2',
   },
   redText: {
      color: '#dc2626',
   },
   purpleTag: {
      backgroundColor: '#f3e8ff',
   },
   purpleText: {
      color: '#7c3aed',
   },
   yellowTag: {
      backgroundColor: '#fef3c7',
   },
   yellowText: {
      color: '#d97706',
   },
   contactSection: {
      marginBottom: 24,
   },
   contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      padding: 12,
      backgroundColor: '#f0fdf4',
      borderRadius: 8,
   },
   contactIcon: {
      color: '#16a34a',
      marginRight: 8,
   },
   contactText: {
      color: '#15803d',
      fontWeight: '500',
   },
   websiteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#eff6ff',
      borderRadius: 8,
   },
   websiteIcon: {
      color: '#2563eb',
      marginRight: 8,
   },
   websiteText: {
      color: '#1d4ed8',
      fontWeight: '500',
   },
   actionContainer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
   },
   directionsButton: {
      backgroundColor: '#3b82f6',
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
   },
   directionsText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 18,
   },
})