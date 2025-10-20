import { GOONG_API_KEY } from '@/constants'

// Goong API Base URL
const GOONG_API_BASE = 'https://rsapi.goong.io'

// Goong Direction API Response Types
interface GoongDirectionResponse {
  status: string
  routes: GoongRoute[]
}

interface GoongRoute {
  overview_polyline: {
    points: string
  }
  legs: GoongLeg[]
  summary: {
    distance: number // in meters
    duration: number // in seconds
  }
}

interface GoongLeg {
  steps: GoongStep[]
  distance: number
  duration: number
}

interface GoongStep {
  distance: number
  duration: number
  instruction: string
  name: string
  maneuver: {
    type: number
  }
}

export interface RouteProfile {
  id: string
  name: string
  icon: string
  description: string
}

// Goong vehicle types
export const ROUTE_PROFILES: RouteProfile[] = [
  { id: 'car', name: 'Ô tô', icon: 'car', description: 'Đường dành cho ô tô' },
  { id: 'bike', name: 'Xe đạp', icon: 'bicycle', description: 'Đường xe đạp' },
  { id: 'taxi', name: 'Taxi', icon: 'taxi', description: 'Tối ưu taxi' },
  { id: 'hd', name: 'Xe máy', icon: 'motorcycle', description: 'Đường xe máy' },
]

export interface DirectionResult {
  distance: number
  duration: number
  steps: Step[]
  geometry: number[][]
  summary: {
    distance: number
    duration: number
  }
}

export interface Step {
  distance: number
  duration: number
  instruction: string
  name: string
  type: number
  way_points: [number, number]
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
 * Get directions using Goong Direction API
 * @param origin - Origin point {lat, lon}
 * @param destination - Destination point {lat, lon}
 * @param vehicle - Vehicle type (car, bike, taxi, hd)
 * @returns Promise<DirectionResult | null>
 */
export async function getDirections(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  vehicle: string = 'car',
): Promise<DirectionResult | null> {
  if (!validateApiKey()) return null

  const params = new URLSearchParams({
    api_key: GOONG_API_KEY,
    origin: `${origin.lat},${origin.lon}`,
    destination: `${destination.lat},${destination.lon}`,
    vehicle: vehicle,
  })

  const url = `${GOONG_API_BASE}/Direction?${params.toString()}`

  try {
    console.log('Fetching Goong directions for vehicle:', vehicle)

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Goong Direction API error:', response.status, errorText)
      throw new Error(`Goong Direction API error: ${response.status}`)
    }

    const data: GoongDirectionResponse = await response.json()
    console.log('Goong Direction Response received:', data.routes?.length, 'routes')

    if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found')
    }

    const route = data.routes[0]
    const summary = route.summary
    const steps = route.legs?.[0]?.steps || []

    // Decode polyline to get coordinates
    const coordinates = decodePolyline(route.overview_polyline.points)

    return {
      distance: summary.distance,
      duration: summary.duration,
      steps: steps.map((step) => ({
        distance: step.distance,
        duration: step.duration,
        instruction: step.instruction,
        name: step.name,
        type: step.maneuver?.type || 0,
        way_points: [0, 0], // Goong doesn't provide way_points
      })),
      geometry: coordinates,
      summary: summary,
    }
  } catch (error) {
    console.error('Error fetching directions from Goong:', error)
    return null
  }
}

/**
 * Get route alternatives (Goong doesn't support alternatives, return single route)
 * @param origin - Origin point
 * @param destination - Destination point
 * @param vehicle - Vehicle type
 * @param alternativeRoutes - Number of alternatives (ignored for Goong)
 * @returns Promise<DirectionResult[] | null>
 */
export async function getRouteAlternatives(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  vehicle: string = 'car',
  alternativeRoutes: number = 2,
): Promise<DirectionResult[] | null> {
  // Goong doesn't support route alternatives, return single route
  const route = await getDirections(origin, destination, vehicle)
  return route ? [route] : null
}

// ---- Mapbox GeoJSON helpers ----
export function formatRouteToGeoJSONFromEncoded(encodedPolyline: string) {
  const coordinates = decodePolyline(encodedPolyline)
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates, // [lng, lat]
    },
    properties: {},
  }
}

/**
 * Get optimized route for multiple waypoints
 * @param waypoints - Array of waypoints {lat, lon}
 * @param vehicle - Vehicle type
 * @returns Promise<DirectionResult | null>
 */
export async function getOptimizedRoute(
  waypoints: { lat: number; lon: number }[],
  vehicle: string = 'car',
): Promise<DirectionResult | null> {
  if (!validateApiKey()) return null

  if (waypoints.length < 2) {
    console.error('At least 2 waypoints required for route optimization')
    return null
  }

  // For Goong, we'll calculate route from first to last waypoint
  // In a real implementation, you might want to use Goong's Trip API
  const origin = waypoints[0]
  const destination = waypoints[waypoints.length - 1]

  return getDirections(origin, destination, vehicle)
}

/**
 * Decode polyline string to coordinates array
 * @param polyline - Encoded polyline string
 * @returns Array of [lng, lat] coordinates
 */
function decodePolyline(polyline: string): number[][] {
  const coordinates: number[][] = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < polyline.length) {
    let shift = 0
    let result = 0
    let b: number

    do {
      b = polyline.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0

    do {
      b = polyline.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += dlng

    coordinates.push([lng / 1e5, lat / 1e5])
  }

  return coordinates
}

// Utility functions
export function formatDistance(distance: number): string {
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  }
  return `${(distance / 1000).toFixed(1)}km`
}

export function formatDuration(duration: number): string {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// Convert Goong coordinates to React Native Maps format
export function convertCoordinatesToMapFormat(
  coordinates: number[][],
): { latitude: number; longitude: number }[] {
  return coordinates.map((coord) => ({
    latitude: coord[1], // Goong uses [lng, lat], we need [lat, lng]
    longitude: coord[0],
  }))
}

// Get instruction icon based on step type
export function getInstructionIcon(stepType: number): string {
  const iconMap: { [key: number]: string } = {
    0: '↑', // Straight
    1: '↗', // Right
    2: '→', // Sharp right
    3: '↘', // Slight right
    4: '↓', // U-turn
    5: '↙', // Slight left
    6: '←', // Sharp left
    7: '↖', // Left
    8: '↑', // Straight
    9: '🚪', // Arrive
    10: '🚗', // Depart
    11: '🔄', // Roundabout
  }

  return iconMap[stepType] || '↑'
}

// Cost Configuration (VND per km) - same as before
export const TRANSPORT_COSTS = {
  car: 3000,
  bike: 0,
  taxi: 5000,
  hd: 2000, // xe máy
} as const

// Calculate estimated fuel cost
export function calculateEstimatedCost(distance: number, vehicle: string): number {
  const distanceInKm = distance / 1000
  const costPerKm = TRANSPORT_COSTS[vehicle as keyof typeof TRANSPORT_COSTS] || 0
  return Math.round(distanceInKm * costPerKm)
}

// Format cost in Vietnamese Dong
export function formatCost(cost: number): string {
  if (cost === 0) return 'Miễn phí'
  return `${cost.toLocaleString('vi-VN')}đ`
}

// Get estimated travel time with traffic (mock implementation)
export function getEstimatedTimeWithTraffic(baseDuration: number, vehicle: string): number {
  const trafficMultipliers: { [key: string]: number } = {
    car: 1.2, // 20% longer due to traffic
    taxi: 1.3, // 30% longer for taxi
    bike: 1.0, // No traffic impact
    hd: 1.1, // 10% longer for motorbike
  }

  const multiplier = trafficMultipliers[vehicle] || 1.0
  return Math.round(baseDuration * multiplier)
}
