// Restaurant response interface từ backend API
export interface RestaurantResponse {
  id: string
  name: string
  address: string
  longitude: number
  latitude: number
  description: string
  type: string
  region: string
  avgPrice: number
  rating: number
  featured: boolean
  createdBy: string
  createdByName: string
  createdAt: string
  isDeleted: boolean
  creatorEmail: string
  creatorIsActive: boolean
  creatorRole: string
  favoriteCount: number
}

// Restaurants page response với pagination
export interface RestaurantsPageResponse {
  content: RestaurantResponse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// API response wrapper
export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

// Restaurant filters interface
export interface RestaurantFilters {
  search?: string
  status?: 'all' | 'active' | 'deleted' | 'featured'
  type?: string
  region?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  dateRange?: {
    start: string
    end: string
  }
}

// Restaurant statistics interface
export interface RestaurantStatistics {
  totalRestaurants: number
  activeRestaurants: number
  deletedRestaurants: number
  featuredRestaurants: number
  averageRating: number
  totalFavorites: number
  averagePrice: number
}

// Restaurant detail interface (extended with additional info)
export interface RestaurantDetail extends RestaurantResponse {
  images?: Array<{
    id: string
    url: string
    alt?: string
    isMain?: boolean
  }>
  tags?: Array<{
    id: string
    name: string
  }>
  reviews?: Array<{
    id: string
    content: string
    rating: number
    userId: string
    userName: string
    createdAt: string
  }>
  menu?: Array<{
    id: string
    name: string
    price: number
    description: string
    category: string
  }>
  hours?: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
}

// Restaurant action types
export type RestaurantAction = 'view' | 'edit' | 'delete' | 'restore' | 'feature' | 'unfeature'

// Restaurant status enum
export enum RestaurantStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  FEATURED = 'featured'
}

// Restaurant status labels
export const RESTAURANT_STATUS_LABELS = {
  [RestaurantStatus.ACTIVE]: 'Hoạt động',
  [RestaurantStatus.DELETED]: 'Đã xóa',
  [RestaurantStatus.FEATURED]: 'Nổi bật'
} as const

// Restaurant status colors
export const RESTAURANT_STATUS_COLORS = {
  [RestaurantStatus.ACTIVE]: '#52c41a',
  [RestaurantStatus.DELETED]: '#ff4d4f',
  [RestaurantStatus.FEATURED]: '#1890ff'
} as const

// Restaurant types
export const RESTAURANT_TYPES = {
  VIETNAMESE: 'Vietnamese',
  CHINESE: 'Chinese',
  JAPANESE: 'Japanese',
  KOREAN: 'Korean',
  THAI: 'Thai',
  WESTERN: 'Western',
  FAST_FOOD: 'Fast Food',
  CAFE: 'Cafe',
  DESSERT: 'Dessert',
  OTHER: 'Other'
} as const

// Restaurant regions
export const RESTAURANT_REGIONS = {
  HO_CHI_MINH: 'Ho Chi Minh City',
  HANOI: 'Hanoi',
  DA_NANG: 'Da Nang',
  CAN_THO: 'Can Tho',
  HAI_PHONG: 'Hai Phong',
  OTHER: 'Other'
} as const

// Price ranges
export const PRICE_RANGES = {
  BUDGET: { min: 0, max: 100000, label: 'Dưới 100k' },
  MODERATE: { min: 100000, max: 300000, label: '100k - 300k' },
  EXPENSIVE: { min: 300000, max: 500000, label: '300k - 500k' },
  LUXURY: { min: 500000, max: Infinity, label: 'Trên 500k' }
} as const

// Rating levels
export const RATING_LEVELS = {
  EXCELLENT: { min: 4.5, max: 5, label: 'Xuất sắc (4.5+)' },
  GOOD: { min: 4, max: 4.5, label: 'Tốt (4.0-4.5)' },
  AVERAGE: { min: 3, max: 4, label: 'Trung bình (3.0-4.0)' },
  POOR: { min: 0, max: 3, label: 'Kém (dưới 3.0)' }
} as const
