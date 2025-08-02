import {
   DEFAULT_ROUTE_ALTERNATIVES,
   OPENROUTE_API_KEY,
   ROUTE_OPTIMIZATION_PARAMS,
   TRANSPORT_COSTS,
} from '@/constants'
import { DirectionResult, ORSResponse } from '@/type/direction'

// Validate API key
function validateApiKey(): boolean {
   if (!OPENROUTE_API_KEY) {
      console.error(
         'OpenRouteService API key not configured. Please set EXPO_PUBLIC_OPENROUTE_API_KEY in your environment.',
      )
      return false
   }
   return true
}

export async function getDirections(
   origin: { lat: number; lon: number },
   destination: { lat: number; lon: number },
   profile = 'driving-car',
): Promise<DirectionResult | null> {
   if (!validateApiKey()) return null

   const baseUrl = `https://api.openrouteservice.org/v2/directions/${profile}`
   const params = new URLSearchParams({
      api_key: OPENROUTE_API_KEY,
      start: `${origin.lon},${origin.lat}`,
      end: `${destination.lon},${destination.lat}`,
      format: 'geojson',
      geometry_format: 'geojson',
      instructions: 'true',
      elevation: 'false',
   })

   const url = `${baseUrl}?${params.toString()}`

   try {
      console.log('Fetching ORS directions for profile:', profile)

      const res = await fetch(url, {
         headers: {
            Accept: 'application/json, application/geo+json',
            'Content-Type': 'application/json',
         },
      })

      if (!res.ok) {
         const errorText = await res.text()
         console.error('OpenRouteService API error:', res.status, errorText)
         throw new Error(`OpenRouteService API error: ${res.status}`)
      }

      const data: ORSResponse = await res.json()
      console.log('ORS Response received:', data.features?.length, 'features')

      if (!data.features || data.features.length === 0) {
         throw new Error('No route found')
      }

      const feature = data.features[0]
      const properties = feature.properties
      const geometry = feature.geometry

      return {
         distance: properties.summary.distance,
         duration: properties.summary.duration,
         steps: properties.segments?.[0]?.steps || [],
         geometry: geometry.coordinates,
         summary: properties.summary,
      }
   } catch (error) {
      console.error('Error fetching directions from ORS:', error)
      return null
   }
}

// Multi-point route optimization
export async function getOptimizedRoute(
   waypoints: { lat: number; lon: number }[],
   profile = 'driving-car',
): Promise<DirectionResult | null> {
   if (!validateApiKey()) return null

   if (waypoints.length < 2) {
      console.error('At least 2 waypoints required for route optimization')
      return null
   }

   const coordinates = waypoints.map((point) => [point.lon, point.lat])

   const requestBody = {
      coordinates,
      format: 'geojson',
      instructions: true,
      geometry_format: 'geojson',
      elevation: false,
   }

   const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`

   try {
      console.log('Fetching optimized route for', waypoints.length, 'waypoints')

      const res = await fetch(url, {
         method: 'POST',
         headers: {
            Accept: 'application/json, application/geo+json',
            'Content-Type': 'application/json',
            Authorization: OPENROUTE_API_KEY,
         },
         body: JSON.stringify(requestBody),
      })

      if (!res.ok) {
         const errorText = await res.text()
         console.error('OpenRouteService optimization error:', res.status, errorText)
         throw new Error(`OpenRouteService optimization error: ${res.status}`)
      }

      const data: ORSResponse = await res.json()

      if (!data.features || data.features.length === 0) {
         throw new Error('No optimized route found')
      }

      const feature = data.features[0]
      const properties = feature.properties
      const geometry = feature.geometry

      return {
         distance: properties.summary.distance,
         duration: properties.summary.duration,
         steps: properties.segments?.flatMap((segment) => segment.steps) || [],
         geometry: geometry.coordinates,
         summary: properties.summary,
      }
   } catch (error) {
      console.error('Error fetching optimized route from ORS:', error)
      return null
   }
}

// Route alternatives
export async function getRouteAlternatives(
   origin: { lat: number; lon: number },
   destination: { lat: number; lon: number },
   profile = 'driving-car',
   alternativeRoutes = DEFAULT_ROUTE_ALTERNATIVES,
): Promise<DirectionResult[] | null> {
   if (!validateApiKey()) return null

   const requestBody = {
      coordinates: [
         [origin.lon, origin.lat],
         [destination.lon, destination.lat],
      ],
      format: 'geojson',
      instructions: true,
      geometry_format: 'geojson',
      elevation: false,
      alternative_routes: {
         target_count: alternativeRoutes,
         weight_factor: ROUTE_OPTIMIZATION_PARAMS.weight_factor,
         share_factor: ROUTE_OPTIMIZATION_PARAMS.share_factor,
      },
   }

   const url = `https://api.openrouteservice.org/v2/directions/${profile}/geojson`

   try {
      console.log('Fetching route alternatives')

      const res = await fetch(url, {
         method: 'POST',
         headers: {
            Accept: 'application/json, application/geo+json',
            'Content-Type': 'application/json',
            Authorization: OPENROUTE_API_KEY,
         },
         body: JSON.stringify(requestBody),
      })

      if (!res.ok) {
         const errorText = await res.text()
         console.error('OpenRouteService alternatives error:', res.status, errorText)
         throw new Error(`OpenRouteService alternatives error: ${res.status}`)
      }

      const data: ORSResponse = await res.json()

      if (!data.features || data.features.length === 0) {
         throw new Error('No alternative routes found')
      }

      return data.features.map((feature) => ({
         distance: feature.properties.summary.distance,
         duration: feature.properties.summary.duration,
         steps: feature.properties.segments?.flatMap((segment) => segment.steps) || [],
         geometry: feature.geometry.coordinates,
         summary: feature.properties.summary,
      }))
   } catch (error) {
      console.error('Error fetching route alternatives from ORS:', error)
      return null
   }
}

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

// Convert ORS coordinates to React Native Maps format
export function convertCoordinatesToMapFormat(
   coordinates: number[][],
): { latitude: number; longitude: number }[] {
   return coordinates.map((coord) => ({
      latitude: coord[1], // ORS uses [lon, lat], we need [lat, lon]
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

// Calculate estimated fuel cost
export function calculateEstimatedCost(distance: number, profile: string): number {
   const distanceInKm = distance / 1000
   const costPerKm = TRANSPORT_COSTS[profile as keyof typeof TRANSPORT_COSTS] || 0
   return Math.round(distanceInKm * costPerKm)
}

// Format cost in Vietnamese Dong
export function formatCost(cost: number): string {
   if (cost === 0) return 'Miễn phí'
   return `${cost.toLocaleString('vi-VN')}đ`
}

// Get estimated travel time with traffic (mock implementation)
export function getEstimatedTimeWithTraffic(baseDuration: number, profile: string): number {
   const trafficMultipliers: { [key: string]: number } = {
      'driving-car': 1.2, // 20% longer due to traffic
      'driving-hgv': 1.3, // 30% longer for trucks
      'cycling-regular': 1.0, // No traffic impact
      'foot-walking': 1.0, // No traffic impact
   }

   const multiplier = trafficMultipliers[profile] || 1.0
   return Math.round(baseDuration * multiplier)
}
