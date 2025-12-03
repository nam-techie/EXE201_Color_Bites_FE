import { apiService } from './ApiService'

// Restaurant Response từ backend
export interface RestaurantResponse {
   id: string
   name: string
   address: string
   district?: string
   price?: string
   rating?: number
   featured?: boolean
   latitude: number
   longitude: number
   types?: TypeObject[]
   images?: ImageObject[]
   createdById?: string
   createdBy?: string
   createdAt?: string
   updatedAt?: string
   isDeleted?: boolean
   isFavorited?: boolean
   favoriteCount?: number
   distance?: number
}

export interface TypeObject {
   id?: string
   name: string
   emoji?: string
}

export interface ImageObject {
   url: string
   description?: string
}

// Paginated response
export interface PaginatedRestaurantResponse {
   content: RestaurantResponse[]
   totalElements: number
   totalPages: number
   size: number
   number: number
   first: boolean
   last: boolean
}

// Search params
export interface RestaurantSearchParams {
   keyword?: string
   district?: string
   page?: number
   size?: number
}

class RestaurantService {
   /**
    * GET /api/restaurant/search - Tìm kiếm và lấy danh sách nhà hàng (có phân trang)
    * @param params.keyword - Từ khóa tìm kiếm (default = "")
    * @param params.district - Quận/Huyện (optional)
    * @param params.page - Số trang (default = 1)
    * @param params.size - Số lượng mỗi trang (default = 10)
    */
   async searchRestaurants(params: RestaurantSearchParams = {}): Promise<PaginatedRestaurantResponse> {
      try {
         const { keyword = '', district, page = 1, size = 10 } = params
         
         console.log(`📥 Searching restaurants - keyword: "${keyword}", district: "${district || 'all'}", page: ${page}, size: ${size}`)
         
         // Build query params
         const queryParams = new URLSearchParams()
         queryParams.append('keyword', keyword)
         queryParams.append('page', page.toString())
         queryParams.append('size', size.toString())
         if (district && district.trim()) {
            queryParams.append('district', district)
         }
         
         const response = await apiService.get<PaginatedRestaurantResponse>(
            `/api/restaurants/search?${queryParams.toString()}`
         )

         if (response.status === 200 && response.data) {
            console.log(`✅ Fetched ${response.data.content?.length || 0} restaurants (total: ${response.data.totalElements})`)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải danh sách nhà hàng')
      } catch (error) {
         console.error('❌ Error searching restaurants:', error)
         // Return empty response instead of throwing
         return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: params.size || 10,
            number: (params.page || 1) - 1,
            first: true,
            last: true
         }
      }
   }

   /**
    * GET /api/restaurant/search - Lấy tất cả nhà hàng (không filter)
    * Wrapper cho searchRestaurants với keyword rỗng
    */
   async getAllRestaurants(page: number = 1, size: number = 10): Promise<PaginatedRestaurantResponse> {
      return this.searchRestaurants({ page, size })
   }

   /**
    * GET /api/restaurant/{id} - Lấy chi tiết nhà hàng theo ID
    */
   async getRestaurantById(id: string): Promise<RestaurantResponse | null> {
      try {
         console.log('📥 Fetching restaurant by ID:', id)
         
         const response = await apiService.get<RestaurantResponse>(
            `/api/restaurants/read/${id}`
         )

         if (response.status === 200 && response.data) {
            console.log('✅ Fetched restaurant:', response.data.name)
            return response.data
         }

         throw new Error(response.message || 'Không thể tải thông tin nhà hàng')
      } catch (error) {
         console.error('❌ Error fetching restaurant:', error)
         return null
      }
   }
}

// Export singleton instance
export const restaurantService = new RestaurantService()
export default restaurantService
