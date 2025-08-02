export interface ORSResponse {
   type: string
   features: Feature[]
   bbox?: number[]
   metadata?: {
      attribution: string
      service: string
      timestamp: number
      query: any
      engine: {
         version: string
         build_date: string
         graph_date: string
      }
   }
}

export interface Feature {
   type: string
   geometry: {
      type: string // usually "LineString"
      coordinates: number[][] // [lon, lat][]
   }
   properties: {
      segments: Segment[]
      summary: {
         distance: number // in meters
         duration: number // in seconds
      }
      way_points: number[]
   }
}

export interface Segment {
   distance: number
   duration: number
   steps: Step[]
}

export interface Step {
   distance: number
   duration: number
   instruction: string
   name: string
   type: number
   way_points: [number, number]
}

export interface RouteProfile {
   id: string
   name: string
   icon: string
   description: string
}

export const ROUTE_PROFILES: RouteProfile[] = [
   { id: 'driving-car', name: 'Ô tô', icon: 'car', description: 'Đường dành cho ô tô' },
   { id: 'driving-hgv', name: 'Xe tải', icon: 'bus', description: 'Đường dành cho xe tải' },
   { id: 'cycling-regular', name: 'Xe đạp', icon: 'bicycle', description: 'Đường dành cho xe đạp' },
   { id: 'foot-walking', name: 'Đi bộ', icon: 'walk', description: 'Đường dành cho người đi bộ' },
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
