export interface Restaurant {
  id: number
  name: string
  lat: number
  lon: number
  tags: {
    amenity?: string
    cuisine?: string
    phone?: string
    website?: string
    opening_hours?: string
    "addr:street"?: string
    "addr:housenumber"?: string
    "diet:vegetarian"?: string
    "diet:vegan"?: string
    air_conditioning?: string
    wheelchair?: string
    smoking?: string
    indoor_seating?: string
    outdoor_seating?: string
  }
}

export interface MapRegion {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}
export interface LocationPoint {
  latitude: number
  longitude: number
}
