'use client'
import FilterButtons from '@/components/common/FilterButtons'
import RestaurantDetailModal from '@/components/common/RestaurantDetailModal'
import RestaurantSearchBar from '@/components/common/SearchBar'
import CustomMarker from '@/components/map/CustomMapMarker'
import RouteProfileSelector from '@/components/map/RouteProfileSelector'
import { getDirections } from '@/services/DirectionService'
import { fetchRestaurantsNearby } from '@/services/MapService'
import type { MapRegion, Restaurant } from '@/type/location'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useEffect, useMemo, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'

interface RouteStop {
   restaurant: Restaurant
}

export default function MapScreen() {
   const [restaurants, setRestaurants] = useState<Restaurant[]>([])
   const [loading, setLoading] = useState(true)
   const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
   const [modalVisible, setModalVisible] = useState(false)
   const [searchQuery, setSearchQuery] = useState('')
   const [selectedFilter, setSelectedFilter] = useState('all')
   const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null)
   const [mapRegion, setMapRegion] = useState<MapRegion>({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
   })

   const [routePlanningMode, setRoutePlanningMode] = useState(false)
   const [selectedProfile, setSelectedProfile] = useState('cycling-regular')
   const [routeStops, setRouteStops] = useState<RouteStop[]>([])
   const [routeCoordinates, setRouteCoordinates] = useState<
      { latitude: number; longitude: number }[]
   >([])
   const [showProfileSelector, setShowProfileSelector] = useState(false)

   const getCurrentUserLocation = async (): Promise<Location.LocationObject | null> => {
      try {
         const { status } = await Location.requestForegroundPermissionsAsync()
         if (status !== 'granted') {
            Alert.alert('Thông báo', 'Cần quyền truy cập vị trí để hiển thị vị trí hiện tại')
            return null
         }
         const location = await Location.getCurrentPositionAsync({})
         return location
      } catch (error) {
         console.log('Lỗi khi lấy vị trí:', error)
         return null
      }
   }

   const calculateRouteForStops = async (stops: RouteStop[]) => {
      if (stops.length < 2 || !userLocation) return

      const allCoordinates: { latitude: number; longitude: number }[] = []

      for (let i = 0; i < stops.length; i++) {
         const origin =
            i === 0
               ? { lat: userLocation.coords.latitude, lon: userLocation.coords.longitude }
               : { lat: stops[i - 1].restaurant.lat, lon: stops[i - 1].restaurant.lon }

         const destination = { lat: stops[i].restaurant.lat, lon: stops[i].restaurant.lon }

         try {
            const directions = await getDirections(origin, destination, selectedProfile)
            if (!directions || !directions.geometry) continue

            const routeCoords = directions.geometry.map(([lon, lat]) => ({
               latitude: lat,
               longitude: lon,
            }))

            if (routeCoords.length > 0) allCoordinates.push(...routeCoords)
         } catch (error) {
            console.error('Lỗi khi lấy route:', error)
         }
      }

      setRouteCoordinates(allCoordinates)
   }

   useEffect(() => {
      const fetchInitialData = async () => {
         try {
            const location = await getCurrentUserLocation()
            if (!location) return
            setUserLocation(location)
            const { latitude, longitude } = location.coords
            setMapRegion({
               latitude,
               longitude,
               latitudeDelta: 0.05,
               longitudeDelta: 0.05,
            })
            const data = await fetchRestaurantsNearby(latitude, longitude)
            setRestaurants(data)
         } catch (error) {
            Alert.alert('Lỗi', 'Không thể tải dữ liệu hoặc vị trí')
         } finally {
            setLoading(false)
         }
      }
      fetchInitialData()
   }, [])

   useEffect(() => {
      if (routeStops.length > 0) {
         calculateRouteForStops(routeStops)
      }
   }, [selectedProfile])

   const getResponsiveStrokeWidth = () => {
      const zoom = mapRegion.latitudeDelta
      if (zoom < 0.01) return 8
      if (zoom < 0.03) return 6
      if (zoom < 0.08) return 4
      return 2
   }

   const filteredRestaurants = useMemo(() => {
      let filtered = restaurants
      if (searchQuery.trim()) {
         filtered = filtered.filter(
            (restaurant) =>
               restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (restaurant.tags.cuisine &&
                  restaurant.tags.cuisine.toLowerCase().includes(searchQuery.toLowerCase())),
         )
      }
      if (selectedFilter !== 'all') {
         if (selectedFilter === 'vegetarian') {
            filtered = filtered.filter(
               (restaurant) =>
                  restaurant.tags['diet:vegetarian'] === 'yes' ||
                  restaurant.tags['diet:vegetarian'] === 'only' ||
                  restaurant.tags['diet:vegan'] === 'yes' ||
                  restaurant.tags['diet:vegan'] === 'only',
            )
         } else {
            filtered = filtered.filter(
               (restaurant) =>
                  restaurant.tags.cuisine && restaurant.tags.cuisine.includes(selectedFilter),
            )
         }
      }
      return filtered
   }, [restaurants, searchQuery, selectedFilter])

   const handleMarkerPress = (restaurant: Restaurant) => {
      if (routePlanningMode) {
         const isAlreadyAdded = routeStops.some((stop) => stop.restaurant.id === restaurant.id)
         if (!isAlreadyAdded) {
            const newStops = [...routeStops, { restaurant }]
            setRouteStops(newStops)
            calculateRouteForStops(newStops)
         }
      } else {
         setSelectedRestaurant(restaurant)
         setModalVisible(true)
      }
   }

   const handleMyLocation = async () => {
      const location = await getCurrentUserLocation()
      if (location) {
         setUserLocation(location)
         const { latitude, longitude } = location.coords
         setMapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
         })
      }
   }

   const toggleRoutePlanning = () => {
      setRoutePlanningMode(!routePlanningMode)
      setShowProfileSelector(!routePlanningMode)
      if (routePlanningMode) {
         setRouteStops([])
         setRouteCoordinates([])
      }
   }

   return (
      <View style={styles.container}>
         <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
         >
            {filteredRestaurants.map((restaurant) => (
               <CustomMarker
                  key={restaurant.id}
                  restaurant={restaurant}
                  onPress={handleMarkerPress}
                  isSelected={routeStops.some((stop) => stop.restaurant.id === restaurant.id)}
               />
            ))}

            {routeCoordinates.length > 0 && (
               <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#3B82F6"
                  strokeWidth={getResponsiveStrokeWidth()}
               />
            )}
         </MapView>

         <RestaurantSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
         />

         <FilterButtons selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />

         <RouteProfileSelector
            selectedProfile={selectedProfile}
            onProfileChange={setSelectedProfile}
            visible={showProfileSelector}
         />

         <TouchableOpacity
            onPress={toggleRoutePlanning}
            style={[
               styles.routePlanningButton,
               routePlanningMode && styles.routePlanningButtonActive,
            ]}
         >
            <Ionicons
               name={routePlanningMode ? 'close' : 'map'}
               size={24}
               color={routePlanningMode ? '#EF4444' : 'white'}
            />
         </TouchableOpacity>

         {routePlanningMode && (
            <TouchableOpacity
               onPress={() => setShowProfileSelector(!showProfileSelector)}
               style={styles.profileSelectorButton}
            >
               <Ionicons name="options" size={24} color="white" />
            </TouchableOpacity>
         )}

         <TouchableOpacity onPress={handleMyLocation} style={styles.locationButton}>
            <Ionicons name="location-sharp" size={24} color="white" />
         </TouchableOpacity>

         {!routePlanningMode && (
            <View style={styles.counterContainer}>
               <Text style={styles.counterText}>
                  {filteredRestaurants.length} nhà hàng được tìm thấy
               </Text>
            </View>
         )}

         <RestaurantDetailModal
            restaurant={selectedRestaurant}
            visible={modalVisible}
            onClose={() => {
               setModalVisible(false)
               setSelectedRestaurant(null)
            }}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   map: { flex: 1 },
   routePlanningButton: {
      position: 'absolute',
      bottom: 140,
      right: 16,
      width: 48,
      height: 48,
      backgroundColor: '#3B82F6',
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
   },
   routePlanningButtonActive: {
      backgroundColor: '#FEE2E2',
   },
   profileSelectorButton: {
      position: 'absolute',
      bottom: 200,
      right: 16,
      width: 48,
      height: 48,
      backgroundColor: '#10B981',
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
   },
   locationButton: {
      position: 'absolute',
      bottom: 80,
      right: 16,
      width: 48,
      height: 48,
      backgroundColor: '#3B82F6',
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
   },
   counterContainer: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      backgroundColor: '#ffffff',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
   },
   counterText: {
      color: '#374151',
      fontWeight: '500',
   },
})
