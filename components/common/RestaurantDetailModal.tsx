'use client'

import { formatOpeningHours, getCuisineIcon } from '@/services/MapService'
import { Restaurant } from '@/type/location'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
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
}

export default function RestaurantDetailModal({ restaurant, visible, onClose }: Props) {
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
      const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lon}`
      Linking.openURL(url)
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

   const renderIcon = (iconName: string, size: number, color: string) => {
      if (cuisineIcon.iconFamily === 'Ionicons') {
         return <Ionicons name={iconName as any} size={size} color={color} />
      }
      return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />
   }

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
                  <Ionicons name="close" size={20} color="#6b7280" />
               </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
               {/* Cuisine Type */}
               <View style={styles.cuisineContainer}>
                  {renderIcon(cuisineIcon.name, 28, cuisineIcon.color)}
                  <Text style={styles.cuisineText}>
                     {restaurant.tags.cuisine ? restaurant.tags.cuisine.charAt(0).toUpperCase() + restaurant.tags.cuisine.slice(1) : 'Quán ăn'}
                  </Text>
               </View>

               {/* Address */}
               <View style={styles.infoSection}>
                  <MaterialCommunityIcons name="map-marker" size={20} color="#6b7280" style={styles.infoIcon} />
                  <Text style={styles.infoText}>{getAddress()}</Text>
               </View>

               {/* Opening Hours */}
               {restaurant.tags.opening_hours && (
                  <View style={styles.infoSection}>
                     <MaterialCommunityIcons name="clock-outline" size={20} color="#6b7280" style={styles.infoIcon} />
                     <Text style={styles.infoText}>{formatOpeningHours(restaurant.tags.opening_hours)}</Text>
                  </View>
               )}

               {/* Dietary Information */}
               {getDietaryInfo() && (
                  <View style={styles.infoSection}>
                     <MaterialCommunityIcons name="leaf" size={20} color="#6b7280" style={styles.infoIcon} />
                     <Text style={styles.infoText}>{getDietaryInfo()}</Text>
                  </View>
               )}

               {/* Contact Information */}
               {(restaurant.tags.phone || restaurant.tags.website) && (
                  <View style={styles.contactSection}>
                     {restaurant.tags.phone && (
                        <TouchableOpacity onPress={handleCall} style={styles.contactButton}>
                           <MaterialCommunityIcons name="phone" size={22} color="#16a34a" style={styles.contactIcon} />
                           <Text style={styles.contactText}>{restaurant.tags.phone}</Text>
                        </TouchableOpacity>
                     )}
                     {restaurant.tags.website && (
                        <TouchableOpacity onPress={handleWebsite} style={styles.websiteButton}>
                           <MaterialCommunityIcons name="web" size={22} color="#2563eb" style={styles.websiteIcon} />
                           <Text style={styles.websiteText} numberOfLines={1}>Website</Text>
                        </TouchableOpacity>
                     )}
                  </View>
               )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
               <TouchableOpacity onPress={handleDirections} style={styles.directionsButton}>
                  <MaterialCommunityIcons name="directions" size={22} color="#ffffff" style={styles.directionsIcon} />
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
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
      backgroundColor: '#ffffff',
   },
   title: {
      fontSize: 22,
      fontWeight: '800',
      flex: 1,
      marginRight: 16,
      color: '#111827',
   },
   closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#f9fafb',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#e5e7eb',
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      padding: 20,
   },
   cuisineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#f8fafc',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#e2e8f0',
   },
   cuisineText: {
      fontSize: 18,
      color: '#374151',
      fontWeight: '600',
      marginLeft: 12,
   },
   infoSection: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 20,
      paddingVertical: 8,
   },
   infoIcon: {
      marginRight: 12,
      marginTop: 2,
   },
   infoText: {
      fontSize: 16,
      color: '#1f2937',
      flex: 1,
      lineHeight: 22,
   },
   contactSection: {
      marginBottom: 24,
   },
   contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      padding: 16,
      backgroundColor: '#f0fdf4',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#dcfce7',
   },
   contactIcon: {
      marginRight: 12,
   },
   contactText: {
      color: '#15803d',
      fontWeight: '600',
      fontSize: 16,
   },
   websiteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#eff6ff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#dbeafe',
   },
   websiteIcon: {
      marginRight: 12,
   },
   websiteText: {
      color: '#1d4ed8',
      fontWeight: '600',
      fontSize: 16,
   },
   actionContainer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
      backgroundColor: '#ffffff',
   },
   directionsButton: {
      backgroundColor: '#3b82f6',
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
   },
   directionsIcon: {
      marginRight: 8,
   },
   directionsText: {
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 18,
   },
})
