/**
 * Map Provider - Goong Maps Service
 * 
 * Service này sử dụng:
 * - Goong Maps API - Tìm nhà hàng và địa điểm
 * - Goong Direction API - Chỉ đường
 * 
 * @example
 * import { MapProvider } from '@/services/MapProvider'
 * const restaurants = await MapProvider.fetchRestaurants(lat, lon)
 */

import { GOONG_API_KEY, GOONG_MAPTILES_KEY } from '@/constants'
import type { Restaurant } from '@/type/location'
import type { DirectionResult } from './GoongDirectionService'

// Import Goong services
import * as GoongDirectionService from './GoongDirectionService'
import type { GoongAutocompletePrediction } from './GoongMapService'
import * as GoongMapService from './GoongMapService'

if (__DEV__) {
  console.log('[MapProvider] Using Goong Maps + Goong Direction API')
}

/**
 * MapProvider - Interface for Goong Maps services
 */
export const MapProvider = {
  /**
   * Fetch restaurants nearby using Goong Maps
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
    return GoongMapService.fetchRestaurantsNearby(latitude, longitude, radius)
  },

  /**
   * Get directions using Goong Direction API
   * 
   * @param origin - Điểm xuất phát {lat, lon}
   * @param destination - Điểm đến {lat, lon}
   * @param profile - Loại phương tiện
   * @returns Promise<DirectionResult | null>
   */
  async getDirections(
    origin: { lat: number; lon: number },
    destination: { lat: number; lon: number },
    profile: string = 'car',
  ): Promise<DirectionResult | null> {
    return GoongDirectionService.getDirections(origin, destination, profile)
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
    profile: string = 'car',
  ): Promise<DirectionResult | null> {
    return GoongDirectionService.getOptimizedRoute(waypoints, profile)
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
    profile: string = 'car',
    alternativeRoutes: number = 2,
  ): Promise<DirectionResult[] | null> {
    return GoongDirectionService.getRouteAlternatives(
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
    // Use Goong Autocomplete API
    if (latitude !== undefined && longitude !== undefined) {
      return GoongMapService.searchPlaces(query, { lat: latitude, lng: longitude })
    }
    return GoongMapService.searchPlaces(query)
  },

  /**
   * Get autocomplete predictions for suggestion dropdown
   */
  async searchAutocomplete(
    query: string,
    latitude?: number,
    longitude?: number,
  ): Promise<GoongAutocompletePrediction[]> {
    if (latitude !== undefined && longitude !== undefined) {
      return GoongMapService.getAutocompletePredictions(query, { lat: latitude, lng: longitude })
    }
    return GoongMapService.getAutocompletePredictions(query)
  },

  /**
   * Get available route profiles
   */
  getRouteProfiles() {
    return GoongDirectionService.ROUTE_PROFILES
  },
}

/**
 * Utility functions - Provider agnostic
 * Re-export từ GoongMapService và GoongDirectionService
 */
export {
  calculateDistance, formatOpeningHours, getCuisineIcon, getPriceRange, getRestaurantRating, isRestaurantOpen
} from './GoongMapService'

export {
  calculateEstimatedCost, convertCoordinatesToMapFormat, formatCost, formatDistance,
  formatDuration, getEstimatedTimeWithTraffic, getInstructionIcon
} from './GoongDirectionService'

/**
 * Provider status check for Goong Maps
 */
export function checkProviderStatus(): {
  provider: string
  configured: boolean
  message: string
} {
  const configured = GOONG_API_KEY.length > 0 && GOONG_MAPTILES_KEY.length > 0
  
  return {
    provider: 'Goong Maps',
    configured,
    message: configured
      ? 'Goong Maps + Goong Direction API configured'
      : 'Goong API keys not found. Please check app.json or .env configuration',
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

