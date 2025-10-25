import type {
    ApiResponse,
    RestaurantDetail,
    RestaurantFilters,
    RestaurantsPageResponse,
    RestaurantStatistics
} from '../types/restaurant'
import { adminApi } from './adminApi'

class RestaurantsApiService {
  private baseURL = '/api/admin/restaurants'

  // Lấy danh sách restaurants với pagination và filters
  async getRestaurants(
    page: number = 0, 
    size: number = 20, 
    filters?: RestaurantFilters
  ): Promise<ApiResponse<RestaurantsPageResponse>> {
    try {
      console.log('📡 Fetching restaurants:', { page, size, filters })
      
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })

      // Add filters to params
      if (filters?.search) {
        params.append('search', filters.search)
      }
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status)
      }
      if (filters?.type) {
        params.append('type', filters.type)
      }
      if (filters?.region) {
        params.append('region', filters.region)
      }
      if (filters?.minPrice !== undefined) {
        params.append('minPrice', filters.minPrice.toString())
      }
      if (filters?.maxPrice !== undefined) {
        params.append('maxPrice', filters.maxPrice.toString())
      }
      if (filters?.minRating !== undefined) {
        params.append('minRating', filters.minRating.toString())
      }
      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start)
        params.append('endDate', filters.dateRange.end)
      }

      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantsPageResponse>>(
        `${this.baseURL}?${params.toString()}`
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data.content.length} restaurants`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách nhà hàng')
    } catch (error) {
      console.error('❌ Error fetching restaurants:', error)
      throw error
    }
  }

  // Lấy chi tiết restaurant
  async getRestaurantDetail(restaurantId: string): Promise<ApiResponse<RestaurantDetail>> {
    try {
      console.log('📡 Fetching restaurant detail:', restaurantId)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantDetail>>(
        `${this.baseURL}/${restaurantId}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Restaurant detail fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải chi tiết nhà hàng')
    } catch (error) {
      console.error('❌ Error fetching restaurant detail:', error)
      throw error
    }
  }

  // Xóa restaurant (soft delete)
  async deleteRestaurant(restaurantId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Deleting restaurant:', restaurantId)
      
      const response = await adminApi.axiosInstance.delete<ApiResponse<void>>(
        `${this.baseURL}/${restaurantId}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Restaurant deleted successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể xóa nhà hàng')
    } catch (error) {
      console.error('❌ Error deleting restaurant:', error)
      throw error
    }
  }

  // Khôi phục restaurant đã xóa
  async restoreRestaurant(restaurantId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Restoring restaurant:', restaurantId)
      
      const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
        `${this.baseURL}/${restaurantId}/restore`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Restaurant restored successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể khôi phục nhà hàng')
    } catch (error) {
      console.error('❌ Error restoring restaurant:', error)
      throw error
    }
  }

  // Lấy thống kê restaurants
  async getRestaurantStatistics(): Promise<ApiResponse<RestaurantStatistics>> {
    try {
      console.log('📡 Fetching restaurant statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantStatistics>>(
        '/api/admin/statistics/restaurants'
      )
      
      if (response.data.status === 200) {
        console.log('✅ Restaurant statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê nhà hàng')
    } catch (error) {
      console.error('❌ Error fetching restaurant statistics:', error)
      throw error
    }
  }

  // Lấy restaurants theo type
  async getRestaurantsByType(
    type: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<ApiResponse<RestaurantsPageResponse>> {
    try {
      console.log('📡 Fetching restaurants by type:', type)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantsPageResponse>>(
        `${this.baseURL}/type/${type}?page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data.content.length} restaurants by type`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải nhà hàng theo loại')
    } catch (error) {
      console.error('❌ Error fetching restaurants by type:', error)
      throw error
    }
  }

  // Lấy restaurants theo region
  async getRestaurantsByRegion(
    region: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<ApiResponse<RestaurantsPageResponse>> {
    try {
      console.log('📡 Fetching restaurants by region:', region)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantsPageResponse>>(
        `${this.baseURL}/region/${region}?page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data.content.length} restaurants by region`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải nhà hàng theo khu vực')
    } catch (error) {
      console.error('❌ Error fetching restaurants by region:', error)
      throw error
    }
  }

  // Tìm kiếm restaurants
  async searchRestaurants(
    query: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<ApiResponse<RestaurantsPageResponse>> {
    try {
      console.log('📡 Searching restaurants:', query)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantsPageResponse>>(
        `${this.baseURL}/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Found ${response.data.data.content.length} restaurants`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tìm kiếm nhà hàng')
    } catch (error) {
      console.error('❌ Error searching restaurants:', error)
      throw error
    }
  }

  // Lấy featured restaurants
  async getFeaturedRestaurants(
    page: number = 0, 
    size: number = 20
  ): Promise<ApiResponse<RestaurantsPageResponse>> {
    try {
      console.log('📡 Fetching featured restaurants')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantsPageResponse>>(
        `${this.baseURL}/featured?page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log(`✅ Fetched ${response.data.data.content.length} featured restaurants`)
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải nhà hàng nổi bật')
    } catch (error) {
      console.error('❌ Error fetching featured restaurants:', error)
      throw error
    }
  }
}

// Export singleton instance
export const restaurantsApi = new RestaurantsApiService()
export default restaurantsApi
