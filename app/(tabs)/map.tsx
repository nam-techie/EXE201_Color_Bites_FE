'use client'
import FilterButtons from '@/components/common/FilterButtons'
import RestaurantDetailModal from '@/components/common/RestaurantDetailModal'
import RestaurantSearchBar from '@/components/common/SearchBar'
import CustomMarker from '@/components/map/CustomMapMarker'
import RoutePlanningPanel from '@/components/map/RoutePlanningPanel'
import RouteProfileSelector from '@/components/map/RouteProfileSelector'
import { getDirections } from '@/services/DirectionService'
import { fetchRestaurantsNearby } from '@/services/MapService'
import type { MapRegion, Restaurant } from '@/type/location'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import MapView, { Polyline } from 'react-native-maps'

interface RouteStop {
  restaurant: Restaurant
  distance?: number
  duration?: number
}

// Vị trí cứng - TP.HCM
const HARDCODED_LOCATION = {
  id: 'hcm-central', // ID cho vị trí cứng
  latitude: 10.8414360,
  longitude: 106.8098568,
  name: 'Trung tâm TP.HCM', // Tên hiển thị cho vị trí
}

const ScaleButton = ({ onPress, style, iconName, iconColor }: any) => {
  const scale = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.92,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </Animated.View>
    </Pressable>
  )
}

export default function MapScreen() {
  const params = useLocalSearchParams()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null)
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: HARDCODED_LOCATION.latitude,
    longitude: HARDCODED_LOCATION.longitude,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  })
  const [routePlanningMode, setRoutePlanningMode] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState('cycling-regular')
  const [routeStops, setRouteStops] = useState<RouteStop[]>([])
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([])
  const [showProfileSelector, setShowProfileSelector] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const panelY = useRef(new Animated.Value(0)).current
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        return Math.abs(gestureState.dy) > 10
      },
      onPanResponderMove: (_evt, gestureState) => {
        const newY = Math.max(0, gestureState.dy)
        panelY.setValue(newY)
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(panelY, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
          }).start()
        } else {
          Animated.timing(panelY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  const apiTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    if (stops.length < 1 || !userLocation) return

    const newRouteStops: RouteStop[] = []
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

        const distance = directions.summary?.distance || 0
        const duration = directions.summary?.duration || 0

        newRouteStops.push({
          ...stops[i],
          distance,
          duration,
        })
      } catch (error) {
        console.error('Lỗi khi lấy route:', error)
        newRouteStops.push(stops[i])
      }
    }

    setRouteStops(newRouteStops)
    setRouteCoordinates(allCoordinates)
  }

  // Debounced API call
  const debouncedFetchRestaurants = useCallback((lat: number, lon: number, radius: number = 5000) => {
    if (apiTimeoutRef.current) {
      clearTimeout(apiTimeoutRef.current)
    }
    
    apiTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true)
        setApiError(null)
        const data = await fetchRestaurantsNearby(lat, lon, radius)
        setRestaurants(data)
      } catch (error) {
        console.error('Lỗi khi tải nhà hàng:', error)
        setApiError(error instanceof Error ? error.message : 'Lỗi không xác định')
        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }, 500) // Delay 500ms
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (apiTimeoutRef.current) {
        clearTimeout(apiTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Check if we have params from challenge navigation
        if (params.latitude && params.longitude) {
          const lat = parseFloat(params.latitude as string)
          const lon = parseFloat(params.longitude as string)
          const title = params.title as string
          const address = params.address as string
          
          // Set map region to the challenge location
          setMapRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          })
          
          // Create a mock restaurant for the challenge location
          const challengeLocation: Restaurant = {
            id: 999999, // Sử dụng ID số thay vì string
            name: title || 'Địa điểm thử thách',
            lat,
            lon,
            tags: {
              cuisine: 'challenge',
              'addr:street': address || '' // Sử dụng addr:street thay vì address
            }
          }
          
          setSelectedRestaurant(challengeLocation)
          setModalVisible(true)
          
          // Also fetch nearby restaurants
          debouncedFetchRestaurants(lat, lon)
        } else {
          // Sử dụng vị trí cứng thay vì lấy vị trí thực
          const mockLocation: Location.LocationObject = {
            coords: {
              latitude: HARDCODED_LOCATION.latitude,
              longitude: HARDCODED_LOCATION.longitude,
              altitude: null,
              accuracy: 10,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          }
          
          setUserLocation(mockLocation)
          setMapRegion({
            latitude: HARDCODED_LOCATION.latitude,
            longitude: HARDCODED_LOCATION.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          })
          
          // Fetch restaurants from hardcoded location
          debouncedFetchRestaurants(
            HARDCODED_LOCATION.latitude, 
            HARDCODED_LOCATION.longitude,
            5000 // Bán kính 5km
          )
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu hoặc vị trí')
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [params.latitude, params.longitude, params.title, params.address, debouncedFetchRestaurants]) // Thêm dependency array cụ thể

  useEffect(() => {
    if (routeStops.length > 0 && userLocation) {
      calculateRouteForStops(routeStops)
    }
  }, [selectedProfile, routeStops.length, userLocation]) // Thêm dependency array cụ thể

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
    // Luôn trở về vị trí cứng với ID
    const mockLocation: Location.LocationObject = {
      coords: {
        latitude: HARDCODED_LOCATION.latitude,
        longitude: HARDCODED_LOCATION.longitude,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    }
    
    setUserLocation(mockLocation)
    setMapRegion({
      latitude: HARDCODED_LOCATION.latitude,
      longitude: HARDCODED_LOCATION.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
    
    // Hiển thị thông báo về vị trí cứng
    Alert.alert(
      'Vị trí hiện tại',
      `Đã chuyển đến ${HARDCODED_LOCATION.name} (ID: ${HARDCODED_LOCATION.id})\nTọa độ: ${HARDCODED_LOCATION.latitude}, ${HARDCODED_LOCATION.longitude}`,
      [{ text: 'OK' }]
    )
    
    // Tải lại nhà hàng với bán kính 5km
    debouncedFetchRestaurants(
      HARDCODED_LOCATION.latitude, 
      HARDCODED_LOCATION.longitude,
      5000 // Bán kính 5km
    )
  }

  const toggleRoutePlanning = () => {
    setRoutePlanningMode(!routePlanningMode)
    setShowProfileSelector(!routePlanningMode)
    if (routePlanningMode) {
      setRouteStops([])
      setRouteCoordinates([])
    }
  }

  const handleRemoveStop = (index: number) => {
    const updatedStops = [...routeStops]
    updatedStops.splice(index, 1)
    setRouteStops(updatedStops)
    calculateRouteForStops(updatedStops)
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

        {/* Challenge Location Marker */}
        {params.latitude && params.longitude && (
          <CustomMarker
            key="challenge-location"
            restaurant={{
              id: 999999, // Sử dụng ID số
              name: params.title as string || 'Địa điểm thử thách',
              lat: parseFloat(params.latitude as string),
              lon: parseFloat(params.longitude as string),
              tags: {
                cuisine: 'challenge',
                'addr:street': params.address as string || '' // Sử dụng addr:street
              }
            }}
            onPress={handleMarkerPress}
            isSelected={false}
          />
        )}

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

      <ScaleButton
        onPress={toggleRoutePlanning}
        iconName={routePlanningMode ? 'close' : 'map'}
        iconColor={routePlanningMode ? '#EF4444' : 'white'}
        style={[styles.routePlanningButton, routePlanningMode && styles.routePlanningButtonActive]}
      />

      {routePlanningMode && (
        <>
          <ScaleButton
            onPress={() => setShowProfileSelector(!showProfileSelector)}
            iconName="options"
            iconColor="white"
            style={styles.profileSelectorButton}
          />

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                transform: [{ translateY: panelY }],
                zIndex: 20,
              },
            ]}
          >
            <RoutePlanningPanel
              routeStops={routeStops}
              onRemoveStop={handleRemoveStop}
              onClearRoute={() => {
                setRouteStops([])
                setRouteCoordinates([])
              }}
              visible={true}
              selectedProfile={selectedProfile}
            />
          </Animated.View>

          <ScaleButton
            onPress={() => {
              Animated.timing(panelY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }).start()
            }}
            iconName="chevron-up"
            iconColor="white"
            style={[styles.routePlanningButton, { bottom: 140 }]}
          />
        </>
      )}

      <ScaleButton
        onPress={handleMyLocation}
        iconName="location-sharp"
        iconColor="white"
        style={styles.locationButton}
      />

      {!routePlanningMode && (
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {loading ? 'Đang tải...' : 
             apiError ? `Lỗi: ${apiError}` :
             `${filteredRestaurants.length} nhà hàng trong bán kính 5km từ ${HARDCODED_LOCATION.name}`
            }
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
    bottom: 260,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 10,
  },
  routePlanningButtonActive: {
    backgroundColor: '#FEE2E2',
  },
  profileSelectorButton: {
    position: 'absolute',
    bottom: 320,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: '#10B981',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 10,
  },
  locationButton: {
    position: 'absolute',
    bottom: 200,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 10,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  counterText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
  },
})
