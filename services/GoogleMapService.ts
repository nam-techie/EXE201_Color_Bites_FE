/**
 * Google Maps Places API Service
 * 
 * Service này sử dụng Google Places API để tìm kiếm nhà hàng gần vị trí người dùng
 * Thay thế cho OpenStreetMap Overpass API trong MapService.ts
 * 
 * API Documentation: https://developers.google.com/maps/documentation/places/web-service
 */

import type { Restaurant } from '@/type/location'

// Sẽ được import từ constants sau khi cấu hình
let GOOGLE_MAPS_API_KEY = ''

/**
 * Set Google Maps API Key
 * Gọi function này để cấu hình API key từ constants
 */
export function setGoogleMapsApiKey(apiKey: string) {
  GOOGLE_MAPS_API_KEY = apiKey
}

/**
 * Validate Google Maps API Key
 */
function validateApiKey(): boolean {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error(
      '[GoogleMapService] API key not configured. Please set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.',
    )
    return false
  }
  return true
}

/**
 * Fetch restaurants nearby using Google Places API (Nearby Search)
 * 
 * @param latitude - Vĩ độ của vị trí trung tâm
 * @param longitude - Kinh độ của vị trí trung tâm
 * @param radius - Bán kính tìm kiếm (mét), mặc định 2000m
 * @returns Promise<Restaurant[]> - Danh sách nhà hàng
 * 
 * @example
 * const restaurants = await fetchRestaurantsNearby(10.762622, 106.660172, 2000)
 */
export async function fetchRestaurantsNearby(
  latitude: number,
  longitude: number,
  radius: number = 2000,
): Promise<Restaurant[]> {
  if (!validateApiKey()) return []

  // Google Places API - Nearby Search endpoint
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
  
  const params = new URLSearchParams({
    location: `${latitude},${longitude}`,
    radius: radius.toString(),
    type: 'restaurant', // Chỉ tìm nhà hàng
    key: GOOGLE_MAPS_API_KEY,
  })

  const url = `${baseUrl}?${params.toString()}`

  try {
    console.log('[GoogleMapService] Fetching restaurants from Google Places API...')
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[GoogleMapService] API error:', response.status, errorText)
      throw new Error(`Google Places API error: ${response.status}`)
    }

    const data = await response.json()

    // Kiểm tra status từ Google API
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('[GoogleMapService] API returned error status:', data.status)
      if (data.error_message) {
        console.error('[GoogleMapService] Error message:', data.error_message)
      }
      
      // Xử lý các error codes phổ biến
      if (data.status === 'REQUEST_DENIED') {
        console.error('[GoogleMapService] API key bị từ chối. Kiểm tra lại API key và permissions.')
      } else if (data.status === 'OVER_QUERY_LIMIT') {
        console.error('[GoogleMapService] Đã vượt quá giới hạn request. Hãy chuyển sang OpenStreetMap.')
      }
      
      return []
    }

    if (data.status === 'ZERO_RESULTS') {
      console.log('[GoogleMapService] No restaurants found in this area')
      return []
    }

    console.log('[GoogleMapService] Found', data.results?.length || 0, 'restaurants')

    // Transform Google Places data sang Restaurant interface
    return data.results.map((place: any) => {
      // Extract cuisine type từ types array
      const types = place.types || []
      const cuisineType = extractCuisineFromTypes(types)

      return {
        id: hashPlaceId(place.place_id), // Convert place_id string thành number
        name: place.name || 'Không rõ tên',
        lat: place.geometry?.location?.lat || 0,
        lon: place.geometry?.location?.lng || 0,
        tags: {
          amenity: 'restaurant',
          cuisine: cuisineType,
          // Thêm thông tin từ Google Places
          rating: place.rating?.toString(),
          price_level: place.price_level?.toString(),
          opening_hours: place.opening_hours?.open_now ? 'open' : 'closed',
          address: place.vicinity || '',
          // Google-specific data
          google_place_id: place.place_id,
          google_rating: place.rating?.toString(),
          google_user_ratings_total: place.user_ratings_total?.toString(),
        },
      }
    })
  } catch (error) {
    console.error('[GoogleMapService] Error fetching restaurants:', error)
    return []
  }
}

/**
 * Fetch restaurant details by Place ID
 * Sử dụng Place Details API để lấy thông tin chi tiết
 * 
 * @param placeId - Google Place ID
 * @returns Promise<Restaurant | null>
 */
export async function fetchRestaurantDetails(placeId: string): Promise<Restaurant | null> {
  if (!validateApiKey()) return null

  const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json'
  
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'name,geometry,formatted_address,formatted_phone_number,website,opening_hours,rating,price_level,types,photos,reviews',
    key: GOOGLE_MAPS_API_KEY,
  })

  const url = `${baseUrl}?${params.toString()}`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Google Places Details API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('[GoogleMapService] Place Details error:', data.status)
      return null
    }

    const place = data.result
    const types = place.types || []
    const cuisineType = extractCuisineFromTypes(types)

    return {
      id: hashPlaceId(place.place_id),
      name: place.name || 'Không rõ tên',
      lat: place.geometry?.location?.lat || 0,
      lon: place.geometry?.location?.lng || 0,
      tags: {
        amenity: 'restaurant',
        cuisine: cuisineType,
        phone: place.formatted_phone_number,
        website: place.website,
        opening_hours: formatGoogleOpeningHours(place.opening_hours),
        'addr:street': place.formatted_address,
        rating: place.rating?.toString(),
        price_level: place.price_level?.toString(),
        google_place_id: place.place_id,
        google_rating: place.rating?.toString(),
        google_user_ratings_total: place.user_ratings_total?.toString(),
      },
    }
  } catch (error) {
    console.error('[GoogleMapService] Error fetching place details:', error)
    return null
  }
}

/**
 * Extract cuisine type from Google Places types array
 * Map Google types sang cuisine types tương thích với app
 */
function extractCuisineFromTypes(types: string[]): string {
  const cuisineMap: { [key: string]: string } = {
    'chinese_restaurant': 'chinese',
    'japanese_restaurant': 'japanese',
    'korean_restaurant': 'korean',
    'thai_restaurant': 'thai',
    'indian_restaurant': 'indian',
    'italian_restaurant': 'italian',
    'french_restaurant': 'french',
    'american_restaurant': 'american',
    'mexican_restaurant': 'mexican',
    'spanish_restaurant': 'spanish',
    'vietnamese_restaurant': 'vietnamese',
    'pizza_restaurant': 'pizza',
    'seafood_restaurant': 'seafood',
    'vegetarian_restaurant': 'vegetarian',
    'vegan_restaurant': 'vegan',
    'fast_food_restaurant': 'fast_food',
    'cafe': 'coffee',
    'bakery': 'bakery',
    'ice_cream_shop': 'ice_cream',
    'bar': 'bar',
  }

  for (const type of types) {
    if (cuisineMap[type]) {
      return cuisineMap[type]
    }
  }

  // Fallback: check if any type contains cuisine keywords
  for (const type of types) {
    if (type.includes('restaurant')) {
      return 'restaurant'
    }
  }

  return 'restaurant' // default
}

/**
 * Format Google opening hours to simple format
 */
function formatGoogleOpeningHours(openingHours: any): string {
  if (!openingHours) return ''
  
  if (openingHours.open_now !== undefined) {
    return openingHours.open_now ? 'Đang mở cửa' : 'Đã đóng cửa'
  }

  if (openingHours.weekday_text && openingHours.weekday_text.length > 0) {
    return openingHours.weekday_text.join(', ')
  }

  return ''
}

/**
 * Hash Google Place ID (string) to number for compatibility
 * Sử dụng simple hash function
 */
function hashPlaceId(placeId: string): number {
  let hash = 0
  for (let i = 0; i < placeId.length; i++) {
    const char = placeId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Search restaurants by text query
 * Sử dụng Text Search API
 * 
 * @param query - Từ khóa tìm kiếm
 * @param latitude - Vĩ độ (optional, để ưu tiên kết quả gần)
 * @param longitude - Kinh độ (optional)
 * @param radius - Bán kính (optional)
 */
export async function searchRestaurants(
  query: string,
  latitude?: number,
  longitude?: number,
  radius: number = 5000,
): Promise<Restaurant[]> {
  if (!validateApiKey()) return []

  const baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
  
  const params: any = {
    query: `${query} restaurant`,
    type: 'restaurant',
    key: GOOGLE_MAPS_API_KEY,
  }

  if (latitude !== undefined && longitude !== undefined) {
    params.location = `${latitude},${longitude}`
    params.radius = radius.toString()
  }

  const url = `${baseUrl}?${new URLSearchParams(params).toString()}`

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Google Places Text Search error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('[GoogleMapService] Text Search error:', data.status)
      return []
    }

    return data.results.map((place: any) => ({
      id: hashPlaceId(place.place_id),
      name: place.name || 'Không rõ tên',
      lat: place.geometry?.location?.lat || 0,
      lon: place.geometry?.location?.lng || 0,
      tags: {
        amenity: 'restaurant',
        cuisine: extractCuisineFromTypes(place.types || []),
        address: place.formatted_address || '',
        rating: place.rating?.toString(),
        google_place_id: place.place_id,
      },
    }))
  } catch (error) {
    console.error('[GoogleMapService] Error searching restaurants:', error)
    return []
  }
}

// Re-export utility functions từ MapService.ts để compatibility
export {
    calculateDistance, formatOpeningHours, getCuisineIcon, getPriceRange, getRestaurantRating, isRestaurantOpen
} from './MapService'

