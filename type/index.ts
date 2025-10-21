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

// API Request/Response Types (match backend exactly)
export interface CreatePostRequest {
   content: string      // @NotBlank, max 5000 chars  
   moodId: string       // max 50 chars
   files?: File[]       // multipart files for upload
}

export interface UpdatePostRequest {
   caption?: string
   location?: string
   mood?: string
   hashtags?: string[]
   isPrivate?: boolean
}

export interface TagResponse {
   id: string
   name: string
}

export interface PostResponse {
   id: string
   accountId: string
   authorName: string        // Tên tác giả từ UserInformation
   authorAvatar: string      // Avatar tác giả từ UserInformation
   content: string
   moodId: string
   moodName: string          // Tên mood
   moodEmoji: string         // Emoji mood
   imageUrls: string[]       // Danh sách URL hình ảnh
   videoUrl?: string         // URL video
   reactionCount: number
   commentCount: number
   tags: TagResponse[]       // Danh sách tags
   isOwner: boolean          // Người xem có phải chủ bài viết không
   hasReacted: boolean       // Người xem đã react chưa
   userReactionType?: string // Loại reaction của người xem
   visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE' // Quyền riêng tư của bài đăng
   createdAt: string
   updatedAt: string
}

export interface ApiResponse<T> {
   status: number
   message: string
   data: T
}

export interface PaginatedResponse<T> {
   content: T[]
   totalElements: number
   totalPages: number
   size: number
   number: number
   first: boolean
   last: boolean
}

// Comment API Types (match backend exactly)
export interface CreateCommentRequest {
   content: string
   parentCommentId?: string
}

export interface CommentResponse {
   id: string
   postId: string
   accountId: string
   authorName: string
   authorAvatar: string
   content: string
   parentCommentId?: string
   depth: number
   createdAt: string
   updatedAt: string
   // Backend có thể trả về nested author object
   author?: {
      accountId: string
      authorName: string
      authorAvatar: string
   }
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

export interface Mood {
   id: string
   name: string
   emoji: string
   description?: string
   createdAt?: string
   postCount?: number
}

// Backend mood response từ API
export interface MoodResponse {
   id: string
   name: string
   emoji: string
   createdAt: string
   postCount: number
}

// Paginated mood list response
export interface MoodListResponse {
   content: MoodResponse[]
   totalElements: number
   totalPages: number
   size: number
   number: number
   first: boolean
   last: boolean
   pageable: {
      pageNumber: number
      pageSize: number
      sort: {
         empty: boolean
         sorted: boolean
         unsorted: boolean
      }
      offset: number
      paged: boolean
      unpaged: boolean
   }
   sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
   }
   numberOfElements: number
   empty: boolean
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

// Payment Types
export interface CreatePaymentRequest {
  amount: number
  description: string
  currency: string
  returnUrl?: string
  cancelUrl?: string
  items: PaymentItem[]
}

export interface PaymentItem {
  name: string
  quantity: number
  price: number
}

export interface PaymentResponse {
  checkoutUrl: string
  paymentLinkId: string
  orderCode: number
  qrCode?: string
  status: string
  createdAt: string
  message: string
}

export interface PaymentStatusResponse {
  transactionId: string
  orderCode: number
  status: string
  amount: number
  description: string
  gatewayName: string
  message: string
  createdAt: string
  updatedAt: string
}
