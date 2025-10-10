/**
 * Map Provider - Abstraction Layer
 * 
 * Service này cung cấp abstraction layer để dễ dàng switch giữa:
 * - Google Maps API (Google Places + Google Directions)
 * - OpenStreetMap (Overpass API + OpenRouteService)
 * 
 * Chỉ cần thay đổi MAP_PROVIDER trong constants/index.ts để switch provider
 * 
 * @example
 * // Trong constants/index.ts
 * export const MAP_PROVIDER = 'google' // hoặc 'openstreetmap'
 * 
 * // Trong code
 * import { MapProvider } from '@/services/MapProvider'
 * const restaurants = await MapProvider.fetchRestaurants(lat, lon)
 */

import { GOOGLE_MAPS_API_KEY, MAP_PROVIDER } from '@/constants'
import type { Restaurant } from '@/type/location'
import type { DirectionResult } from './DirectionService'

// Import OpenStreetMap services (existing) - TẠM THỜI COMMENT để chỉ dùng Google Maps
// import * as OpenRouteService from './DirectionService'
// import * as OpenStreetMapService from './MapService'

// Import Google Maps services (new)
import * as GoogleDirectionService from './GoogleDirectionService'
import * as GoogleGeocodingService from './GoogleGeocodingService'
import * as GoogleMapService from './GoogleMapService'

/**
 * Initialize services with API keys
 */
function initializeServices() {
  if (MAP_PROVIDER === 'google') {
    GoogleMapService.setGoogleMapsApiKey(GOOGLE_MAPS_API_KEY)
    GoogleDirectionService.setGoogleMapsApiKey(GOOGLE_MAPS_API_KEY)
    GoogleGeocodingService.setGoogleMapsApiKey(GOOGLE_MAPS_API_KEY)
    
    if (__DEV__) {
      console.log('[MapProvider] Initialized with Google Maps API')
    }
  } else {
    if (__DEV__) {
      console.log('[MapProvider] Initialized with OpenStreetMap API')
    }
  }
}

// Initialize on module load
initializeServices()

/**
 * MapProvider - Unified interface for map services
 */
export const MapProvider = {
  /**
   * Get current provider name
   */
  getProvider(): 'google' | 'openstreetmap' {
    return MAP_PROVIDER
  },

  /**
   * Fetch restaurants nearby
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
    if (MAP_PROVIDER === 'google') {
      return GoogleMapService.fetchRestaurantsNearby(latitude, longitude, radius)
    } else {
      // TẠM THỜI COMMENT OpenStreetMap
      // return OpenStreetMapService.fetchRestaurantsNearby(latitude, longitude, radius)
      console.warn('[MapProvider] OpenStreetMap is temporarily disabled. Using Google Maps only.')
      return []
    }
  },

  /**
   * Get directions between two points
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
    if (MAP_PROVIDER === 'google') {
      return GoogleDirectionService.getDirections(origin, destination, profile)
    } else {
      // TẠM THỜI COMMENT OpenStreetMap
      // return OpenRouteService.getDirections(origin, destination, profile)
      console.warn('[MapProvider] OpenStreetMap is temporarily disabled. Using Google Maps only.')
      return null
    }
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
    if (MAP_PROVIDER === 'google') {
      return GoogleDirectionService.getOptimizedRoute(waypoints, profile)
    } else {
      // TẠM THỜI COMMENT OpenStreetMap
      // return OpenRouteService.getOptimizedRoute(waypoints, profile)
      console.warn('[MapProvider] OpenStreetMap is temporarily disabled. Using Google Maps only.')
      return null
    }
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
    if (MAP_PROVIDER === 'google') {
      return GoogleDirectionService.getRouteAlternatives(
        origin,
        destination,
        profile,
        alternativeRoutes,
      )
    } else {
      // TẠM THỜI COMMENT OpenStreetMap
      // return OpenRouteService.getRouteAlternatives(
      //   origin,
      //   destination,
      //   profile,
      //   alternativeRoutes,
      // )
      console.warn('[MapProvider] OpenStreetMap is temporarily disabled. Using Google Maps only.')
      return null
    }
  },

  /**
   * Search restaurants by text query
   * 
   * @param query - Từ khóa tìm kiếm
   * @param latitude - Vĩ độ (optional)
   * @param longitude - Kinh độ (optional)
   * @param radius - Bán kính (optional)
   * @returns Promise<Restaurant[]>
   */
  async searchRestaurants(
    query: string,
    latitude?: number,
    longitude?: number,
    radius: number = 5000,
  ): Promise<Restaurant[]> {
    if (MAP_PROVIDER === 'google') {
      return GoogleMapService.searchRestaurants(query, latitude, longitude, radius)
    } else {
      // TẠM THỜI COMMENT OpenStreetMap
      // // OpenStreetMap không có text search riêng, dùng filter trên kết quả nearby
      // if (latitude !== undefined && longitude !== undefined) {
      //   const restaurants = await OpenStreetMapService.fetchRestaurantsNearby(
      //     latitude,
      //     longitude,
      //     radius,
      //   )
      //   return restaurants.filter(
      //     (r) =>
      //       r.name.toLowerCase().includes(query.toLowerCase()) ||
      //       r.tags.cuisine?.toLowerCase().includes(query.toLowerCase()),
      //   )
      // }
      console.warn('[MapProvider] OpenStreetMap is temporarily disabled. Using Google Maps only.')
      return []
    }
  },

  /**
   * Get restaurant details by ID
   * Note: Chỉ Google Maps hỗ trợ, OpenStreetMap không có API này
   * 
   * @param placeId - Google Place ID
   * @returns Promise<Restaurant | null>
   */
  async getRestaurantDetails(placeId: string): Promise<Restaurant | null> {
    if (MAP_PROVIDER === 'google') {
      return GoogleMapService.fetchRestaurantDetails(placeId)
    } else {
      console.warn('[MapProvider] getRestaurantDetails not supported for OpenStreetMap')
      return null
    }
  },

  /**
   * Get available route profiles for current provider
   */
  getRouteProfiles() {
    if (MAP_PROVIDER === 'google') {
      return GoogleDirectionService.GOOGLE_ROUTE_PROFILES
    } else {
      // TẠM THỜI COMMENT OpenStreetMap
      // return OpenRouteService.ROUTE_PROFILES
      console.warn('[MapProvider] OpenStreetMap is temporarily disabled. Using Google Maps only.')
      return []
    }
  },

  /**
   * Geocoding - Chuyển địa chỉ thành tọa độ
   * 
   * @param address - Địa chỉ cần tìm
   * @returns Promise với {lat, lng, formatted_address, place_id}
   */
  async geocodeAddress(address: string) {
    if (MAP_PROVIDER === 'google') {
      return GoogleGeocodingService.geocodeAddress(address)
    } else {
      console.warn('[MapProvider] Geocoding not supported for OpenStreetMap')
      return null
    }
  },

  /**
   * Reverse Geocoding - Chuyển tọa độ thành địa chỉ
   * 
   * @param lat - Vĩ độ
   * @param lng - Kinh độ
   * @returns Promise với formatted_address
   */
  async reverseGeocode(lat: number, lng: number) {
    if (MAP_PROVIDER === 'google') {
      return GoogleGeocodingService.reverseGeocode(lat, lng)
    } else {
      console.warn('[MapProvider] Reverse geocoding not supported for OpenStreetMap')
      return null
    }
  },

  /**
   * Autocomplete Search - Tìm kiếm địa chỉ với gợi ý
   * 
   * @param input - Chuỗi tìm kiếm
   * @param location - Vị trí hiện tại (optional)
   * @param radius - Bán kính ưu tiên (mét)
   * @returns Promise với danh sách suggestions
   */
  async autocompleteSearch(
    input: string,
    location?: { lat: number; lng: number },
    radius?: number,
  ) {
    if (MAP_PROVIDER === 'google') {
      return GoogleGeocodingService.autocompleteSearch(input, location, radius)
    } else {
      console.warn('[MapProvider] Autocomplete search not supported for OpenStreetMap')
      return []
    }
  },

  /**
   * Get Place Details by Place ID
   * 
   * @param placeId - Google Place ID
   * @returns Promise với {lat, lng, formatted_address, name}
   */
  async getPlaceDetails(placeId: string) {
    if (MAP_PROVIDER === 'google') {
      return GoogleGeocodingService.getPlaceDetails(placeId)
    } else {
      console.warn('[MapProvider] Place details not supported for OpenStreetMap')
      return null
    }
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
 * Provider status check
 */
export function checkProviderStatus(): {
  provider: string
  configured: boolean
  message: string
} {
  if (MAP_PROVIDER === 'google') {
    const configured = GOOGLE_MAPS_API_KEY.length > 0
    return {
      provider: 'Google Maps',
      configured,
      message: configured
        ? 'Google Maps API is configured'
        : 'Google Maps API key not found. Please set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in .env',
    }
  } else {
    // OpenStreetMap không cần API key cho Overpass API
    // Nhưng cần key cho OpenRouteService
    const orsKey = process.env.EXPO_PUBLIC_OPENROUTE_API_KEY || ''
    const configured = orsKey.length > 0
    return {
      provider: 'OpenStreetMap',
      configured,
      message: configured
        ? 'OpenStreetMap is configured'
        : 'OpenRouteService API key not found. Please set EXPO_PUBLIC_OPENROUTE_API_KEY in .env',
    }
  }
}

/**
 * Helper function to log provider info
 */
export function logProviderInfo() {
  const status = checkProviderStatus()
  console.log('='.repeat(50))
  console.log('[MapProvider] Current Provider:', status.provider)
  console.log('[MapProvider] Status:', status.configured ? '✅ Configured' : '❌ Not Configured')
  console.log('[MapProvider] Message:', status.message)
  console.log('='.repeat(50))
}

// Log provider info in dev mode
if (__DEV__) {
  logProviderInfo()
}

