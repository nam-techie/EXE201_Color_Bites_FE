import type { ApiResponse } from '../types/user'
import { adminApi } from './adminApi'

// Statistics response types
export interface SystemStatistics {
  [key: string]: any
}

export interface UserStatisticsResponse {
  [key: string]: any
}

export interface PostStatisticsResponse {
  [key: string]: any
}

export interface RestaurantStatisticsResponse {
  [key: string]: any
}

export interface RevenueStatisticsResponse {
  [key: string]: any
}

export interface EngagementStatisticsResponse {
  [key: string]: any
}

export interface ChallengeStatisticsResponse {
  [key: string]: any
}

class StatisticsApiService {
  // GET /api/admin/statistics - Lấy thống kê tổng quan hệ thống
  async getSystemStatistics(): Promise<ApiResponse<SystemStatistics>> {
    try {
      console.log(' Fetching system statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<SystemStatistics>>(
        '/api/admin/statistics'
      )
      
      if (response.data.status === 200) {
        console.log(' System statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê hệ thống')
    } catch (error) {
      console.error('Error fetching system statistics:', error)
      throw error
    }
  }

  // GET /api/admin/statistics/users - Lấy thống kê users
  async getUserStatistics(): Promise<ApiResponse<UserStatisticsResponse>> {
    try {
      console.log(' Fetching user statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<UserStatisticsResponse>>(
        '/api/admin/statistics/users'
      )
      
      if (response.data.status === 200) {
        console.log(' User statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê người dùng')
    } catch (error) {
      console.error('Error fetching post statistics:', error)
      throw error
    }
  }

  // GET /api/admin/statistics/posts - Lấy thống kê posts
  async getPostStatistics(): Promise<ApiResponse<PostStatisticsResponse>> {
    try {
      console.log(' Fetching post statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<PostStatisticsResponse>>(
        '/api/admin/statistics/posts'
      )
      
      if (response.data.status === 200) {
        console.log(' Post statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê bài viết')
    } catch (error) {
      console.error('Error fetching revenue statistics:', error)
      throw error
    }
  }

  // GET /api/admin/statistics/restaurants - Lấy thống kê restaurants
  async getRestaurantStatistics(): Promise<ApiResponse<RestaurantStatisticsResponse>> {
    try {
      console.log(' Fetching restaurant statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantStatisticsResponse>>(
        '/api/admin/statistics/restaurants'
      )
      
      if (response.data.status === 200) {
        console.log(' Restaurant statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê nhà hàng')
    } catch (error) {
      console.error('Error fetching engagement statistics:', error)
      throw error
    }
  }

  // GET /api/admin/statistics/revenue - Lấy thống kê doanh thu
  async getRevenueStatistics(): Promise<ApiResponse<RevenueStatisticsResponse>> {
    try {
      console.log(' Fetching revenue statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<RevenueStatisticsResponse>>(
        '/api/admin/statistics/revenue'
      )
      
      if (response.data.status === 200) {
        console.log(' Revenue statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê doanh thu')
    } catch (error) {
      console.error('Error fetching challenge statistics:', error)
      throw error
    }
  }

  // GET /api/admin/statistics/engagement - Lấy thống kê tương tác
  async getEngagementStatistics(): Promise<ApiResponse<EngagementStatisticsResponse>> {
    try {
      console.log(' Fetching engagement statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<EngagementStatisticsResponse>>(
        '/api/admin/statistics/engagement'
      )
      
      if (response.data.status === 200) {
        console.log(' Engagement statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê tương tác')
    } catch (error) {
      console.error('❌ Error fetching engagement statistics:', error)
      throw error
    }
  }

  // GET /api/admin/statistics/challenges - Lấy thống kê challenges
  async getChallengeStatistics(): Promise<ApiResponse<ChallengeStatisticsResponse>> {
    try {
      console.log(' Fetching challenge statistics')
      
      const response = await adminApi.axiosInstance.get<ApiResponse<ChallengeStatisticsResponse>>(
        '/api/admin/statistics/challenges'
      )
      
      if (response.data.status === 200) {
        console.log(' Challenge statistics fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải thống kê challenges')
    } catch (error) {
      console.error('❌ Error fetching challenge statistics:', error)
      throw error
    }
  }

}

// Export singleton instance
export const statisticsApi = new StatisticsApiService()
export default statisticsApi