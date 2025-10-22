/**
 * Goong Maps API Service
 * 
 * Service này sử dụng Goong Maps APIs:
 * - Autocomplete v2 - Tìm kiếm gợi ý địa điểm
 * - Place Detail v2 - Lấy thông tin chi tiết địa điểm
 * - Directions v2 - Chỉ đường
 */

import Constants from 'expo-constants'

// Lấy API key từ app.json
const getGoongApiKey = () => {
  const envKey = process.env.EXPO_PUBLIC_GOONG_API_KEY
  const extraKey = (Constants?.expoConfig as any)?.extra?.GOONG_API_KEY as string | undefined
  return envKey || extraKey || ''
}

const GOONG_API_KEY = getGoongApiKey()
const GOONG_BASE_URL = 'https://rsapi.goong.io'

if (__DEV__) {
  console.log('[GoongService] API Key configured:', GOONG_API_KEY ? '✅' : '❌')
}

// Types
export interface GoongAutocompleteResult {
  predictions: {
    place_id: string
    description: string
    structured_formatting: {
      main_text: string
      secondary_text: string
    }
  }[]
  status: string
}

export interface GoongPlaceDetailResult {
  result: {
    place_id: string
    name: string
    formatted_address: string
    geometry: {
      location: {
        lat: number
        lng: number
      }
    }
    types: string[]
  }
  status: string
}

export interface GoongDirectionsResult {
  routes: {
    overview_polyline: {
      points: string
    }
    legs: {
      distance: {
        text: string
        value: number
      }
      duration: {
        text: string
        value: number
      }
    }[]
  }[]
  status: string
}

export interface GoongService {
  autocomplete: (search: string) => Promise<GoongAutocompleteResult>
  placeDetail: (placeId: string) => Promise<GoongPlaceDetailResult>
  directions: (origin: [number, number], destination: [number, number], vehicle?: string) => Promise<GoongDirectionsResult>
  decodePolyline: (encoded: string) => { latitude: number; longitude: number }[]
}

/**
 * Decode polyline string to coordinates array
 */
const decodePolyline = (encoded: string): { latitude: number; longitude: number }[] => {
  const poly = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b, shift = 0, result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1))
    lat += dlat

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1))
    lng += dlng

    poly.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5
    })
  }

  return poly
}

/**
 * Goong Autocomplete API v2
 */
const autocomplete = async (search: string): Promise<GoongAutocompleteResult> => {
  if (!GOONG_API_KEY) {
    throw new Error('Goong API key not configured')
  }

  const url = `${GOONG_BASE_URL}/Place/AutoComplete`
  const params = new URLSearchParams({
    api_key: GOONG_API_KEY,
    input: search,
    limit: '10'
  })

  try {
    const response = await fetch(`${url}?${params}`)
    if (!response.ok) {
      throw new Error(`Goong Autocomplete API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Goong Autocomplete error:', error)
    throw error
  }
}

/**
 * Goong Place Detail API v2
 */
const placeDetail = async (placeId: string): Promise<GoongPlaceDetailResult> => {
  if (!GOONG_API_KEY) {
    throw new Error('Goong API key not configured')
  }

  const url = `${GOONG_BASE_URL}/Place/Detail`
  const params = new URLSearchParams({
    api_key: GOONG_API_KEY,
    place_id: placeId
  })

  try {
    const response = await fetch(`${url}?${params}`)
    if (!response.ok) {
      throw new Error(`Goong Place Detail API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Goong Place Detail error:', error)
    throw error
  }
}

/**
 * Goong Directions API v2
 */
const directions = async (
  origin: [number, number], 
  destination: [number, number], 
  vehicle: string = 'car'
): Promise<GoongDirectionsResult> => {
  if (!GOONG_API_KEY) {
    throw new Error('Goong API key not configured')
  }

  const url = `${GOONG_BASE_URL}/Direction`
  const params = new URLSearchParams({
    api_key: GOONG_API_KEY,
    origin: `${origin[1]},${origin[0]}`, // lat,lng format
    destination: `${destination[1]},${destination[0]}`, // lat,lng format
    vehicle: vehicle
  })

  try {
    const response = await fetch(`${url}?${params}`)
    if (!response.ok) {
      throw new Error(`Goong Directions API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Goong Directions error:', error)
    throw error
  }
}

/**
 * Debounce utility for search
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const GoongService: GoongService = {
  autocomplete,
  placeDetail,
  directions,
  decodePolyline
}

export default GoongService
