'use client'
import FilterButtons from '@/components/common/FilterButtons'
import RestaurantDetailModal from '@/components/common/RestaurantDetailModal'
import RestaurantSearchBar from '@/components/common/SearchBar'
import CustomMarker from '@/components/map/CustomMapMarker'
import MapFABGroup from '@/components/map/MapFABGroup'
import MapSideMenu from '@/components/map/MapSideMenu'
import RoutePlanningPanel from '@/components/map/RoutePlanningPanel'
import RouteProfileSelector from '@/components/map/RouteProfileSelector'
import { getDefaultAvatar } from '@/constants/defaultImages'
import { useAuth } from '@/context/AuthProvider'
import { MapProvider } from '@/services/MapProvider'
import { userService } from '@/services/UserService'
import type { MapRegion, Restaurant } from '@/type/location'
import { GoongService, debounce, type GoongAutocompletePrediction } from '@/services/GoongService'
import type { Suggestion as SearchBarSuggestion } from '@/components/common/SearchBar'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import MapView, { Polyline } from 'react-native-maps'

interface RouteStop {
  restaurant: Restaurant
  distance?: number
  duration?: number
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
  const { user } = useAuth()
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
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
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([])
  const [showProfileSelector, setShowProfileSelector] = useState(false)
  const mapRef = useRef<MapView>(null)

  // New states for search bar and menu
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [menuVisible, setMenuVisible] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  
  // Autocomplete states
  const [suggestions, setSuggestions] = useState<SearchBarSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // FAB Group state
  const [fabExpanded, setFabExpanded] = useState(false)

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
        const directions = await MapProvider.getDirections(origin, destination, selectedProfile)
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

  // Function xử lý navigation từ RestaurantDetailModal
  const handleNavigateToRestaurant = (restaurant: Restaurant) => {
    // Bật route planning mode
    setRoutePlanningMode(true)
    setShowProfileSelector(true)
    
    // Thêm nhà hàng vào route
    const newStops = [{ restaurant }]
    setRouteStops(newStops)
    calculateRouteForStops(newStops)
    
    // Di chuyển map đến vị trí nhà hàng
    setMapRegion({
      latitude: restaurant.lat,
      longitude: restaurant.lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  }

  // Load user avatar from API
  const loadUserAvatar = useCallback(async () => {
    try {
      const userInfo = await userService.getUserInformation()
      if (userInfo.avatarUrl) {
        setUserAvatar(userInfo.avatarUrl)
      } else if (user) {
        // Fallback to default avatar from AuthProvider
        setUserAvatar(user.avatar || getDefaultAvatar(user.name, user.email))
      }
    } catch (error) {
      console.log('Could not load user avatar, using fallback:', error)
      if (user) {
        setUserAvatar(user.avatar || getDefaultAvatar(user.name, user.email))
      }
    }
  }, [user])

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
        const data = await MapProvider.fetchRestaurants(latitude, longitude, 10000)
        setRestaurants(data)
      } catch {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu hoặc vị trí')
      }
    }
    fetchInitialData()
    loadUserAvatar()
  }, [loadUserAvatar])

  useEffect(() => {
    if (routeStops.length > 0) {
      calculateRouteForStops(routeStops)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfile])

  const getResponsiveStrokeWidth = () => {
    const zoom = mapRegion.latitudeDelta
    if (zoom < 0.01) return 8
    if (zoom < 0.03) return 6
    if (zoom < 0.08) return 4
    return 2
  }

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

  const handleRemoveStop = (index: number) => {
    const updatedStops = [...routeStops]
    updatedStops.splice(index, 1)
    setRouteStops(updatedStops)
    calculateRouteForStops(updatedStops)
  }

  // Debounced autocomplete function
  const debouncedAutocomplete = useRef(
    debounce(async (query: string) => {
      if (!query || query.trim().length < 2) {
        setSuggestions([])
        setIsSearching(false)
        return
      }

      try {
        setIsSearching(true)
        const location = userLocation
          ? {
              lat: userLocation.coords.latitude,
              lng: userLocation.coords.longitude,
            }
          : undefined

        const response = await GoongService.autocomplete(query, location, 10000)
        setSuggestions(response.predictions || [])
      } catch (error) {
        console.error('Autocomplete error:', error)
        setSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }, 400),
  ).current

  // Handler functions for search bar and menu
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    debouncedAutocomplete(query)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSuggestions([])
    setIsSearching(false)
  }

  // Handle suggestion selection
  const handleSelectSuggestion = async (suggestion: SearchBarSuggestion) => {
    try {
      const placeDetail = await GoongService.getPlaceDetail(suggestion.place_id)
      if (!placeDetail || !placeDetail.geometry) {
        Alert.alert('Lỗi', 'Không thể lấy thông tin địa điểm')
        return
      }

      const { lat, lng } = placeDetail.geometry.location

      // Di chuyển map đến vị trí được chọn
      setMapRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })

      // Animate map to location
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500,
        )
      }

      // Fetch restaurants near the selected location
      const nearbyRestaurants = await MapProvider.fetchRestaurants(lat, lng, 10000)
      setRestaurants(nearbyRestaurants)

      // Clear search
      setSearchQuery('')
      setSuggestions([])
    } catch (error) {
      console.error('Error getting place detail:', error)
      Alert.alert('Lỗi', 'Không thể lấy thông tin địa điểm')
    }
  }

  const handleMenuPress = () => {
    setMenuVisible(true)
  }

  const handleAvatarPress = () => {
    router.push('/(tabs)/profile')
  }

  const handleMicPress = () => {
    // Microphone is UI only, no functionality
    Alert.alert('Voice Search', 'Tính năng tìm kiếm bằng giọng nói sắp ra mắt!')
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter)
    // TODO: Implement filter logic for restaurants
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
      >
        {/* Restaurant markers */}
        {(restaurants || []).map((restaurant) => (
          <CustomMarker
            key={restaurant.id}
            restaurant={restaurant}
            onPress={handleMarkerPress}
            isSelected={routeStops.some((stop) => stop.restaurant.id === restaurant.id)}
          />
        ))}

        {/* Route polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#4285F4"
            strokeWidth={getResponsiveStrokeWidth()}
          />
        )}
      </MapView>

      {/* Search Bar - Google Maps Style */}
      <RestaurantSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onMenuPress={handleMenuPress}
        onAvatarPress={handleAvatarPress}
        onMicPress={handleMicPress}
        avatarUrl={userAvatar}
        suggestions={suggestions}
        onSelectSuggestion={handleSelectSuggestion}
        loading={isSearching}
      />

      {/* Filter Buttons */}
      <FilterButtons
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Side Menu */}
      <MapSideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigateToSavedPlaces={() => {
          Alert.alert('Saved Places', 'Tính năng địa điểm đã lưu sắp ra mắt!')
        }}
        onNavigateToMyPlaces={() => {
          Alert.alert('My Places', 'Tính năng quán đã tạo sắp ra mắt!')
        }}
        onNavigateToHistory={() => {
          Alert.alert('History', 'Tính năng lịch sử sắp ra mắt!')
        }}
      />

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

      {/* FAB Group - My Location & Layers */}
      <MapFABGroup
        onMyLocationPress={handleMyLocation}
        onLayersPress={() => {
          // TODO: Implement map layers (satellite, terrain, traffic)
          Alert.alert('Layers', 'Chọn loại bản đồ')
        }}
        expanded={fabExpanded}
        onToggle={() => setFabExpanded(!fabExpanded)}
      />

      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setSelectedRestaurant(null)
        }}
        onNavigateToRestaurant={handleNavigateToRestaurant}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  
  // Route planning buttons (keep existing)
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
})