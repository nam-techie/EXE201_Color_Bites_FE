'use client'

import { mockMapLocations } from '@/data/mockData'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import {
   Alert,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'

interface LocationData {
   latitude: number
   longitude: number
   latitudeDelta: number
   longitudeDelta: number
}

export default function MapScreen() {
   const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
   const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
   const [locationPermission, setLocationPermission] = useState(false)
   const [locationReady, setLocationReady] = useState(false)
   const [currentLocation, setCurrentLocation] = useState<LocationData>({
      latitude: 10.8231, // fallback default: HCM
      longitude: 106.6297,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
   })

   useEffect(() => {
      getCurrentLocation()
   }, [])

   const getCurrentLocation = async () => {
      try {
         const { status } = await Location.requestForegroundPermissionsAsync()
         if (status !== 'granted') {
            Alert.alert(
               'Permission Denied',
               'Location permission is required to show your current location',
            )
            return
         }

         setLocationPermission(true)
         const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
         })

         setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
         })
         setLocationReady(true)
      } catch (error) {
         console.error('Error getting location:', error)
         Alert.alert('Error', 'Could not get your current location')
      }
   }

   const handleMarkerPress = (locationId: string) => {
      setSelectedLocation(locationId)
   }

   const selectedLocationData = mockMapLocations.find((loc) => loc.id === selectedLocation)

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <View style={styles.headerContent}>
               <Text style={styles.headerTitle}>Food Journey Map</Text>
               <View style={styles.headerActions}>
                  <TouchableOpacity style={styles.filterButton}>
                     <Ionicons name="filter-outline" size={16} color="#6B7280" />
                     <Text style={styles.filterButtonText}>Filter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareButton}>
                     <Ionicons name="share-outline" size={16} color="#6B7280" />
                  </TouchableOpacity>
               </View>
            </View>
         </View>

         {/* View Mode Toggle */}
         <View style={styles.toggleContainer}>
            <View style={styles.toggleButtons}>
               <TouchableOpacity
                  onPress={() => setViewMode('map')}
                  style={[styles.toggleButton, viewMode === 'map' && styles.activeToggleButton]}
               >
                  <Text
                     style={[
                        styles.toggleButtonText,
                        viewMode === 'map' && styles.activeToggleButtonText,
                     ]}
                  >
                     Map View
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  onPress={() => setViewMode('list')}
                  style={[styles.toggleButton, viewMode === 'list' && styles.activeToggleButton]}
               >
                  <Text
                     style={[
                        styles.toggleButtonText,
                        viewMode === 'list' && styles.activeToggleButtonText,
                     ]}
                  >
                     List View
                  </Text>
               </TouchableOpacity>
            </View>
         </View>

         {/* Main Content */}
         {viewMode === 'map' ? (
            <View style={styles.mapContainer}>
               {locationReady ? (
                  <MapView
                     style={styles.map}
                     provider={PROVIDER_DEFAULT}
                     initialRegion={currentLocation}
                     showsUserLocation={locationPermission}
                     showsMyLocationButton
                     onPress={() => setSelectedLocation(null)}
                     mapType="standard"
                  >
                     {/* Markers */}
                     {mockMapLocations.map((location) => (
                        <Marker
                           key={location.id}
                           coordinate={{
                              latitude: location.latitude,
                              longitude: location.longitude,
                           }}
                           onPress={() => handleMarkerPress(location.id)}
                        >
                           <View style={styles.markerContainer}>
                              <View style={styles.marker}>
                                 <Ionicons name="restaurant" size={20} color="white" />
                                 <View style={styles.markerBadge}>
                                    <Text style={styles.markerBadgeText}>{location.posts}</Text>
                                 </View>
                              </View>
                           </View>
                        </Marker>
                     ))}
                  </MapView>
               ) : (
                  <View style={styles.loadingContainer}>
                     <Text style={styles.loadingText}>Loading map...</Text>
                  </View>
               )}

               {/* Location Info */}
               {selectedLocationData && (
                  <View style={styles.locationInfoContainer}>
                     <View style={styles.locationInfo}>
                        <TouchableOpacity
                           style={styles.closeButton}
                           onPress={() => setSelectedLocation(null)}
                        >
                           <Ionicons name="close" size={20} color="#6b7280" />
                        </TouchableOpacity>
                        <View style={styles.locationContent}>
                           <View style={styles.locationDetails}>
                              <Text style={styles.locationName}>{selectedLocationData.name}</Text>
                              <Text style={styles.locationAddress}>
                                 {selectedLocationData.address}
                              </Text>
                              <View style={styles.locationMeta}>
                                 <View style={styles.postsCount}>
                                    <Text style={styles.postsCountText}>
                                       {selectedLocationData.posts} posts
                                    </Text>
                                 </View>
                                 <View style={styles.rating}>
                                    <Ionicons name="star" size={16} color="#FCD34D" />
                                    <Text style={styles.ratingText}>
                                       {selectedLocationData.rating}
                                    </Text>
                                 </View>
                              </View>
                              <Text style={styles.locationDescription}>
                                 {selectedLocationData.description}
                              </Text>
                              <View style={styles.actionButtons}>
                                 <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="navigate" size={16} color="#f97316" />
                                    <Text style={styles.actionButtonText}>Directions</Text>
                                 </TouchableOpacity>
                                 <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="call" size={16} color="#f97316" />
                                    <Text style={styles.actionButtonText}>Call</Text>
                                 </TouchableOpacity>
                                 <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name="bookmark-outline" size={16} color="#f97316" />
                                    <Text style={styles.actionButtonText}>Save</Text>
                                 </TouchableOpacity>
                              </View>
                           </View>
                           <Image
                              source={{ uri: selectedLocationData.image }}
                              style={styles.locationImage}
                              contentFit="cover"
                           />
                        </View>
                     </View>
                  </View>
               )}

               {/* Map Controls */}
               <View style={styles.mapControls}>
                  <TouchableOpacity style={styles.locateButton} onPress={getCurrentLocation}>
                     <Ionicons name="locate-outline" size={24} color="#f97316" />
                  </TouchableOpacity>
               </View>
            </View>
         ) : (
            <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
               {/* List view */}
               {mockMapLocations.map((location) => (
                  <TouchableOpacity
                     key={location.id}
                     onPress={() => setSelectedLocation(location.id)}
                     style={styles.listItem}
                  >
                     <Image
                        source={{ uri: location.image }}
                        style={styles.listItemImage}
                        contentFit="cover"
                     />
                     <View style={styles.listItemContent}>
                        <Text style={styles.listItemName}>{location.name}</Text>
                        <Text style={styles.listItemAddress}>{location.address}</Text>
                        <View style={styles.listItemMeta}>
                           <View style={styles.listItemPosts}>
                              <Text style={styles.listItemPostsText}>{location.posts} posts</Text>
                           </View>
                           <View style={styles.listItemRating}>
                              <Ionicons name="star" size={16} color="#FCD34D" />
                              <Text style={styles.listItemRatingText}>{location.rating}</Text>
                           </View>
                        </View>
                        <Text style={styles.listItemDescription}>{location.description}</Text>
                     </View>
                  </TouchableOpacity>
               ))}
            </ScrollView>
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
      alignItems: 'center',
   },
   filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginRight: 8,
   },
   filterButtonText: {
      marginLeft: 4,
      fontSize: 14,
      color: '#4B5563',
   },
   shareButton: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: 8,
   },
   toggleContainer: {
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
   },
   toggleButtons: {
      flexDirection: 'row',
   },
   toggleButton: {
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: '#F3F4F6',
      marginRight: 8,
   },
   activeToggleButton: {
      backgroundColor: '#F97316',
   },
   toggleButtonText: {
      fontSize: 14,
      color: '#4B5563',
   },
   activeToggleButtonText: {
      color: '#FFFFFF',
   },
   mapContainer: {
      position: 'relative',
      flex: 1,
   },
   map: {
      flex: 1,
   },
   loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   loadingText: {
      color: '#6B7280',
   },
   markerContainer: {
      alignItems: 'center',
   },
   marker: {
      position: 'relative',
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      backgroundColor: '#F97316',
      padding: 8,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
   },
   markerBadge: {
      position: 'absolute',
      right: -4,
      top: -4,
      height: 20,
      minWidth: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#FFFFFF',
      backgroundColor: '#EF4444',
   },
   markerBadgeText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#FFFFFF',
   },
   locationInfoContainer: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      right: 16,
   },
   locationInfo: {
      position: 'relative',
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
   },
   closeButton: {
      position: 'absolute',
      right: 12,
      top: 12,
      zIndex: 10,
      padding: 4,
   },
   locationContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
   },
   locationDetails: {
      flex: 1,
      paddingRight: 12,
   },
   locationName: {
      marginBottom: 4,
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
   },
   locationAddress: {
      marginBottom: 8,
      fontSize: 14,
      color: '#4B5563',
   },
   locationMeta: {
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
   },
   postsCount: {
      borderRadius: 4,
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 8,
   },
   postsCountText: {
      fontSize: 12,
      color: '#111827',
   },
   rating: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   ratingText: {
      marginLeft: 4,
      fontSize: 14,
      color: '#111827',
   },
   locationDescription: {
      marginBottom: 12,
      fontSize: 14,
      color: '#374151',
   },
   actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
   },
   actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FED7AA',
      backgroundColor: '#FFF7ED',
      paddingHorizontal: 12,
      paddingVertical: 8,
   },
   actionButtonText: {
      marginLeft: 4,
      fontSize: 12,
      fontWeight: '500',
      color: '#EA580C',
   },
   locationImage: {
      height: 80,
      width: 80,
      borderRadius: 8,
   },
   mapControls: {
      position: 'absolute',
      right: 16,
      top: 16,
   },
   locateButton: {
      marginBottom: 8,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
   },
   listContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
   },
   listContent: {
      paddingHorizontal: 16,
      paddingVertical: 8,
   },
   listItem: {
      marginBottom: 16,
      flexDirection: 'row',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#F9FAFB',
      padding: 12,
   },
   listItemImage: {
      height: 96,
      width: 96,
      borderRadius: 8,
   },
   listItemContent: {
      flex: 1,
      paddingHorizontal: 12,
   },
   listItemName: {
      marginBottom: 4,
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
   },
   listItemAddress: {
      marginBottom: 8,
      fontSize: 14,
      color: '#4B5563',
   },
   listItemMeta: {
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
   },
   listItemPosts: {
      borderRadius: 4,
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 8,
   },
   listItemPostsText: {
      fontSize: 12,
      color: '#111827',
   },
   listItemRating: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   listItemRatingText: {
      marginLeft: 4,
      fontSize: 14,
      color: '#111827',
   },
   listItemDescription: {
      fontSize: 14,
      color: '#374151',
   },
})
