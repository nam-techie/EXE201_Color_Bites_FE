import { GOONG_API_KEY } from '@/constants'
import type { Restaurant } from '@/type/location'

// Goong API Base URL
const GOONG_API_BASE = 'https://rsapi.goong.io'

// Goong API Response Types
interface GoongPlace {
  place_id: string
  formatted_address: string
  geometry?: {
    location?: {
      lat: number
      lng: number
    }
  }
  name: string
  types?: string[]
  vicinity?: string
}

interface GoongAutocompleteResponse {
  status: string
  predictions: GoongPlace[]
}

interface GoongPlaceDetailResponse {
  status: string
  result: GoongPlace
}

// Create a stable numeric id from a string (e.g., Goong place_id)
function stableStringToNumberId(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0 // Convert to 32-bit int
  }
  // Ensure non-negative and fit into safe integer range
  return Math.abs(hash)
}

// Validate API key
function validateApiKey(): boolean {
  if (!GOONG_API_KEY) {
    console.error(
      'Goong API key not configured. Please set EXPO_PUBLIC_GOONG_API_KEY in your environment.',
    )
    return false
  }
  return true
}

/**
 * Search places using Goong Autocomplete API
 * @param query - Search query
 * @param location - Optional location for bias
 * @returns Promise<Restaurant[]>
 */
export async function searchPlaces(
  query: string,
  location?: { lat: number; lng: number },
): Promise<Restaurant[]> {
  if (!validateApiKey()) return []

  const params = new URLSearchParams({
    api_key: GOONG_API_KEY,
    input: query,
    limit: '20',
  })

  if (location) {
    params.append('location', `${location.lat},${location.lng}`)
    params.append('radius', '5000')
  }

  const url = `${GOONG_API_BASE}/Place/AutoComplete?${params.toString()}`

  try {
    console.log('Fetching Goong autocomplete for query:', query)

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Goong Autocomplete API error:', response.status, errorText)
      throw new Error(`Goong Autocomplete API error: ${response.status}`)
    }

    const data: GoongAutocompleteResponse = await response.json()
    console.log('Goong Autocomplete Response received:', data.predictions?.length, 'places')

    if (data.status !== 'OK' || !data.predictions) {
      return []
    }

    return data.predictions
      .filter((place) => place?.geometry?.location)
      .map((place) => ({
        id: stableStringToNumberId(place.place_id),
        name: place.name || 'Không rõ tên',
        lat: place.geometry!.location!.lat,
        lon: place.geometry!.location!.lng,
        tags: {
          cuisine: place.types?.[0] || 'restaurant',
          'addr:street': place.formatted_address,
        },
      }))
  } catch (error) {
    console.error('Error fetching places from Goong:', error)
    return []
  }
}

/**
 * Get place detail using Goong Place Detail API
 * @param placeId - Goong place ID
 * @returns Promise<Restaurant | null>
 */
export async function getPlaceDetail(placeId: string): Promise<Restaurant | null> {
  if (!validateApiKey()) return null

  const params = new URLSearchParams({
    api_key: GOONG_API_KEY,
    place_id: placeId,
  })

  const url = `${GOONG_API_BASE}/Place/Detail?${params.toString()}`

  try {
    console.log('Fetching Goong place detail for ID:', placeId)

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Goong Place Detail API error:', response.status, errorText)
      throw new Error(`Goong Place Detail API error: ${response.status}`)
    }

    const data: GoongPlaceDetailResponse = await response.json()
    console.log('Goong Place Detail Response received')

    if (data.status !== 'OK' || !data.result) {
      return null
    }

    const place = data.result
    if (!place?.geometry?.location) {
      return null
    }
    return {
      id: stableStringToNumberId(place.place_id),
      name: place.name || 'Không rõ tên',
      lat: place.geometry.location.lat,
      lon: place.geometry.location.lng,
      tags: {
        cuisine: place.types?.[0] || 'restaurant',
        'addr:street': place.formatted_address,
      },
    }
  } catch (error) {
    console.error('Error fetching place detail from Goong:', error)
    return null
  }
}

/**
 * Fetch restaurants nearby using Goong Autocomplete with location bias
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @param radius - Search radius in meters
 * @returns Promise<Restaurant[]>
 */
export async function fetchRestaurantsNearby(
  latitude: number,
  longitude: number,
  radius: number = 2000,
): Promise<Restaurant[]> {
  if (!validateApiKey()) return []

  // Search for restaurants near the location
  const params = new URLSearchParams({
    api_key: GOONG_API_KEY,
    input: 'restaurant',
    location: `${latitude},${longitude}`,
    radius: radius.toString(),
    limit: '50',
  })

  const url = `${GOONG_API_BASE}/Place/AutoComplete?${params.toString()}`

  try {
    console.log('Fetching Goong restaurants nearby:', latitude, longitude, radius)

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Goong nearby restaurants API error:', response.status, errorText)
      throw new Error(`Goong nearby restaurants API error: ${response.status}`)
    }

    const data: GoongAutocompleteResponse = await response.json()
    console.log('Goong nearby restaurants Response received:', data.predictions?.length, 'places')

    if (data.status !== 'OK' || !data.predictions) {
      return []
    }

    return data.predictions
      .filter((place) => place?.geometry?.location)
      .map((place) => ({
        id: stableStringToNumberId(place.place_id),
        name: place.name || 'Không rõ tên',
        lat: place.geometry!.location!.lat,
        lon: place.geometry!.location!.lng,
        tags: {
          cuisine: place.types?.[0] || 'restaurant',
          'addr:street': place.formatted_address,
        },
      }))
  } catch (error) {
    console.error('Error fetching nearby restaurants from Goong:', error)
    return []
  }
}

// Utility functions (re-export from old MapService for compatibility)
export function getCuisineIcon(cuisine: string): { name: string; color: string } {
  const cuisineMap: { [key: string]: { name: string; color: string } } = {
    // Asian cuisines
    vietnamese: { name: 'noodles', color: '#22C55E' },
    chinese: { name: 'food-fork-drink', color: '#A855F7' },
    japanese: { name: 'fish', color: '#3B82F6' },
    korean: { name: 'noodles', color: '#EA580C' },
    thai: { name: 'chili-mild', color: '#F97316' },
    indian: { name: 'food-variant', color: '#F59E0B' },

    // Western cuisines
    italian: { name: 'pasta', color: '#EF4444' },
    french: { name: 'bread-slice', color: '#E879F9' },
    american: { name: 'hamburger', color: '#F43F5E' },
    mexican: { name: 'taco', color: '#10B981' },
    spanish: { name: 'paella', color: '#0EA5E9' },

    // Other cuisines
    pizza: { name: 'pizza', color: '#F87171' },
    burger: { name: 'hamburger', color: '#FB923C' },
    seafood: { name: 'fish', color: '#38BDF8' },
    bbq: { name: 'grill', color: '#DC2626' },
    vegetarian: { name: 'leaf', color: '#4ADE80' },
    vegan: { name: 'leaf', color: '#22C55E' },
    coffee: { name: 'coffee', color: '#A16207' },
    bakery: { name: 'bread-slice', color: '#FCD34D' },
    ice_cream: { name: 'ice-cream', color: '#F472B6' },
    western: { name: 'silverware-fork-knife', color: '#9CA3AF' },

    // Default
    default: { name: 'silverware-fork-knife', color: '#6B7280' },
  }

  const normalizedCuisine = cuisine.toLowerCase().replace(/[^a-z]/g, '')
  return cuisineMap[normalizedCuisine] || cuisineMap.default
}

export function formatOpeningHours(hours: string): string {
  if (!hours) return 'Không rõ giờ mở cửa'
  return hours
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function isRestaurantOpen(openingHours: string): boolean {
  if (!openingHours) return false
  // Simple implementation - can be enhanced later
  return true
}

export function getRestaurantRating(tags: any): number | null {
  const rating = tags['stars'] || tags['rating'] || tags['review:rating']
  return rating ? Number.parseFloat(rating) : null
}

export function getPriceRange(tags: any): string {
  const priceLevel = tags['price'] || tags['price:range']
  if (!priceLevel) return ''

  const priceMap: { [key: string]: string } = {
    cheap: '$',
    moderate: '$$',
    expensive: '$$$',
    very_expensive: '$$$$',
    '1': '$',
    '2': '$$',
    '3': '$$$',
    '4': '$$$$',
  }

  return priceMap[priceLevel.toLowerCase()] || ''
}

// ---- Mapbox GeoJSON helpers ----
// Format a list of restaurants to a GeoJSON FeatureCollection for Mapbox sources
export function formatRestaurantsToGeoJSON(restaurants: Restaurant[]) {
  return {
    type: 'FeatureCollection',
    features: restaurants.map((r) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        // Mapbox expects [lng, lat]
        coordinates: [r.lon, r.lat],
      },
      properties: {
        id: r.id,
        name: r.name,
        cuisine: r.tags?.cuisine,
        phone: r.tags?.phone,
        website: r.tags?.website,
        address: r.tags?.['addr:street'],
        opening_hours: r.tags?.opening_hours,
      },
    })),
  }
}