export interface User {
   id: string
   name: string
   email: string
   username: string
   avatar?: string
   bio?: string
   followers: number
   following: number
   posts: number
   isPremium: boolean
   createdAt: string
}

export interface Post {
   id: string
   user: User
   image: string
   video?: string
   caption: string
   location?: string
   mood: string
   hashtags: string[]
   likes: number
   comments: number
   shares: number
   isPinned: boolean
   isPrivate: boolean
   createdAt: string
   updatedAt: string
}

export interface Comment {
   id: string
   user: User
   post: string
   content: string
   likes: number
   replies: Comment[]
   createdAt: string
}

export interface Location {
   id: string
   name: string
   address: string
   latitude: number
   longitude: number
   posts: number
   rating: number
   image?: string
   description?: string
   category: string
}

export interface Challenge {
   id: string
   title: string
   description: string
   hashtag: string
   startDate: string
   endDate: string
   participants: number
   isPremium: boolean
   reward?: string
}
export interface RouteProfile {
   id: string
   name: string
   icon: string
}

export const ROUTE_PROFILES: RouteProfile[] = [
   { id: 'driving-car', name: 'Ô tô', icon: 'car' },
   { id: 'cycling-regular', name: 'Xe máy', icon: 'bicycle' },
   { id: 'foot-walking', name: 'Đi bộ', icon: 'walk' },
   { id: 'driving-hgv', name: 'Xe tải', icon: 'bus' },
]

export interface RouteStep {
   instruction: string
   distance: number
   duration: number
}

export interface DirectionResult {
   distance: number
   duration: number
   steps: RouteStep[]
   geometry: string
}
