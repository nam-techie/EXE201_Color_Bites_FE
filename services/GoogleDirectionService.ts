/**
 * Google Directions API Service
 * 
 * Service này sử dụng Google Directions API để tính toán chỉ đường giữa các điểm
 * Thay thế cho OpenRouteService API trong DirectionService.ts
 * 
 * API Documentation: https://developers.google.com/maps/documentation/directions
 */

import type { DirectionResult, RouteProfile, Step } from './DirectionService'

// Sẽ được import từ constants sau khi cấu hình
let GOOGLE_MAPS_API_KEY = ''

/**
 * Set Google Maps API Key
 */
export function setGoogleMapsApiKey(apiKey: string) {
  GOOGLE_MAPS_API_KEY = apiKey
}

/**
 * Validate API key
 */
function validateApiKey(): boolean {
  if (!GOOGLE_MAPS_API_KEY) {
    console.error(
      '[GoogleDirectionService] API key not configured. Please set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.',
    )
    return false
  }
  return true
}

/**
 * Google Directions API Travel Modes
 * Map từ profile IDs của app sang Google travel modes
 */
const TRAVEL_MODE_MAP: { [key: string]: string } = {
  'driving-car': 'driving',
  'driving-hgv': 'driving', // Google không có riêng cho truck, dùng driving
  'cycling-regular': 'bicycling',
  'foot-walking': 'walking',
}

/**
 * Route profiles tương thích với Google Maps
 */
export const GOOGLE_ROUTE_PROFILES: RouteProfile[] = [
  { id: 'driving-car', name: 'Ô tô', icon: 'car', description: 'Đường dành cho ô tô' },
  { id: 'cycling-regular', name: 'Xe đạp', icon: 'bicycle', description: 'Đường dành cho xe đạp' },
  { id: 'foot-walking', name: 'Đi bộ', icon: 'walk', description: 'Đường dành cho người đi bộ' },
]

/**
 * Get directions using Google Directions API
 * 
 * @param origin - Điểm xuất phát {lat, lon}
 * @param destination - Điểm đến {lat, lon}
 * @param profile - Loại phương tiện (driving-car, cycling-regular, foot-walking)
 * @returns Promise<DirectionResult | null>
 * 
 * @example
 * const route = await getDirections(
 *   { lat: 10.762622, lon: 106.660172 },
 *   { lat: 10.771999, lon: 106.698000 },
 *   'driving-car'
 * )
 */
export async function getDirections(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  profile = 'driving-car',
): Promise<DirectionResult | null> {
  if (!validateApiKey()) return null

  const travelMode = TRAVEL_MODE_MAP[profile] || 'driving'
  const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json'

  const params = new URLSearchParams({
    origin: `${origin.lat},${origin.lon}`,
    destination: `${destination.lat},${destination.lon}`,
    mode: travelMode,
    key: GOOGLE_MAPS_API_KEY,
    // Thêm alternatives để có thể lấy nhiều route
    alternatives: 'false',
    // Yêu cầu trả về polyline encoded
    // Google mặc định trả encoded polyline, cần decode
  })

  const url = `${baseUrl}?${params.toString()}`

  try {
    console.log('[GoogleDirectionService] Fetching directions for mode:', travelMode)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[GoogleDirectionService] API error:', response.status, errorText)
      throw new Error(`Google Directions API error: ${response.status}`)
    }

    const data = await response.json()

    // Kiểm tra status
    if (data.status !== 'OK') {
      console.error('[GoogleDirectionService] API returned error status:', data.status)
      
      if (data.status === 'ZERO_RESULTS') {
        console.error('[GoogleDirectionService] No route found between these points')
      } else if (data.status === 'REQUEST_DENIED') {
        console.error('[GoogleDirectionService] API key bị từ chối. Kiểm tra lại API key và permissions.')
      } else if (data.status === 'OVER_QUERY_LIMIT') {
        console.error('[GoogleDirectionService] Đã vượt quá giới hạn request. Hãy chuyển sang OpenRouteService.')
      }
      
      return null
    }

    if (!data.routes || data.routes.length === 0) {
      console.error('[GoogleDirectionService] No routes found')
      return null
    }

    const route = data.routes[0]
    const leg = route.legs[0] // Lấy leg đầu tiên (origin -> destination)

    console.log('[GoogleDirectionService] Route found:', leg.distance.text, leg.duration.text)

    // Decode polyline từ overview_polyline
    const geometry = decodePolyline(route.overview_polyline.points)

    // Transform steps từ Google format sang app format
    const steps: Step[] = leg.steps.map((step: any, index: number) => ({
      distance: step.distance.value, // meters
      duration: step.duration.value, // seconds
      instruction: stripHtmlTags(step.html_instructions),
      name: step.maneuver || '',
      type: getStepTypeFromManeuver(step.maneuver),
      way_points: [index, index + 1] as [number, number],
    }))

    return {
      distance: leg.distance.value, // meters
      duration: leg.duration.value, // seconds
      steps,
      geometry, // [[lon, lat], [lon, lat], ...]
      summary: {
        distance: leg.distance.value,
        duration: leg.duration.value,
      },
    }
  } catch (error) {
    console.error('[GoogleDirectionService] Error fetching directions:', error)
    return null
  }
}

/**
 * Get optimized route for multiple waypoints
 * Sử dụng waypoint optimization của Google
 * 
 * @param waypoints - Mảng các điểm {lat, lon}
 * @param profile - Loại phương tiện
 * @returns Promise<DirectionResult | null>
 */
export async function getOptimizedRoute(
  waypoints: { lat: number; lon: number }[],
  profile = 'driving-car',
): Promise<DirectionResult | null> {
  if (!validateApiKey()) return null

  if (waypoints.length < 2) {
    console.error('[GoogleDirectionService] At least 2 waypoints required')
    return null
  }

  const travelMode = TRAVEL_MODE_MAP[profile] || 'driving'
  const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json'

  // Điểm đầu và cuối
  const origin = waypoints[0]
  const destination = waypoints[waypoints.length - 1]
  
  // Các điểm giữa (nếu có)
  const middleWaypoints = waypoints.slice(1, -1)

  const params: any = {
    origin: `${origin.lat},${origin.lon}`,
    destination: `${destination.lat},${destination.lon}`,
    mode: travelMode,
    key: GOOGLE_MAPS_API_KEY,
    optimize: 'true', // Tối ưu thứ tự waypoints
  }

  if (middleWaypoints.length > 0) {
    // Format: "lat,lon|lat,lon|..."
    params.waypoints = middleWaypoints
      .map((wp) => `${wp.lat},${wp.lon}`)
      .join('|')
  }

  const url = `${baseUrl}?${new URLSearchParams(params).toString()}`

  try {
    console.log('[GoogleDirectionService] Fetching optimized route for', waypoints.length, 'waypoints')

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Directions API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('[GoogleDirectionService] Optimization error:', data.status)
      return null
    }

    const route = data.routes[0]
    
    // Tính tổng distance và duration từ tất cả legs
    let totalDistance = 0
    let totalDuration = 0
    const allSteps: Step[] = []
    
    route.legs.forEach((leg: any) => {
      totalDistance += leg.distance.value
      totalDuration += leg.duration.value
      
      leg.steps.forEach((step: any, index: number) => {
        allSteps.push({
          distance: step.distance.value,
          duration: step.duration.value,
          instruction: stripHtmlTags(step.html_instructions),
          name: step.maneuver || '',
          type: getStepTypeFromManeuver(step.maneuver),
          way_points: [index, index + 1] as [number, number],
        })
      })
    })

    const geometry = decodePolyline(route.overview_polyline.points)

    console.log('[GoogleDirectionService] Optimized route:', totalDistance, 'm,', totalDuration, 's')

    return {
      distance: totalDistance,
      duration: totalDuration,
      steps: allSteps,
      geometry,
      summary: {
        distance: totalDistance,
        duration: totalDuration,
      },
    }
  } catch (error) {
    console.error('[GoogleDirectionService] Error fetching optimized route:', error)
    return null
  }
}

/**
 * Get route alternatives
 * Google Directions API hỗ trợ alternatives
 * 
 * @param origin - Điểm xuất phát
 * @param destination - Điểm đến
 * @param profile - Loại phương tiện
 * @param alternativeRoutes - Số lượng route thay thế (max 3)
 * @returns Promise<DirectionResult[] | null>
 */
export async function getRouteAlternatives(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  profile = 'driving-car',
  alternativeRoutes = 2,
): Promise<DirectionResult[] | null> {
  if (!validateApiKey()) return null

  const travelMode = TRAVEL_MODE_MAP[profile] || 'driving'
  const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json'

  const params = new URLSearchParams({
    origin: `${origin.lat},${origin.lon}`,
    destination: `${destination.lat},${destination.lon}`,
    mode: travelMode,
    alternatives: 'true', // Yêu cầu alternatives
    key: GOOGLE_MAPS_API_KEY,
  })

  const url = `${baseUrl}?${params.toString()}`

  try {
    console.log('[GoogleDirectionService] Fetching route alternatives')

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Directions API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('[GoogleDirectionService] Alternatives error:', data.status)
      return null
    }

    if (!data.routes || data.routes.length === 0) {
      return null
    }

    // Giới hạn số lượng alternatives
    const routes = data.routes.slice(0, alternativeRoutes + 1)

    console.log('[GoogleDirectionService] Found', routes.length, 'alternative routes')

    return routes.map((route: any) => {
      const leg = route.legs[0]
      const geometry = decodePolyline(route.overview_polyline.points)
      
      const steps: Step[] = leg.steps.map((step: any, index: number) => ({
        distance: step.distance.value,
        duration: step.duration.value,
        instruction: stripHtmlTags(step.html_instructions),
        name: step.maneuver || '',
        type: getStepTypeFromManeuver(step.maneuver),
        way_points: [index, index + 1] as [number, number],
      }))

      return {
        distance: leg.distance.value,
        duration: leg.duration.value,
        steps,
        geometry,
        summary: {
          distance: leg.distance.value,
          duration: leg.duration.value,
        },
      }
    })
  } catch (error) {
    console.error('[GoogleDirectionService] Error fetching alternatives:', error)
    return null
  }
}

/**
 * Decode Google Polyline encoded string
 * Algorithm: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 * 
 * @param encoded - Encoded polyline string
 * @returns Array of [lon, lat] coordinates
 */
function decodePolyline(encoded: string): number[][] {
  const points: number[][] = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b: number
    let shift = 0
    let result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += dlng

    // Google trả về [lat, lng], nhưng app cần [lon, lat]
    points.push([lng / 1e5, lat / 1e5])
  }

  return points
}

/**
 * Strip HTML tags from Google instructions
 * Google trả về HTML như "<b>Turn left</b> onto Main St"
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Map Google maneuver types to app step types
 */
function getStepTypeFromManeuver(maneuver?: string): number {
  if (!maneuver) return 0

  const maneuverMap: { [key: string]: number } = {
    'turn-left': 7,
    'turn-right': 1,
    'turn-slight-left': 5,
    'turn-slight-right': 3,
    'turn-sharp-left': 6,
    'turn-sharp-right': 2,
    'uturn-left': 4,
    'uturn-right': 4,
    'straight': 0,
    'ramp-left': 7,
    'ramp-right': 1,
    'merge': 0,
    'fork-left': 5,
    'fork-right': 3,
    'roundabout-left': 11,
    'roundabout-right': 11,
  }

  return maneuverMap[maneuver] || 0
}

// Re-export utility functions từ DirectionService.ts để compatibility
export {
    calculateEstimatedCost, convertCoordinatesToMapFormat, formatCost, formatDistance,
    formatDuration, getEstimatedTimeWithTraffic, getInstructionIcon
} from './DirectionService'

