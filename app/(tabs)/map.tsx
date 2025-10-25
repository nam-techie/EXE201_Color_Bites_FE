'use client'
// Removed FilterButtons - no longer needed
import RestaurantDetailModal from '@/components/common/RestaurantDetailModal'
import RestaurantSearchBar from '@/components/common/SearchBar'
import MapLibreView from '@/components/map/MapLibreView'
import MapSideMenu from '@/components/map/MapSideMenu'
import RoutePlanningPanel from '@/components/map/RoutePlanningPanel'
import RouteProfileSelector from '@/components/map/RouteProfileSelector'
import { GOONG_API_KEY } from '@/constants'
import { getDefaultAvatar } from '@/constants/defaultImages'
import { useAuth } from '@/context/AuthProvider'
import { buildGoongStyleDataUrl, type GoongStyleId } from '@/services/goong-style'
// MapLibre configuration is handled in services/GoongMapConfig.ts
import { GoongService, debounce } from '@/services/GoongService'
import { MapProvider } from '@/services/MapProvider'
import { userService } from '@/services/UserService'
import type { Restaurant } from '@/type/location'
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
  Text,
  TouchableOpacity,
  View
} from 'react-native'

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
  const [routePlanningMode, setRoutePlanningMode] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState('car')
  const [routeStops, setRouteStops] = useState<RouteStop[]>([])
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([])
  const [showProfileSelector, setShowProfileSelector] = useState(false)
  const [styleURL, setStyleURL] = useState<string | undefined>()

  // New states for search bar and menu
  const [searchQuery, setSearchQuery] = useState('')
  const [menuVisible, setMenuVisible] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<{ place_id: string; description: string }[]>([])
  const [currentStyle, setCurrentStyle] = useState<GoongStyleId>('web')

  // Race condition protection for search
  const reqId = useRef(0)
  const latestQueryRef = useRef('')

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
      
      // Reverse geocoding to get address
      try {
        const addressData = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
        
        const address = addressData[0]
          ? `${addressData[0].name || ''} ${addressData[0].street || ''}, ${addressData[0].city || ''}`.trim()
          : null
        
        setCurrentAddress(address)
        console.log('Current address:', address)
      } catch (geocodingError) {
        console.log('Geocoding error:', geocodingError)
        setCurrentAddress(null)
      }
      
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

        const routeCoords = directions.geometry.map((coord: number[]) => ({
          latitude: coord[1],
          longitude: coord[0],
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
    
    // Di chuyển map đến vị trí nhà hàng - handled by MapLibreView
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
    // Load style URL when currentStyle changes
    let mounted = true
    buildGoongStyleDataUrl(currentStyle)
      .then(url => mounted && setStyleURL(url))
      .catch(e => console.warn('[MAP DEBUG] Load style error:', e))
    return () => { mounted = false }
  }, [currentStyle])

  useEffect(() => {
    // Debug API keys
    console.log('[MAP DEBUG] API Keys Status:')
    console.log('[MAP DEBUG] GOONG_API_KEY:', GOONG_API_KEY ? 'configured' : 'missing')

    const fetchInitialData = async () => {
      try {
        const location = await getCurrentUserLocation()
        if (!location) return
        setUserLocation(location)
        // Camera movement handled by MapLibreView
        const data = await MapProvider.fetchRestaurants(location.coords.latitude, location.coords.longitude)
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

  // Remove unused function
  // const getResponsiveStrokeWidth = () => {
  //   const zoom = mapRegion.latitudeDelta
  //   if (zoom < 0.01) return 8
  //   if (zoom < 0.03) return 6
  //   if (zoom < 0.08) return 4
  //   return 2
  // }

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
      // Camera movement handled by MapLibreView
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

  // Handler functions for search bar và menu
  // Debounce chỉ phần gọi API; cập nhật text hiển thị ngay lập tức
  const autocompleteFunction = async (query: string) => {
    if (query.trim().length < 3) {
      setSuggestions([])
      return
    }

    const thisReq = ++reqId.current
    latestQueryRef.current = query

    try {
      const result = await GoongService.autocomplete(query)
      
      // CHỈ nhận kết quả của request MỚI NHẤT
      if (thisReq === reqId.current && latestQueryRef.current === query) {
        if (result.predictions) {
          const mapped = result.predictions.map((pred) => ({
            place_id: pred.place_id,
            description: pred.description,
          }))
          setSuggestions(mapped)
        }
      }
    } catch (e) {
      if (thisReq === reqId.current) {
        console.log('Autocomplete error', e)
        setSuggestions([])
      }
    }
  }

  const debouncedAutocomplete = debounce(autocompleteFunction, 400)

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    debouncedAutocomplete(query)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSuggestions([])
  }

  const handleSelectSuggestion = async (item: { place_id: string; description: string }) => {
    try {
      // Fetch place detail to get accurate coordinates
      const result = await GoongService.placeDetail(item.place_id)
      setSuggestions([])
      if (result.result) {
        const place = result.result
        const restaurant: Restaurant = {
          id: Math.abs(place.place_id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)),
          name: place.name,
          lat: place.geometry.location.lat,
          lon: place.geometry.location.lng,
          tags: {
            cuisine: place.types?.[0] || 'restaurant',
            'addr:street': place.formatted_address
          }
        }
        
        // Add restaurant to map or handle selection
        console.log('Selected place:', restaurant)
        
        // Move camera to selected place - handled by MapLibreView
      }
    } catch (e) {
      console.log('Place detail error', e)
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

  // Removed filter functionality - no longer needed
  
  // Toggle map style
  const toggleMapStyle = () => {
    const styles: GoongStyleId[] = ['web', 'light', 'dark', 'satellite', 'highlight']
    const currentIndex = styles.indexOf(currentStyle)
    const nextIndex = (currentIndex + 1) % styles.length
    const newStyle = styles[nextIndex]
    setCurrentStyle(newStyle)
  }

  return (
    <View style={styles.container}>
      {styleURL ? (
        <MapLibreView 
          styleURL={styleURL}
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          onMarkerPress={handleMarkerPress}
          userLocation={userLocation ? { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude } : null}
          routeCoordinates={routeCoordinates}
        />
      ) : (
        <View style={styles.map}>
          {/* Loading placeholder while style is being fetched */}
        </View>
      )}

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
      />

      {/* Current Address Display */}
      {currentAddress && (
        <View style={styles.currentAddressContainer}>
          <Ionicons name="location" size={16} color="#3B82F6" />
          <Text style={styles.currentAddressText}>{currentAddress}</Text>
        </View>
      )}

      {/* Removed Filter Buttons - no longer needed */}

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

      {/* My Location Button - Google Maps style */}
      <TouchableOpacity
        onPress={handleMyLocation}
        style={styles.myLocationButton}
      >
        <Ionicons name="locate" size={24} color="#5F6368" />
      </TouchableOpacity>

      {/* Map Style Toggle Button - bottom right */}
      <TouchableOpacity
        style={styles.layersButton}
        onPress={toggleMapStyle}
      >
        <Ionicons name="layers" size={24} color="#5F6368" />
      </TouchableOpacity>

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
  
  // Google Maps style buttons
  myLocationButton: {
    position: 'absolute',
    bottom: 200,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  layersButton: {
    position: 'absolute',
    bottom: 140,
    right: 16,
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  
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
  
  // Current address display
  currentAddressContainer: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 10,
  },
  currentAddressText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
})