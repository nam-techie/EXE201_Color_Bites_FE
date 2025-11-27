import type { ApiResponse } from '../types/user'
import { adminApi } from './adminApi'

export interface StatisticsParams {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate?: string
  endDate?: string
}

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
  async getSystemStatistics(params?: StatisticsParams): Promise<ApiResponse<SystemStatistics>> {
    try {
      console.log(' Fetching system statistics', params)

      const response = await adminApi.axiosInstance.get<ApiResponse<SystemStatistics>>(
        '/api/admin/statistics',
        { params }
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
  async getUserStatistics(params?: StatisticsParams): Promise<ApiResponse<UserStatisticsResponse>> {
    try {
      console.log(' Fetching user statistics', params)

      const response = await adminApi.axiosInstance.get<ApiResponse<UserStatisticsResponse>>(
        '/api/admin/statistics/users',
        { params }
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
  async getPostStatistics(params?: StatisticsParams): Promise<ApiResponse<PostStatisticsResponse>> {
    try {
      console.log(' Fetching post statistics', params)

      const response = await adminApi.axiosInstance.get<ApiResponse<PostStatisticsResponse>>(
        '/api/admin/statistics/posts',
        { params }
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
  async getRestaurantStatistics(params?: StatisticsParams): Promise<ApiResponse<RestaurantStatisticsResponse>> {
    try {
      console.log(' Fetching restaurant statistics', params)

      const response = await adminApi.axiosInstance.get<ApiResponse<RestaurantStatisticsResponse>>(
        '/api/admin/statistics/restaurants',
        { params }
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
  async getRevenueStatistics(params?: StatisticsParams): Promise<ApiResponse<RevenueStatisticsResponse>> {
    try {
      console.log(' Fetching revenue statistics', params)

      const response = await adminApi.axiosInstance.get<ApiResponse<RevenueStatisticsResponse>>(
        '/api/admin/statistics/revenue',
        { params }
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
  async getEngagementStatistics(params?: StatisticsParams): Promise<ApiResponse<EngagementStatisticsResponse>> {
    try {
      console.log(' Fetching engagement statistics', params)

      const response = await adminApi.axiosInstance.get<ApiResponse<EngagementStatisticsResponse>>(
        '/api/admin/statistics/engagement',
        { params }
      )

      if (response.data.status === 200) {
        console.log(' Engagement statistics fetched successfully')
        return response.data
      }

      throw new Error(response.data.message || 'Không thể tải thống kê tương tác')
    } catch (error) {
      console.error(' Error fetching engagement statistics:', error)
      throw error
    }
  }

  // GET /api/admin/statistics/challenges - Lấy thống kê challenges
  async getChallengeStatistics(params?: StatisticsParams): Promise<ApiResponse<ChallengeStatisticsResponse>> {
    try {
      console.log(' Fetching challenge statistics', params)

      const response = await adminApi.axiosInstance.get<ApiResponse<ChallengeStatisticsResponse>>(
        '/api/admin/statistics/challenges',
        { params }
      )

      if (response.data.status === 200) {
        console.log(' Challenge statistics fetched successfully')
        return response.data
      }

      throw new Error(response.data.message || 'Không thể tải thống kê challenges')
    } catch (error) {
      console.error(' Error fetching challenge statistics:', error)
      throw error
    }
  }

}

// Export singleton instance
export const statisticsApi = new StatisticsApiService()
export default statisticsApi