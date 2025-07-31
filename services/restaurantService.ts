import { apiService } from './api'

// Types
export interface Restaurant {
   id: string
   name: string
   description: string
   address: string
   phone: string
   email: string
   website?: string
   rating: number
   priceRange: 'low' | 'medium' | 'high'
   cuisine: string[]
   images: string[]
   openingHours: {
      [key: string]: {
         open: string
         close: string
         isOpen: boolean
      }
   }
   location: {
      latitude: number
      longitude: number
   }
   features: string[]
   createdAt: string
   updatedAt: string
}

export interface RestaurantSearchParams {
   query?: string
   cuisine?: string
   priceRange?: 'low' | 'medium' | 'high'
   rating?: number
   location?: {
      latitude: number
      longitude: number
      radius?: number // in kilometers
   }
   features?: string[]
   page?: number
   limit?: number
   sortBy?: 'rating' | 'distance' | 'price' | 'name'
   sortOrder?: 'asc' | 'desc'
}

export interface RestaurantResponse {
   success: boolean
   message: string
   data: Restaurant
}

export interface RestaurantsResponse {
   success: boolean
   message: string
   data: {
      restaurants: Restaurant[]
      total: number
      page: number
      limit: number
      totalPages: number
   }
}

export interface Review {
   id: string
   restaurantId: string
   userId: string
   rating: number
   comment: string
   images?: string[]
   createdAt: string
   updatedAt: string
   user: {
      id: string
      username: string
      avatar?: string
   }
}

export interface CreateReviewRequest {
   restaurantId: string
   rating: number
   comment: string
   images?: string[]
}

// Restaurant Service class
class RestaurantService {
   // Get all restaurants with search and filters
   async getRestaurants(params?: RestaurantSearchParams): Promise<RestaurantsResponse> {
      try {
         const queryParams = new URLSearchParams()
         
         if (params?.query) queryParams.append('query', params.query)
         if (params?.cuisine) queryParams.append('cuisine', params.cuisine)
         if (params?.priceRange) queryParams.append('priceRange', params.priceRange)
         if (params?.rating) queryParams.append('rating', params.rating.toString())
         if (params?.page) queryParams.append('page', params.page.toString())
         if (params?.limit) queryParams.append('limit', params.limit.toString())
         if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
         if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)
         
         if (params?.location) {
            queryParams.append('latitude', params.location.latitude.toString())
            queryParams.append('longitude', params.location.longitude.toString())
            if (params.location.radius) {
               queryParams.append('radius', params.location.radius.toString())
            }
         }
         
         if (params?.features) {
            params.features.forEach(feature => {
               queryParams.append('features', feature)
            })
         }

         const url = `/restaurants?${queryParams.toString()}`
         const response = await apiService.get<RestaurantsResponse>(url)
         return response
      } catch (error) {
         console.error('❌ Get restaurants error:', error)
         throw error
      }
   }

   // Get restaurant by ID
   async getRestaurantById(id: string): Promise<RestaurantResponse> {
      try {
         const response = await apiService.get<RestaurantResponse>(`/restaurants/${id}`)
         return response
      } catch (error) {
         console.error('❌ Get restaurant error:', error)
         throw error
      }
   }

   // Get restaurants by cuisine
   async getRestaurantsByCuisine(cuisine: string, params?: Omit<RestaurantSearchParams, 'cuisine'>): Promise<RestaurantsResponse> {
      try {
         const searchParams: RestaurantSearchParams = { ...params, cuisine }
         return await this.getRestaurants(searchParams)
      } catch (error) {
         console.error('❌ Get restaurants by cuisine error:', error)
         throw error
      }
   }

   // Get nearby restaurants
   async getNearbyRestaurants(latitude: number, longitude: number, radius: number = 5): Promise<RestaurantsResponse> {
      try {
         const params: RestaurantSearchParams = {
            location: { latitude, longitude, radius }
         }
         return await this.getRestaurants(params)
      } catch (error) {
         console.error('❌ Get nearby restaurants error:', error)
         throw error
      }
   }

   // Get restaurant reviews
   async getRestaurantReviews(restaurantId: string, page: number = 1, limit: number = 10): Promise<{
      success: boolean
      message: string
      data: {
         reviews: Review[]
         total: number
         page: number
         limit: number
         totalPages: number
      }
   }> {
      try {
         const response = await apiService.get(`/restaurants/${restaurantId}/reviews`, {
            params: { page, limit }
         })
         return response
      } catch (error) {
         console.error('❌ Get restaurant reviews error:', error)
         throw error
      }
   }

   // Create restaurant review
   async createReview(reviewData: CreateReviewRequest): Promise<{
      success: boolean
      message: string
      data: Review
   }> {
      try {
         const response = await apiService.post(`/restaurants/${reviewData.restaurantId}/reviews`, {
            rating: reviewData.rating,
            comment: reviewData.comment,
            images: reviewData.images
         })
         return response
      } catch (error) {
         console.error('❌ Create review error:', error)
         throw error
      }
   }

   // Update restaurant review
   async updateReview(reviewId: string, reviewData: Partial<CreateReviewRequest>): Promise<{
      success: boolean
      message: string
      data: Review
   }> {
      try {
         const response = await apiService.put(`/reviews/${reviewId}`, reviewData)
         return response
      } catch (error) {
         console.error('❌ Update review error:', error)
         throw error
      }
   }

   // Delete restaurant review
   async deleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
      try {
         const response = await apiService.delete(`/reviews/${reviewId}`)
         return response
      } catch (error) {
         console.error('❌ Delete review error:', error)
         throw error
      }
   }

   // Get restaurant recommendations
   async getRecommendations(userId?: string, limit: number = 10): Promise<RestaurantsResponse> {
      try {
         const params: any = { limit }
         if (userId) params.userId = userId
         
         const response = await apiService.get('/restaurants/recommendations', { params })
         return response
      } catch (error) {
         console.error('❌ Get recommendations error:', error)
         throw error
      }
   }

   // Get popular restaurants
   async getPopularRestaurants(limit: number = 10): Promise<RestaurantsResponse> {
      try {
         const response = await apiService.get('/restaurants/popular', {
            params: { limit }
         })
         return response
      } catch (error) {
         console.error('❌ Get popular restaurants error:', error)
         throw error
      }
   }

   // Get trending restaurants
   async getTrendingRestaurants(limit: number = 10): Promise<RestaurantsResponse> {
      try {
         const response = await apiService.get('/restaurants/trending', {
            params: { limit }
         })
         return response
      } catch (error) {
         console.error('❌ Get trending restaurants error:', error)
         throw error
      }
   }

   // Search restaurants
   async searchRestaurants(query: string, params?: Omit<RestaurantSearchParams, 'query'>): Promise<RestaurantsResponse> {
      try {
         const searchParams: RestaurantSearchParams = { ...params, query }
         return await this.getRestaurants(searchParams)
      } catch (error) {
         console.error('❌ Search restaurants error:', error)
         throw error
      }
   }

   // Get cuisines list
   async getCuisines(): Promise<{
      success: boolean
      message: string
      data: string[]
   }> {
      try {
         const response = await apiService.get('/restaurants/cuisines')
         return response
      } catch (error) {
         console.error('❌ Get cuisines error:', error)
         throw error
      }
   }

   // Get features list
   async getFeatures(): Promise<{
      success: boolean
      message: string
      data: string[]
   }> {
      try {
         const response = await apiService.get('/restaurants/features')
         return response
      } catch (error) {
         console.error('❌ Get features error:', error)
         throw error
      }
   }
}

// Create and export restaurant service instance
export const restaurantService = new RestaurantService()

// Export types
export type {
    CreateReviewRequest, Restaurant, RestaurantResponse, RestaurantSearchParams, RestaurantsResponse,
    Review
}

