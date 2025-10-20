/**
 * Map Provider - OpenStreetMap Service
 * 
 * Service này sử dụng:
 * - OpenStreetMap (Overpass API) - Tìm nhà hàng
 * - OpenRouteService - Chỉ đường
 * 
 * @example
 * import { MapProvider } from '@/services/MapProvider'
 * const restaurants = await MapProvider.fetchRestaurants(lat, lon)
 */

import type { Restaurant } from '@/type/location'
import Constants from 'expo-constants'
import type { DirectionResult } from './DirectionService'
import { GoongService, decodePolyline } from './GoongService'

// Import OpenStreetMap services
import * as OpenRouteService from './DirectionService'
import * as OpenStreetMapService from './MapService'

if (__DEV__) {
  console.log('[MapProvider] Using OpenStreetMap + OpenRouteService')
}

/**
 * MapProvider - Interface for OpenStreetMap services
 */
export const MapProvider = {
  /**
   * Fetch restaurants nearby using OpenStreetMap
   * 
   * @param latitude - Vĩ độ
   * @param longitude - Kinh độ
   * @param radius - Bán kính tìm kiếm (mét)
   * @returns Promise<Restaurant[]>
   */
  async fetchRestaurants(
    latitude: number,
    longitude: number,
    radius: number = 2000,
  ): Promise<Restaurant[]> {
    return OpenStreetMapService.fetchRestaurantsNearby(latitude, longitude, radius)
  },

  /**
   * Get directions using OpenRouteService
   * 
   * @param origin - Điểm xuất phát {lat, lon}
   * @param destination - Điểm đến {lat, lon}
   * @param profile - Loại phương tiện
   * @returns Promise<DirectionResult | null>
   */
  async getDirections(
    origin: { lat: number; lon: number },
    destination: { lat: number; lon: number },
    profile: string = 'driving-car',
  ): Promise<DirectionResult | null> {
    const extra = (Constants.expoConfig?.extra as any) || {}
    const useGoong = extra?.EXPO_PUBLIC_USE_GOONG_WEBVIEW === 'true'
    const hasGoongKey = (extra?.EXPO_PUBLIC_GOONG_API_KEY as string)?.length > 0

    if (useGoong && hasGoongKey) {
      const vehicle = profile.includes('foot')
        ? 'foot'
        : profile.includes('cycling')
          ? 'bike'
          : 'car'
      const res = await GoongService.directionsV2(origin, destination, vehicle)
      if (!res) return null
      const coords = decodePolyline(res.polyline).map(p => [p.longitude, p.latitude])
      return {
        distance: res.distance,
        duration: res.duration,
        steps: [],
        geometry: coords,
        summary: { distance: res.distance, duration: res.duration },
      }
    }

    return OpenRouteService.getDirections(origin, destination, profile)
  },

  /**
   * Get optimized route for multiple waypoints
   * 
   * @param waypoints - Mảng các điểm {lat, lon}
   * @param profile - Loại phương tiện
   * @returns Promise<DirectionResult | null>
   */
  async getOptimizedRoute(
    waypoints: { lat: number; lon: number }[],
    profile: string = 'driving-car',
  ): Promise<DirectionResult | null> {
    return OpenRouteService.getOptimizedRoute(waypoints, profile)
  },

  /**
   * Get route alternatives
   * 
   * @param origin - Điểm xuất phát
   * @param destination - Điểm đến
   * @param profile - Loại phương tiện
   * @param alternativeRoutes - Số lượng route thay thế
   * @returns Promise<DirectionResult[] | null>
   */
  async getRouteAlternatives(
    origin: { lat: number; lon: number },
    destination: { lat: number; lon: number },
    profile: string = 'driving-car',
    alternativeRoutes: number = 2,
  ): Promise<DirectionResult[] | null> {
    return OpenRouteService.getRouteAlternatives(
      origin,
      destination,
      profile,
      alternativeRoutes,
    )
  },

  /**
   * Search restaurants by text query
   * 
   * @param query - Từ khóa tìm kiếm
   * @param latitude - Vĩ độ
   * @param longitude - Kinh độ
   * @param radius - Bán kính
   * @returns Promise<Restaurant[]>
   */
  async searchRestaurants(
    query: string,
    latitude?: number,
    longitude?: number,
    radius: number = 5000,
  ): Promise<Restaurant[]> {
    // OpenStreetMap: filter trên kết quả nearby
    if (latitude !== undefined && longitude !== undefined) {
      const restaurants = await OpenStreetMapService.fetchRestaurantsNearby(
        latitude,
        longitude,
        radius,
      )
      return restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.tags.cuisine?.toLowerCase().includes(query.toLowerCase()),
      )
    }
    return []
  },

  /**
   * Get available route profiles
   */
  getRouteProfiles() {
    return OpenRouteService.ROUTE_PROFILES
  },
}

/**
 * Utility functions - Provider agnostic
 * Re-export từ MapService (cả 2 provider đều dùng chung)
 */
export {
    calculateDistance, formatOpeningHours, getCuisineIcon, getPriceRange, getRestaurantRating, isRestaurantOpen
} from './MapService'

export {
    calculateEstimatedCost, convertCoordinatesToMapFormat, formatCost, formatDistance,
    formatDuration, getEstimatedTimeWithTraffic, getInstructionIcon
} from './DirectionService'

/**
 * Provider status check for OpenStreetMap
 */
export function checkProviderStatus(): {
  provider: string
  configured: boolean
  message: string
} {
  // OpenStreetMap không cần API key cho Overpass API
  // Nhưng cần key cho OpenRouteService
  const orsKey = process.env.EXPO_PUBLIC_OPENROUTE_API_KEY || ''
  const configured = orsKey.length > 0
  return {
    provider: 'OpenStreetMap',
    configured,
    message: configured
      ? 'OpenStreetMap + OpenRouteService configured'
      : 'OpenRouteService API key not found. Please set EXPO_PUBLIC_OPENROUTE_API_KEY in .env',
  }
}

/**
 * Helper function to log provider info
 */
export function logProviderInfo() {
  const status = checkProviderStatus()
  console.log('='.repeat(50))
  console.log('[MapProvider] Provider:', status.provider)
  console.log('[MapProvider] Status:', status.configured ? '✅ Configured' : '❌ Not Configured')
  console.log('[MapProvider] Message:', status.message)
  console.log('='.repeat(50))
}

// Log provider info in dev mode
if (__DEV__) {
  logProviderInfo()
}

