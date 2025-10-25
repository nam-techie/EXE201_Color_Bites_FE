import { adminApi } from './adminApi'

// System statistics interface
export interface SystemStatistics {
  totalUsers: number
  activeUsers: number
  blockedUsers: number
  totalPosts: number
  deletedPosts: number
  activePosts: number
  totalRestaurants: number
  deletedRestaurants: number
  activeRestaurants: number
  totalTransactions: number
}

// API response wrapper
export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

class StatisticsApiService {
  // Lấy thống kê tổng quan hệ thống
  async getSystemStatistics(): Promise<ApiResponse<SystemStatistics>> {
    try {
      console.log('📡 Fetching system statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<SystemStatistics>>(
        '/api/admin/statistics'
      )
      
      if (response.data.status === 200) {
        console.log('✅ System statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê hệ thống')
    } catch (error) {
      console.error('❌ Error fetching system statistics:', error)
      throw error
    }
  }

  // Lấy thống kê users
  async getUserStatistics(): Promise<ApiResponse<{ totalUsers: number; activeUsers: number }>> {
    try {
      console.log('📡 Fetching user statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<{ totalUsers: number; activeUsers: number }>>(
        '/api/admin/statistics/users'
      )
      
      if (response.data.status === 200) {
        console.log('✅ User statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê người dùng')
    } catch (error) {
      console.error('❌ Error fetching user statistics:', error)
      throw error
    }
  }

  // Lấy thống kê posts
  async getPostStatistics(): Promise<ApiResponse<{ totalPosts: number; activePosts: number; deletedPosts: number }>> {
    try {
      console.log('📡 Fetching post statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<{ totalPosts: number; activePosts: number; deletedPosts: number }>>(
        '/api/admin/statistics/posts'
      )
      
      if (response.data.status === 200) {
        console.log('✅ Post statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê bài viết')
    } catch (error) {
      console.error('❌ Error fetching post statistics:', error)
      throw error
    }
  }

  // Lấy thống kê restaurants
  async getRestaurantStatistics(): Promise<ApiResponse<{ totalRestaurants: number; activeRestaurants: number; deletedRestaurants: number }>> {
    try {
      console.log('📡 Fetching restaurant statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<{ totalRestaurants: number; activeRestaurants: number; deletedRestaurants: number }>>(
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

  // Lấy thống kê doanh thu
  async getRevenueStatistics(): Promise<ApiResponse<{ totalTransactions: number; successfulTransactions: number; failedTransactions: number; pendingTransactions: number }>> {
    try {
      console.log('📡 Fetching revenue statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<{ totalTransactions: number; successfulTransactions: number; failedTransactions: number; pendingTransactions: number }>>(
        '/api/admin/statistics/revenue'
      )
      
      if (response.data.status === 200) {
        console.log('✅ Revenue statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê doanh thu')
    } catch (error) {
      console.error('❌ Error fetching revenue statistics:', error)
      throw error
    }
  }
}

// Export singleton instance
export const statisticsApi = new StatisticsApiService()
export default statisticsApi
