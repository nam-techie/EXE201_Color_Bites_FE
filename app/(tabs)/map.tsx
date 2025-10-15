'use client'
import FilterButtons from '@/components/common/FilterButtons'
import RestaurantDetailModal from '@/components/common/RestaurantDetailModal'
import RestaurantSearchBar from '@/components/common/SearchBar'
import CustomMarker from '@/components/map/CustomMapMarker'
import MapSideMenu from '@/components/map/MapSideMenu'
import RoutePlanningPanel from '@/components/map/RoutePlanningPanel'
import RouteProfileSelector from '@/components/map/RouteProfileSelector'
import { getDefaultAvatar } from '@/constants/defaultImages'
import { useAuth } from '@/context/AuthProvider'
import { MapProvider } from '@/services/MapProvider'
import { userService } from '@/services/UserService'
import type { MapRegion, Restaurant } from '@/type/location'
import { Ionicons } from '@expo/vector-icons'
import MapLibreGL from '@maplibre/maplibre-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  GestureResponderEvent,
  Modal,
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

// Định nghĩa 5 map styles với validation
const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY

const MAP_STYLES = [
  { id: 'streets', name: 'Đường phố', url: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}` },
  { id: 'bright', name: 'Sáng', url: `https://api.maptiler.com/maps/bright/style.json?key=${MAPTILER_KEY}` },
  { id: 'outdoor', name: 'Ngoài trời', url: `https://api.maptiler.com/maps/outdoor/style.json?key=${MAPTILER_KEY}` },
  { id: 'satellite', name: 'Vệ tinh', url: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}` },
  { id: 'basic', name: 'Cơ bản', url: `https://api.maptiler.com/maps/basic/style.json?key=${MAPTILER_KEY}` },
]

// Validate API key
if (!MAPTILER_KEY || MAPTILER_KEY === 'YOUR_ACTUAL_KEY_HERE') {
  console.error('❌ MapTiler API key is missing or not configured!')
  console.error('Please add EXPO_PUBLIC_MAPTILER_KEY to your .env file')
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
  const mapRef = useRef<any>(null)

  // New states for search bar and menu
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [menuVisible, setMenuVisible] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  
  // Map style states
  const [selectedMapStyle, setSelectedMapStyle] = useState('streets')
  const [mapStyleModalVisible, setMapStyleModalVisible] = useState(false)

  const panelY = useRef(new Animated.Value(0)).current
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        return Math.abs(gestureState.dy) > 10
      },
    onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const newY = Math.max(0, gestureState.dy)
        panelY.setValue(newY)
      },
    onPanResponderRelease: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
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

  // Load saved map style preference
  useEffect(() => {
    const loadMapStylePreference = async () => {
      try {
        const savedStyle = await AsyncStorage.getItem('selectedMapStyle')
        if (savedStyle) {
          setSelectedMapStyle(savedStyle)
        }
      } catch (error) {
        console.log('Error loading map style preference:', error)
      }
    }
    loadMapStylePreference()
  }, [])

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
        const data = await MapProvider.fetchRestaurants(latitude, longitude)
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

  // Handler functions for search bar and menu
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    // TODO: Implement search functionality with backend API
    // This will search both restaurants and places
  }

  const handleClearSearch = () => {
    setSearchQuery('')
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

  // Map style selection handlers
  const handleMapStyleSelect = async (styleId: string) => {
    setSelectedMapStyle(styleId)
    setMapStyleModalVisible(false)
    
    // Save preference to AsyncStorage
    try {
      await AsyncStorage.setItem('selectedMapStyle', styleId)
    } catch (error) {
      console.log('Error saving map style preference:', error)
    }
  }

  // Error boundary for MapLibre
  const [mapError, setMapError] = useState<string | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  if (mapError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red', textAlign: 'center', margin: 20 }}>
          Map Error: {mapError}
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 5, marginTop: 10 }}
          onPress={() => setMapError(null)}
        >
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MAP_STYLES.find(style => style.id === selectedMapStyle)?.url || MAP_STYLES[0].url}
        onDidFinishLoadingMap={() => {
          console.log('Map loaded successfully')
          setIsMapReady(true)
        }}
        onDidFailLoadingMap={(error: any) => {
          console.error('Map failed to load:', error)
          setMapError('Failed to load map. Please check your API key and internet connection.')
        }}
        onRegionDidChange={async () => {
          try {
            // Note: MapLibreGL doesn't have Mapbox.getCenter, using alternative approach
            // This is a simplified version - you might need to adjust based on your needs
          } catch {
            // ignore
          }
        }}
      >
        <MapLibreGL.Camera
          centerCoordinate={[mapRegion.longitude, mapRegion.latitude]}
          zoomLevel={13}
        />

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
          <MapLibreGL.ShapeSource
            id="route"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates.map((p) => [p.longitude, p.latitude]),
              },
              properties: {},
            }}
          >
            <MapLibreGL.LineLayer
              id="routeLine"
              style={{ lineColor: '#4285F4', lineWidth: getResponsiveStrokeWidth() }}
            />
          </MapLibreGL.ShapeSource>
        )}
      </MapLibreGL.MapView>

      {/* Search Bar - Google Maps Style */}
      <RestaurantSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onMenuPress={handleMenuPress}
        onAvatarPress={handleAvatarPress}
        onMicPress={handleMicPress}
        avatarUrl={userAvatar}
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

      {/* My Location Button - Google Maps style */}
      <TouchableOpacity
        onPress={handleMyLocation}
        style={styles.myLocationButton}
      >
        <Ionicons name="locate" size={24} color="#5F6368" />
      </TouchableOpacity>

      {/* Layers Button - bottom right */}
      <TouchableOpacity
        style={styles.layersButton}
        onPress={() => setMapStyleModalVisible(true)}
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

      {/* Map Style Selection Modal */}
      <Modal
        visible={mapStyleModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMapStyleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn loại bản đồ</Text>
              <TouchableOpacity
                onPress={() => setMapStyleModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapStyleList}>
              {MAP_STYLES.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  style={[
                    styles.mapStyleItem,
                    selectedMapStyle === style.id && styles.mapStyleItemSelected
                  ]}
                  onPress={() => handleMapStyleSelect(style.id)}
                >
                  <View style={styles.mapStyleInfo}>
                    <Text style={[
                      styles.mapStyleName,
                      selectedMapStyle === style.id && styles.mapStyleNameSelected
                    ]}>
                      {style.name}
                    </Text>
                  </View>
                  {selectedMapStyle === style.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  mapStyleList: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  mapStyleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  mapStyleItemSelected: {
    backgroundColor: '#EBF4FF',
  },
  mapStyleInfo: {
    flex: 1,
  },
  mapStyleName: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  mapStyleNameSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
})