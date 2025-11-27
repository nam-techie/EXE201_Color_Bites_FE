export interface Restaurant {
   id: number | string // Support cả OSM id (number) và Goong place_id (string)
   name: string
   lat: number
   lon: number
   // Goong data fields
   formatted_address?: string // Địa chỉ đầy đủ từ Goong
   place_id?: string // Goong place_id
   tags: {
      amenity?: string
      cuisine?: string
      phone?: string // Từ Goong hoặc OSM
      website?: string // Từ Goong hoặc OSM
      opening_hours?: string
      rating?: number // Rating từ Goong
      'addr:street'?: string
      'addr:housenumber'?: string
      'diet:vegetarian'?: string
      'diet:vegan'?: string
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
