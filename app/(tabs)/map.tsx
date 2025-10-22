'use client'
import CurrentLocationButton from '@/components/map/CurrentLocationButton'
import MapboxRestaurantMarker from '@/components/map/MapboxRestaurantMarker'
import MapSearchBar from '@/components/map/MapSearchBar'
import MapStyleSelector from '@/components/map/MapStyleSelector'
import NavigationPanel from '@/components/map/NavigationPanel'
import RouteLayer from '@/components/map/RouteLayer'
import { getDefaultAvatar } from '@/constants/defaultImages'
import { useAuth } from '@/context/AuthProvider'
import type { DirectionResult } from '@/services/GoongDirectionService'
import { getMapStyleUrl, type MapStyle } from '@/services/GoongMapStyles'
import { GoongService } from '@/services/GoongService'
import { getCurrentLocation, startLocationTracking, stopLocationTracking, type LocationData } from '@/services/LocationService'
import { MapProvider } from '@/services/MapProvider'
import { userService } from '@/services/UserService'
import type { Restaurant } from '@/type/location'
import Mapbox, { Camera } from '@rnmapbox/maps'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  StyleSheet,
  View
} from 'react-native'

// Set Mapbox access token (from app.json configuration)
Mapbox.setAccessToken(null) // Will use token from app.json

interface MapRegion {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

export default function MapScreen() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Map state
  const [mapStyle, setMapStyle] = useState<MapStyle>('light')
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: 10.7769, // Ho Chi Minh City default
    longitude: 106.7009,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  })
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Restaurant[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Restaurant | null>(null)
  
  // Navigation state
  const [routeData, setRouteData] = useState<DirectionResult | null>(null)
  const [navigationMode, setNavigationMode] = useState(false)
  const [showNavigationPanel, setShowNavigationPanel] = useState(false)
  
  // UI state
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  
  const mapRef = useRef<Mapbox.MapView>(null)
  const cameraRef = useRef<Camera>(null)

  // Load user avatar
  const loadUserAvatar = useCallback(async () => {
    try {
      const userInfo = await userService.getUserInformation()
      if (userInfo.avatarUrl) {
        setUserAvatar(userInfo.avatarUrl)
      } else if (user) {
        setUserAvatar(user.avatar || getDefaultAvatar(user.name, user.email))
      }
    } catch (error) {
      console.log('Could not load user avatar, using fallback:', error)
      if (user) {
        setUserAvatar(user.avatar || getDefaultAvatar(user.name, user.email))
      }
    }
  }, [user])

  // Get current location and load nearby restaurants
  const loadInitialData = useCallback(async () => {
    try {
      const location = await getCurrentLocation()
      if (location) {
        setUserLocation(location)
        setMapRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
        
        // Load nearby restaurants
        const restaurants = await MapProvider.fetchRestaurants(
          location.latitude,
          location.longitude,
          2000
        )
        setSearchResults(restaurants)
      }
    } catch (error) {
      console.error('Error loading initial data:', error)
      Alert.alert('Lỗi', 'Không thể tải dữ liệu ban đầu')
    }
  }, [])

  // Handle place selection from search
  const handlePlaceSelected = useCallback(async (place: any) => {
    try {
      const placeDetail = await GoongService.placeDetailV2(place.id)
      if (placeDetail) {
        const restaurant: Restaurant = {
          id: parseInt(placeDetail.id),
          name: placeDetail.name,
          lat: placeDetail.lat,
          lon: placeDetail.lon,
          tags: {
            'addr:street': placeDetail.address,
            cuisine: 'restaurant'
          }
        }
        
        setSelectedPlace(restaurant)
      setMapRegion({
          latitude: placeDetail.lat,
          longitude: placeDetail.lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
        
        // Fly to location via Camera
        cameraRef.current?.flyTo([placeDetail.lon, placeDetail.lat], 1000)
      }
    } catch (error) {
      console.error('Error getting place detail:', error)
    }
  }, [])

  // Handle location update
  const handleLocationUpdate = useCallback((location: LocationData) => {
    setUserLocation(location)
    setMapRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
    
    // Fly to location via Camera
    cameraRef.current?.flyTo([location.longitude, location.latitude], 1000)
  }, [])

  // Handle restaurant marker press
  const handleRestaurantPress = useCallback(async (restaurant: Restaurant) => {
    if (navigationMode && userLocation) {
      // Calculate route
      try {
        const route = await MapProvider.getDirections(
          { lat: userLocation.latitude, lon: userLocation.longitude },
          { lat: restaurant.lat, lon: restaurant.lon },
          'car'
        )
        
        if (route) {
          setRouteData(route)
          setShowNavigationPanel(true)
        }
      } catch (error) {
        console.error('Error calculating route:', error)
        Alert.alert('Lỗi', 'Không thể tính toán đường đi')
      }
    } else {
      // Show restaurant details
      setSelectedPlace(restaurant)
    }
  }, [navigationMode, userLocation])

  // Handle navigation start
  const handleStartNavigation = useCallback(() => {
    setNavigationMode(true)
    setShowNavigationPanel(false)
    Alert.alert('Bắt đầu điều hướng', 'Tính năng điều hướng đã được kích hoạt')
  }, [])

  // Handle clear route
  const handleClearRoute = useCallback(() => {
    setRouteData(null)
    setNavigationMode(false)
    setShowNavigationPanel(false)
  }, [])

  // Handle map style change
  const handleMapStyleChange = useCallback((style: MapStyle) => {
    setMapStyle(style)
  }, [])

  // Initialize
  useEffect(() => {
    loadInitialData()
    loadUserAvatar()
  }, [loadInitialData, loadUserAvatar])

  // Start location tracking
  useEffect(() => {
    if (userLocation) {
      startLocationTracking(handleLocationUpdate)
    }
    
    return () => {
      stopLocationTracking()
    }
  }, [userLocation, handleLocationUpdate])

  return (
    <View style={styles.container}>
      {/* Mapbox Map */}
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={getMapStyleUrl(mapStyle)}
        onCameraChanged={(state) => {
          const { center } = state.properties
          if (center) {
            setMapRegion({
              latitude: center[1],
              longitude: center[0],
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            })
          }
        }}
      >
        <Camera ref={cameraRef} />
        {/* User Location */}
        {userLocation && (
          <Mapbox.ShapeSource
            id="user-location-source"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [userLocation.longitude, userLocation.latitude]
              },
              properties: {
                type: 'user-location'
              }
            }}
          >
            <Mapbox.CircleLayer
              id="user-location-circle"
              style={{
                circleRadius: 12,
                circleColor: '#3B82F6',
                circleStrokeColor: '#FFFFFF',
                circleStrokeWidth: 3,
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {/* Restaurant Markers */}
        {searchResults.map((restaurant) => (
          <MapboxRestaurantMarker
            key={restaurant.id}
            restaurant={restaurant}
            isSelected={selectedPlace?.id === restaurant.id}
            onPress={handleRestaurantPress}
          />
        ))}

        {/* Route Layer */}
        {routeData && (
          <RouteLayer
            routeData={routeData}
            visible={true}
            color="#3B82F6"
            width={6}
            showArrows={true}
          />
        )}
      </Mapbox.MapView>

      {/* Search Bar */}
      <MapSearchBar
        onPlaceSelected={handlePlaceSelected}
        onMenuPress={() => {
          Alert.alert('Menu', 'Tính năng menu sắp ra mắt!')
        }}
        onAvatarPress={() => router.push('/(tabs)/profile')}
        avatarUrl={userAvatar}
        placeholder="Tìm kiếm địa điểm..."
      />

      {/* Map Style Selector */}
      <MapStyleSelector
        selectedStyle={mapStyle}
        onStyleChange={handleMapStyleChange}
              visible={true}
      />

      {/* Current Location Button */}
      <CurrentLocationButton
        onLocationUpdate={handleLocationUpdate}
        visible={true}
        style="fab"
      />

      {/* Navigation Panel */}
      <NavigationPanel
        routeData={routeData}
        visible={showNavigationPanel}
        onClose={() => setShowNavigationPanel(false)}
        onStartNavigation={handleStartNavigation}
        onClearRoute={handleClearRoute}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
})