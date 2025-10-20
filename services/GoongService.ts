import Constants from 'expo-constants';

type LatLng = { lat: number; lon: number }

interface AutocompleteItemV2 {
  place_id: string
  description: string
}

interface AutocompleteResponseV2 {
  predictions: AutocompleteItemV2[]
}

interface PlaceDetailV2Response {
  result?: {
    name?: string
    formatted_address?: string
    geometry?: {
      location?: { lat: number; lng: number }
    }
    place_id?: string
  }
}

interface DirectionsV2Route {
  overview_polyline?: { points: string }
  legs?: Array<{ distance?: { value: number }; duration?: { value: number } }>
}

interface DirectionsV2Response {
  routes?: DirectionsV2Route[]
}

export interface GoongPlaceSuggestion {
  id: string
  description: string
}

export interface GoongPlaceDetail {
  id: string
  name: string
  address: string
  lat: number
  lon: number
}

export interface GoongDirectionResult {
  distance: number
  duration: number
  polyline: string
}

function getEnv() {
  const extra = Constants.expoConfig?.extra as any
  return {
    apiUrl: (extra?.EXPO_PUBLIC_GOONG_API_URL as string) || 'https://rsapi.goong.io/',
    apiKey: (extra?.EXPO_PUBLIC_GOONG_API_KEY as string) || '',
  }
}

export const GoongService = {
  async autocompleteV2(query: string, location?: LatLng): Promise<GoongPlaceSuggestion[]> {
    const { apiUrl, apiKey } = getEnv()
    if (!apiKey) return []

    const url = new URL('Place/AutoComplete', apiUrl)
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('input', query)
    if (location) {
      url.searchParams.set('location', `${location.lat},${location.lon}`)
    }

    const res = await fetch(url.toString())
    if (!res.ok) return []
    const data: AutocompleteResponseV2 = await res.json()
    return (data.predictions || []).map((p) => ({ id: p.place_id, description: p.description }))
  },

  async placeDetailV2(placeId: string): Promise<GoongPlaceDetail | null> {
    const { apiUrl, apiKey } = getEnv()
    if (!apiKey) return null

    const url = new URL('Place/Detail', apiUrl)
    url.searchParams.set('place_id', placeId)
    url.searchParams.set('api_key', apiKey)

    const res = await fetch(url.toString())
    if (!res.ok) return null
    const data: PlaceDetailV2Response = await res.json()
    const r = data.result
    if (!r?.geometry?.location) return null
    return {
      id: r.place_id || placeId,
      name: r.name || '',
      address: r.formatted_address || '',
      lat: r.geometry.location.lat,
      lon: r.geometry.location.lng,
    }
  },

  async directionsV2(origin: LatLng, destination: LatLng, vehicle: 'car' | 'bike' | 'foot' = 'car'):
    Promise<GoongDirectionResult | null> {
    const { apiUrl, apiKey } = getEnv()
    if (!apiKey) return null

    const url = new URL('Direction', apiUrl)
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('origin', `${origin.lat},${origin.lon}`)
    url.searchParams.set('destination', `${destination.lat},${destination.lon}`)
    url.searchParams.set('vehicle', vehicle)

    const res = await fetch(url.toString())
    if (!res.ok) return null
    const data: DirectionsV2Response = await res.json()
    const route = data.routes?.[0]
    if (!route?.overview_polyline?.points) return null

    const distance = route.legs?.reduce((sum, l) => sum + (l.distance?.value || 0), 0) || 0
    const duration = route.legs?.reduce((sum, l) => sum + (l.duration?.value || 0), 0) || 0

    return {
      distance,
      duration,
      polyline: route.overview_polyline.points,
    }
  },
}

// Polyline decoder (Google encoded polyline)
export function decodePolyline(encoded: string): Array<{ latitude: number; longitude: number }> {
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0
  const path: Array<{ latitude: number; longitude: number }> = []

  while (index < len) {
    let b = 0
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

    path.push({ latitude: lat / 1e5, longitude: lng / 1e5 })
  }
  return path
}


