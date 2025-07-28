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
