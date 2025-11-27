/**
 * Goong Service - Place Autocomplete, Details & Geocode
 * 
 * Service này sử dụng Goong API để:
 * - Autocomplete địa điểm khi người dùng gõ
 * - Lấy chi tiết địa điểm từ place_id
 * - Geocode: chuyển đổi địa chỉ ↔ tọa độ
 * - Tìm restaurant trong Goong database
 * 
 * @example
 * import { GoongService } from '@/services/GoongService'
 * const suggestions = await GoongService.autocomplete('Nhà hàng', { lat: 10.762622, lng: 106.660172 })
 */

import { GOONG_API_KEY } from '@/constants'

// Goong API Configuration
const GOONG_BASE_URL = 'https://rsapi.goong.io'

// Type definitions
export interface GoongAutocompletePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
  types?: string[]
}

export interface GoongAutocompleteResponse {
  predictions: GoongAutocompletePrediction[]
  status: string
}

export interface GoongPlaceDetail {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
    viewport?: {
      northeast: { lat: number; lng: number }
      southwest: { lat: number; lng: number }
    }
  }
  types?: string[]
  address_components?: {
    long_name: string
    short_name: string
    types: string[]
  }[]
  // Optional fields từ Goong API
  phone?: string
  website?: string
  rating?: number
  opening_hours?: string
}

export interface GoongPlaceDetailResponse {
  result: GoongPlaceDetail
  status: string
}

export interface Location {
  lat: number
  lng: number
}

// Geocode API types
export interface GoongGeocodeResult {
  place_id: string
  formatted_address: string
  name?: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
    viewport?: {
      northeast: { lat: number; lng: number }
      southwest: { lat: number; lng: number }
    }
    boundary?: string // Encoded polyline
  }
  types?: string[]
  address_components?: {
    long_name: string
    short_name: string
    types: string[]
  }[]
  plus_code?: {
    compound_code: string
    global_code: string
  }
}

export interface GoongGeocodeResponse {
  results: GoongGeocodeResult[]
  status: string
}

/**
 * Debounce utility function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * GoongService - Place Autocomplete & Details
 */
export const GoongService = {
  /**
   * Autocomplete địa điểm
   * 
   * @param query - Từ khóa tìm kiếm
   * @param location - Vị trí hiện tại (optional, để ưu tiên kết quả gần)
   * @param radius - Bán kính tìm kiếm (mét, optional)
   * @returns Promise<GoongAutocompleteResponse>
   */
  async autocomplete(
    query: string,
    location?: Location,
    radius?: number,
  ): Promise<GoongAutocompleteResponse> {
    if (!query || query.trim().length === 0) {
      return { predictions: [], status: 'OK' }
    }

    try {
      // Build query params
      const params = new URLSearchParams({
        api_key: GOONG_API_KEY,
        input: query.trim(),
      })

      // Add location bias if provided
      if (location) {
        params.append('location', `${location.lat},${location.lng}`)
        if (radius) {
          params.append('radius', radius.toString())
        }
      }

      const url = `${GOONG_BASE_URL}/Place/AutoComplete?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Goong API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Handle API error status
      if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Goong API returned status: ${data.status}`)
      }

      return {
        predictions: data.predictions || [],
        status: data.status || 'OK',
      }
    } catch (error) {
      console.error('[GoongService] Autocomplete error:', error)
      // Return empty results on error instead of throwing
      return { predictions: [], status: 'ERROR' }
    }
  },

  /**
   * Lấy chi tiết địa điểm từ place_id
   * 
   * @param placeId - Place ID từ autocomplete
   * @returns Promise<GoongPlaceDetail | null>
   */
  async getPlaceDetail(placeId: string): Promise<GoongPlaceDetail | null> {
    if (!placeId || placeId.trim().length === 0) {
      return null
    }

    try {
      const params = new URLSearchParams({
        api_key: GOONG_API_KEY,
        place_id: placeId,
      })

      const url = `${GOONG_BASE_URL}/Place/Detail?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Goong API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Handle API error status
      if (data.status && data.status !== 'OK') {
        throw new Error(`Goong API returned status: ${data.status}`)
      }

      if (!data.result) {
        return null
      }

      return data.result as GoongPlaceDetail
    } catch (error) {
      console.error('[GoongService] GetPlaceDetail error:', error)
      return null
    }
  },

  /**
   * Forward Geocode - Chuyển đổi địa chỉ thành tọa độ
   * 
   * @param address - Địa chỉ hoặc tên địa điểm cần tìm
   * @param location - Vị trí hiện tại (optional, để ưu tiên kết quả gần)
   * @param radius - Bán kính tìm kiếm (mét, optional)
   * @returns Promise<GoongGeocodeResponse>
   */
  async geocode(
    address: string,
    location?: Location,
    radius?: number,
  ): Promise<GoongGeocodeResponse> {
    if (!address || address.trim().length === 0) {
      return { results: [], status: 'OK' }
    }

    try {
      const params = new URLSearchParams({
        api_key: GOONG_API_KEY,
        address: address.trim(),
      })

      // Add location bias if provided
      if (location) {
        params.append('location', `${location.lat},${location.lng}`)
        if (radius) {
          params.append('radius', radius.toString())
        }
      }

      const url = `${GOONG_BASE_URL}/Geocode?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Goong API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Handle API error status
      if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Goong API returned status: ${data.status}`)
      }

      return {
        results: data.results || [],
        status: data.status || 'OK',
      }
    } catch (error) {
      console.error('[GoongService] Geocode error:', error)
      return { results: [], status: 'ERROR' }
    }
  },

  /**
   * Reverse Geocode - Chuyển đổi tọa độ thành địa chỉ
   * 
   * @param lat - Vĩ độ
   * @param lng - Kinh độ
   * @returns Promise<GoongGeocodeResponse>
   */
  async reverseGeocode(lat: number, lng: number): Promise<GoongGeocodeResponse> {
    try {
      const params = new URLSearchParams({
        api_key: GOONG_API_KEY,
        lat: lat.toString(),
        lng: lng.toString(),
      })

      const url = `${GOONG_BASE_URL}/Geocode?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Goong API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Handle API error status
      if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Goong API returned status: ${data.status}`)
      }

      return {
        results: data.results || [],
        status: data.status || 'OK',
      }
    } catch (error) {
      console.error('[GoongService] ReverseGeocode error:', error)
      return { results: [], status: 'ERROR' }
    }
  },

  /**
   * Tìm restaurant trong Goong database bằng tên và location
   * 
   * @param name - Tên restaurant
   * @param lat - Vĩ độ
   * @param lng - Kinh độ
   * @param radius - Bán kính tìm kiếm (mét, default 500)
   * @returns Promise<GoongPlaceDetail | null>
   */
  async findRestaurantInGoong(
    name: string,
    lat: number,
    lng: number,
    radius: number = 500,
  ): Promise<GoongPlaceDetail | null> {
    if (!name || name.trim().length === 0) {
      return null
    }

    try {
      // Step 1: Geocode với tên restaurant + location bias
      const geocodeResponse = await GoongService.geocode(name, { lat, lng }, radius)

      if (!geocodeResponse.results || geocodeResponse.results.length === 0) {
        if (__DEV__) {
          console.log(`[GoongService] No results found for: ${name}`)
        }
        return null
      }

      // Step 2: Tìm kết quả match nhất
      const normalizedName = name.toLowerCase().trim()
      let bestMatch: GoongGeocodeResult | null = null
      let bestScore = 0

      for (const result of geocodeResponse.results) {
        // Tính điểm match dựa trên:
        // 1. Tên tương tự (fuzzy match)
        // 2. Khoảng cách từ location
        const resultName = (result.name || result.formatted_address).toLowerCase()
        const nameMatch = GoongService.calculateNameSimilarity(normalizedName, resultName)
        
        // Tính khoảng cách
        const distance = GoongService.calculateDistance(
          lat,
          lng,
          result.geometry.location.lat,
          result.geometry.location.lng,
        )
        const distanceScore = Math.max(0, 1 - distance / radius) // 1 nếu ở cùng chỗ, 0 nếu ở xa

        // Tổng điểm: ưu tiên tên match (70%) và khoảng cách (30%)
        const score = nameMatch * 0.7 + distanceScore * 0.3

        if (score > bestScore) {
          bestScore = score
          bestMatch = result
        }
      }

      // Nếu điểm match quá thấp (< 0.3), không dùng
      if (!bestMatch || bestScore < 0.3) {
        if (__DEV__) {
          console.log(`[GoongService] Low match score (${bestScore.toFixed(2)}) for: ${name}`)
        }
        return null
      }

      // Step 3: Lấy Place Detail từ place_id
      const placeDetail = await GoongService.getPlaceDetail(bestMatch.place_id)
      return placeDetail
    } catch (error) {
      console.error('[GoongService] FindRestaurantInGoong error:', error)
      return null
    }
  },

  /**
   * Tính độ tương tự giữa 2 tên (simple fuzzy match)
   * @param name1 - Tên 1
   * @param name2 - Tên 2
   * @returns Score từ 0 đến 1
   */
  calculateNameSimilarity(name1: string, name2: string): number {
    // Normalize: bỏ dấu, lowercase, trim
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()

    const n1 = normalize(name1)
    const n2 = normalize(name2)

    // Exact match
    if (n1 === n2) return 1.0

    // Contains match
    if (n1.includes(n2) || n2.includes(n1)) return 0.8

    // Word overlap
    const words1 = n1.split(/\s+/)
    const words2 = n2.split(/\s+/)
    const commonWords = words1.filter((w) => words2.includes(w))
    if (commonWords.length > 0) {
      return Math.min(0.6, (commonWords.length / Math.max(words1.length, words2.length)) * 0.8)
    }

    // No match
    return 0.1
  },

  /**
   * Tính khoảng cách giữa 2 điểm (Haversine formula)
   * @param lat1 - Vĩ độ điểm 1
   * @param lng1 - Kinh độ điểm 1
   * @param lat2 - Vĩ độ điểm 2
   * @param lng2 - Kinh độ điểm 2
   * @returns Khoảng cách (mét)
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000 // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },
}

/**
 * Helper function để log service info
 */
export function logGoongServiceInfo() {
  console.log('='.repeat(50))
  console.log('[GoongService] API Key configured:', GOONG_API_KEY ? '✅ Yes' : '❌ No')
  console.log('[GoongService] Base URL:', GOONG_BASE_URL)
  console.log('='.repeat(50))
}

// Log service info in dev mode
if (__DEV__) {
  logGoongServiceInfo()
}

