/**
 * Goong Service - Place Autocomplete & Details
 * 
 * Service này sử dụng Goong API để:
 * - Autocomplete địa điểm khi người dùng gõ
 * - Lấy chi tiết địa điểm từ place_id
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
}

export interface GoongPlaceDetailResponse {
  result: GoongPlaceDetail
  status: string
}

export interface Location {
  lat: number
  lng: number
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

