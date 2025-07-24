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
