import type {
    ApiResponse,
    RestaurantDetail,
    RestaurantFilters,
    RestaurantsPageResponse
} from '../types/restaurant'
import { adminApi } from './adminApi'

class RestaurantsApiService {
  private baseURL = '/api/admin/restaurants'

  // GET /api/admin/restaurants - Lấy danh sách restaurants với pagination (tương thích với RestaurantsList)
  async getRestaurants(
    page: number = 0, 
    size: number = 10,
    filters?: RestaurantFilters
  ): Promise<ApiResponse<RestaurantsPageResponse>> {
    try {
      console.log(' Fetching restaurants:', { page, size, filters })
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantsPageResponse>>(
        `${this.baseURL}?page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        // Ensure data structure is correct
        const pageData = response.data.data
        if (pageData && pageData.content) {
          console.log(` Fetched ${pageData.content.length} restaurants`)
          return response.data
        } else {
          // Return empty page if structure is wrong
          console.warn('⚠️ Invalid response structure, returning empty page')
          return {
            status: 200,
            message: 'Success',
            data: {
              content: [],
              totalElements: 0,
              totalPages: 0,
              size: size,
              number: page
            }
          }
        }
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách nhà hàng')
    } catch (error: any) {
      console.error('❌ Error fetching restaurants:', error)
      // Return empty response instead of throwing to prevent page crash
      return {
        status: 200,
        message: 'Success',
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: size,
          number: page
        }
      }
    }
  }

  // Alias cho getAllRestaurants
  async getAllRestaurants(
    page: number = 0, 
    size: number = 10
  ): Promise<ApiResponse<RestaurantsPageResponse>> {
    return this.getRestaurants(page, size)
  }

  // GET /api/admin/restaurants/{id} - Lấy chi tiết restaurant (tương thích với RestaurantDetail)
  async getRestaurantDetail(restaurantId: string): Promise<ApiResponse<RestaurantDetail>> {
    try {
      console.log(' Fetching restaurant by id:', restaurantId)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantDetail>>(
        `${this.baseURL}/${restaurantId}`
      )
      
      if (response.data.status === 200) {
        console.log(' Restaurant detail fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải chi tiết nhà hàng')
    } catch (error) {
      console.error('❌ Error fetching restaurant detail:', error)
      throw error
    }
  }

  // Alias cho getRestaurantDetail
  async getRestaurantById(restaurantId: string): Promise<ApiResponse<RestaurantDetail>> {
    return this.getRestaurantDetail(restaurantId)
  }

  // DELETE /api/admin/restaurants/{id} - Xóa restaurant
  async deleteRestaurant(restaurantId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Deleting restaurant:', restaurantId)
      
      const response = await adminApi.axiosInstance.delete<ApiResponse<void>>(
        `${this.baseURL}/${restaurantId}`
      )
      
      if (response.data.status === 200) {
        console.log(' Restaurant deleted successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể xóa nhà hàng')
    } catch (error) {
      console.error('❌ Error deleting restaurant:', error)
      throw error
    }
  }

  // PUT /api/admin/restaurants/{id}/restore - Khôi phục restaurant đã xóa
  async restoreRestaurant(restaurantId: string): Promise<ApiResponse<void>> {
    try {
      console.log('📤 Restoring restaurant:', restaurantId)
      
      const response = await adminApi.axiosInstance.put<ApiResponse<void>>(
        `${this.baseURL}/${restaurantId}/restore`
      )
      
      if (response.data.status === 200) {
        console.log(' Restaurant restored successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể khôi phục nhà hàng')
    } catch (error) {
      console.error('❌ Error restoring restaurant:', error)
      throw error
    }
  }
}

// Export singleton instance
export const restaurantsApi = new RestaurantsApiService()
export default restaurantsApi
