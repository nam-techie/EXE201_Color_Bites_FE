import {
    ChallengeStatistics,
    EngagementStatistics,
    PostStatistics,
    RestaurantStatistics,
    RevenueStatistics,
    StatisticsFilters,
    StatisticsResponse,
    UserStatistics
} from '../types/statistics'
import { adminApi } from './adminApi'

// Statistics API service for admin dashboard
export const statisticsApi = {
  // Get system statistics overview
  async getSystemStatistics(filters?: StatisticsFilters): Promise<StatisticsResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end)
      if (filters?.period) params.append('period', filters.period)

      const response = await adminApi.get(`/api/admin/statistics?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching system statistics:', error)
      throw error
    }
  },

  // Get user statistics
  async getUserStatistics(filters?: StatisticsFilters): Promise<UserStatistics> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end)
      if (filters?.period) params.append('period', filters.period)

      const response = await adminApi.get(`/api/admin/statistics/users?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user statistics:', error)
      throw error
    }
  },

  // Get post statistics
  async getPostStatistics(filters?: StatisticsFilters): Promise<PostStatistics> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end)
      if (filters?.period) params.append('period', filters.period)

      const response = await adminApi.get(`/api/admin/statistics/posts?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching post statistics:', error)
      throw error
    }
  },

  // Get restaurant statistics
  async getRestaurantStatistics(filters?: StatisticsFilters): Promise<RestaurantStatistics> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end)
      if (filters?.period) params.append('period', filters.period)

      const response = await adminApi.get(`/api/admin/statistics/restaurants?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching restaurant statistics:', error)
      throw error
    }
  },

  // Get revenue statistics
  async getRevenueStatistics(filters?: StatisticsFilters): Promise<RevenueStatistics> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end)
      if (filters?.period) params.append('period', filters.period)

      const response = await adminApi.get(`/api/admin/statistics/revenue?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching revenue statistics:', error)
      throw error
    }
  },

  // Get engagement statistics
  async getEngagementStatistics(filters?: StatisticsFilters): Promise<EngagementStatistics> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end)
      if (filters?.period) params.append('period', filters.period)

      const response = await adminApi.get(`/api/admin/statistics/engagement?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching engagement statistics:', error)
      throw error
    }
  },

  // Get challenge statistics
  async getChallengeStatistics(filters?: StatisticsFilters): Promise<ChallengeStatistics> {
    try {
      const params = new URLSearchParams()
      
      if (filters?.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters?.dateRange?.end) params.append('endDate', filters.dateRange.end)
      if (filters?.period) params.append('period', filters.period)

      const response = await adminApi.get(`/api/admin/statistics/challenges?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching challenge statistics:', error)
      throw error
    }
  }
}