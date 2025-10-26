import {
    Transaction,
    TransactionFilters,
    TransactionListResponse,
    TransactionStats,
    TransactionUpdateStatusRequest
} from '../types/transaction'
import { adminApi } from './adminApi'

// Transactions API service for admin dashboard - Updated theo backend document
export const transactionsApi = {
  // Get paginated list of transactions with filters
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionListResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)
      if (filters.accountId) params.append('accountId', filters.accountId)
      if (filters.search) params.append('search', filters.search)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.dateRange?.start) params.append('startDate', filters.dateRange.start)
      if (filters.dateRange?.end) params.append('endDate', filters.dateRange.end)
      if (filters.amountRange?.min) params.append('minAmount', filters.amountRange.min.toString())
      if (filters.amountRange?.max) params.append('maxAmount', filters.amountRange.max.toString())

      const response = await adminApi.get(`/api/admin/transactions?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },

  // Get single transaction by ID
  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await adminApi.get(`/api/admin/transactions/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching transaction:', error)
      throw error
    }
  },

  // Get transactions by status
  async getTransactionsByStatus(status: string, page: number = 0, size: number = 10): Promise<TransactionListResponse> {
    try {
      const response = await adminApi.get(`/api/admin/transactions/status/${status}?page=${page}&size=${size}`)
      return response.data
    } catch (error) {
      console.error('Error fetching transactions by status:', error)
      throw error
    }
  },

  // Update transaction status
  async updateTransactionStatus(id: string, data: TransactionUpdateStatusRequest): Promise<Transaction> {
    try {
      const response = await adminApi.patch(`/api/admin/transactions/${id}/status`, data)
      return response.data
    } catch (error) {
      console.error('Error updating transaction status:', error)
      throw error
    }
  },

  // Get transaction statistics
  async getTransactionStats(): Promise<TransactionStats> {
    try {
      const response = await adminApi.get('/api/admin/transactions/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching transaction stats:', error)
      throw error
    }
  }
}
