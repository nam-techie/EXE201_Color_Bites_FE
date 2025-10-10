/**
 * Google Geocoding API Service
 * 
 * Service này sử dụng Google Geocoding API để:
 * - Chuyển địa chỉ thành tọa độ (Geocoding)
 * - Chuyển tọa độ thành địa chỉ (Reverse Geocoding)
 * - Tìm kiếm địa chỉ với autocomplete
 * 
 * API Documentation: https://developers.google.com/maps/documentation/geocoding
 */

// Sẽ được import từ constants
let GOOGLE_MAPS_API_KEY = ''

/**
 * Set Google Maps API Key
 */
export function setGoogleMapsApiKey(apiKey: string) {
  GOOGLE_MAPS_API_KEY = apiKey
}

/**
 * Validate API Key
 */
function validateApiKey(): boolean {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error('[GoogleGeocodingService] API key not configured')
    return false
  }
  return true
}

/**
 * Geocoding - Chuyển địa chỉ thành tọa độ
 * 
 * @param address - Địa chỉ cần tìm
 * @returns Promise với {lat, lng, formatted_address} hoặc null
 */
export async function geocodeAddress(address: string): Promise<{
  lat: number
  lng: number
  formatted_address: string
  place_id: string
} | null> {
  if (!validateApiKey() || !address.trim()) return null

  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json'
  const params = new URLSearchParams({
    address: address,
    key: GOOGLE_MAPS_API_KEY,
  })

  try {
    console.log('[GoogleGeocodingService] Geocoding address:', address)
    
    const response = await fetch(`${baseUrl}?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('[GoogleGeocodingService] Geocoding error:', data.status)
      return null
    }

    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formatted_address: result.formatted_address,
        place_id: result.place_id,
      }
    }

    return null
  } catch (error) {
    console.error('[GoogleGeocodingService] Error geocoding address:', error)
    return null
  }
}

/**
 * Reverse Geocoding - Chuyển tọa độ thành địa chỉ
 * 
 * @param lat - Vĩ độ
 * @param lng - Kinh độ
 * @returns Promise với formatted_address hoặc null
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  if (!validateApiKey()) return null

  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json'
  const params = new URLSearchParams({
    latlng: `${lat},${lng}`,
    key: GOOGLE_MAPS_API_KEY,
  })

  try {
    console.log('[GoogleGeocodingService] Reverse geocoding:', lat, lng)
    
    const response = await fetch(`${baseUrl}?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Reverse Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('[GoogleGeocodingService] Reverse geocoding error:', data.status)
      return null
    }

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address
    }

    return null
  } catch (error) {
    console.error('[GoogleGeocodingService] Error reverse geocoding:', error)
    return null
  }
}

/**
 * Places Autocomplete - Tìm kiếm địa chỉ với gợi ý
 * 
 * @param input - Chuỗi tìm kiếm
 * @param location - Vị trí hiện tại để ưu tiên kết quả gần (optional)
 * @param radius - Bán kính ưu tiên (mét)
 * @returns Promise với danh sách suggestions
 */
export async function autocompleteSearch(
  input: string,
  location?: { lat: number; lng: number },
  radius: number = 5000,
): Promise<Array<{
  place_id: string
  description: string
  main_text: string
  secondary_text: string
}>> {
  if (!validateApiKey() || !input.trim()) return []

  const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
  
  const params: any = {
    input: input,
    key: GOOGLE_MAPS_API_KEY,
    language: 'vi', // Tiếng Việt
  }

  if (location) {
    params.location = `${location.lat},${location.lng}`
    params.radius = radius.toString()
  }

  try {
    const response = await fetch(`${baseUrl}?${new URLSearchParams(params).toString()}`)
    
    if (!response.ok) {
      throw new Error(`Autocomplete API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('[GoogleGeocodingService] Autocomplete error:', data.status)
      return []
    }

    if (data.predictions && data.predictions.length > 0) {
      return data.predictions.map((prediction: any) => ({
        place_id: prediction.place_id,
        description: prediction.description,
        main_text: prediction.structured_formatting?.main_text || prediction.description,
        secondary_text: prediction.structured_formatting?.secondary_text || '',
      }))
    }

    return []
  } catch (error) {
    console.error('[GoogleGeocodingService] Error autocomplete search:', error)
    return []
  }
}

/**
 * Get Place Details by Place ID
 * 
 * @param placeId - Google Place ID từ autocomplete
 * @returns Promise với {lat, lng, formatted_address}
 */
export async function getPlaceDetails(placeId: string): Promise<{
  lat: number
  lng: number
  formatted_address: string
  name: string
} | null> {
  if (!validateApiKey() || !placeId.trim()) return null

  const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json'
  
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'name,geometry,formatted_address',
    key: GOOGLE_MAPS_API_KEY,
  })

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Place Details API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('[GoogleGeocodingService] Place details error:', data.status)
      return null
    }

    if (data.result) {
      return {
        lat: data.result.geometry.location.lat,
        lng: data.result.geometry.location.lng,
        formatted_address: data.result.formatted_address,
        name: data.result.name || '',
      }
    }

    return null
  } catch (error) {
    console.error('[GoogleGeocodingService] Error getting place details:', error)
    return null
  }
}

