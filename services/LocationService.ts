import * as Location from 'expo-location'
import { Alert } from 'react-native'

/**
 * Location Service
 * 
 * Quản lý vị trí hiện tại của user
 * Hỗ trợ continuous tracking và heading calculation
 */

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number
  heading?: number
  speed?: number
  timestamp: number
}

export interface LocationPermissionStatus {
  granted: boolean
  canAskAgain: boolean
  status: Location.LocationPermissionResponse['status']
}

// Location tracking state
let watchId: Location.LocationSubscription | null = null
let currentLocation: LocationData | null = null
let locationCallbacks: ((location: LocationData) => void)[] = []

/**
 * Request location permissions
 * @returns Promise<LocationPermissionStatus>
 */
export async function requestLocationPermissions(): Promise<LocationPermissionStatus> {
  try {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync()
    
    return {
      granted: status === 'granted',
      canAskAgain,
      status
    }
  } catch (error) {
    console.error('Error requesting location permissions:', error)
    return {
      granted: false,
      canAskAgain: false,
      status: 'denied'
    }
  }
}

/**
 * Check if location permissions are granted
 * @returns Promise<boolean>
 */
export async function hasLocationPermissions(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync()
    return status === 'granted'
  } catch (error) {
    console.error('Error checking location permissions:', error)
    return false
  }
}

/**
 * Get current location once
 * @param options - Location options
 * @returns Promise<LocationData | null>
 */
export async function getCurrentLocation(
  options: Location.LocationOptions = {}
): Promise<LocationData | null> {
  try {
    // Check permissions first
    const hasPermission = await hasLocationPermissions()
    if (!hasPermission) {
      const permissionResult = await requestLocationPermissions()
      if (!permissionResult.granted) {
        Alert.alert(
          'Quyền truy cập vị trí',
          'Ứng dụng cần quyền truy cập vị trí để hiển thị vị trí hiện tại trên bản đồ.',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Cài đặt', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        )
        return null
      }
    }

    // Get location with default options
    const locationOptions: Location.LocationOptions = {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 1000,
      distanceInterval: 10,
      ...options
    }

    const location = await Location.getCurrentPositionAsync(locationOptions)
    
    const locationData: LocationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
      altitude: location.coords.altitude || undefined,
      heading: location.coords.heading || undefined,
      speed: location.coords.speed || undefined,
      timestamp: location.timestamp
    }

    // Cache current location
    currentLocation = locationData
    
    return locationData
  } catch (error) {
    console.error('Error getting current location:', error)
    Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.')
    return null
  }
}

/**
 * Start watching location changes
 * @param callback - Callback function for location updates
 * @param options - Location options
 * @returns Promise<boolean> - Success status
 */
export async function startLocationTracking(
  callback: (location: LocationData) => void,
  options: Location.LocationOptions = {}
): Promise<boolean> {
  try {
    // Check permissions
    const hasPermission = await hasLocationPermissions()
    if (!hasPermission) {
      const permissionResult = await requestLocationPermissions()
      if (!permissionResult.granted) {
        return false
      }
    }

    // Stop existing tracking
    await stopLocationTracking()

    // Add callback to list
    locationCallbacks.push(callback)

    // Start new tracking
    const locationOptions: Location.LocationOptions = {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 2000,
      distanceInterval: 10,
      ...options
    }

    watchId = await Location.watchPositionAsync(
      locationOptions,
      (location) => {
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || undefined,
          altitude: location.coords.altitude || undefined,
          heading: location.coords.heading || undefined,
          speed: location.coords.speed || undefined,
          timestamp: location.timestamp
        }

        // Update cached location
        currentLocation = locationData

        // Notify all callbacks
        locationCallbacks.forEach(cb => cb(locationData))
      }
    )

    return true
  } catch (error) {
    console.error('Error starting location tracking:', error)
    return false
  }
}

/**
 * Stop watching location changes
 */
export async function stopLocationTracking(): Promise<void> {
  try {
    if (watchId) {
      watchId.remove()
      watchId = null
    }
    locationCallbacks = []
  } catch (error) {
    console.error('Error stopping location tracking:', error)
  }
}

/**
 * Get cached current location
 * @returns LocationData | null
 */
export function getCachedLocation(): LocationData | null {
  return currentLocation
}

/**
 * Calculate distance between two points
 * @param lat1 - First point latitude
 * @param lon1 - First point longitude
 * @param lat2 - Second point latitude
 * @param lon2 - Second point longitude
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Calculate bearing between two points
 * @param lat1 - First point latitude
 * @param lon1 - First point longitude
 * @param lat2 - Second point latitude
 * @param lon2 - Second point longitude
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

  let bearing = Math.atan2(y, x) * (180 / Math.PI)
  bearing = (bearing + 360) % 360

  return bearing
}

/**
 * Format distance for display
 * @param distance - Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(distance: number): string {
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  }
  return `${(distance / 1000).toFixed(1)}km`
}

/**
 * Check if location is recent (within 5 minutes)
 * @param location - Location data
 * @returns True if location is recent
 */
export function isLocationRecent(location: LocationData): boolean {
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000
  return (now - location.timestamp) < fiveMinutes
}

/**
 * Get location accuracy description
 * @param accuracy - Accuracy in meters
 * @returns Accuracy description
 */
export function getAccuracyDescription(accuracy?: number): string {
  if (!accuracy) return 'Không rõ'
  if (accuracy < 5) return 'Rất chính xác'
  if (accuracy < 20) return 'Chính xác'
  if (accuracy < 100) return 'Tương đối chính xác'
  return 'Kém chính xác'
}
