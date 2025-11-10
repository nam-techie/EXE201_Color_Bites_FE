import {
    Transaction,
    TransactionFilters,
    TransactionListResponse,
    TransactionStats,
    TransactionUpdateStatusRequest
} from '../types/transaction'
import { adminApi } from './adminApi'
import type { ApiResponse } from '../types/user'

// Transactions API service for admin dashboard - Updated theo backend document
class TransactionsApiService {
  private baseURL = '/api/admin/transactions'

  // GET /api/admin/transactions/all - Lấy toàn bộ transactions (tương thích với TransactionsList)
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionListResponse> {
    try {
      console.log('📡 Fetching all transactions:', filters)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<Transaction[]>>(
        `${this.baseURL}/all`
      )
      
      if (response.data.status === 200) {
        // Backend trả về List<AdminTransactionResponse>, convert sang TransactionListResponse
        const transactions = response.data.data || []
        
        // Apply client-side filtering if needed
        let filteredTransactions = transactions
        
        if (filters.status) {
          filteredTransactions = filteredTransactions.filter(t => t.status === filters.status)
        }
        if (filters.type) {
          filteredTransactions = filteredTransactions.filter(t => t.type === filters.type)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredTransactions = filteredTransactions.filter(t => 
            t.id?.toLowerCase().includes(searchLower) ||
            t.userId?.toLowerCase().includes(searchLower) ||
            t.description?.toLowerCase().includes(searchLower)
          )
        }
        
        // Client-side pagination
        const page = filters.page || 0
        const limit = filters.limit || 10
        const startIndex = page * limit
        const endIndex = startIndex + limit
        const paginatedData = filteredTransactions.slice(startIndex, endIndex)
        
        return {
          data: paginatedData,
          total: filteredTransactions.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(filteredTransactions.length / limit)
        }
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách giao dịch')
    } catch (error: any) {
      console.error('❌ Error fetching transactions:', error)
      // Return empty response instead of throwing to prevent page crash
      return {
        data: [],
        total: 0,
        page: 0,
        limit: 10,
        totalPages: 0
      }
    }
  }

  // Alias cho getAllTransactions
  async getAllTransactions(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<TransactionListResponse>> {
    const result = await this.getTransactions({ page, limit: size })
    return {
      status: 200,
      message: 'Success',
      data: result as any
    }
  }

  // GET /api/admin/transactions/{id} - Lấy chi tiết transaction
  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    try {
      console.log('📡 Fetching transaction by id:', id)
      
      const response = await adminApi.axiosInstance.get<ApiResponse<Transaction>>(
        `${this.baseURL}/${id}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Transaction detail fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải chi tiết giao dịch')
    } catch (error) {
      console.error('❌ Error fetching transaction:', error)
      throw error
    }
  }

  // GET /api/admin/transactions/status/{status} - Lấy transactions theo status
  async getTransactionsByStatus(
    status: string,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<TransactionListResponse>> {
    try {
      console.log('📡 Fetching transactions by status:', { status, page, size })
      
      const response = await adminApi.axiosInstance.get<ApiResponse<TransactionListResponse>>(
        `${this.baseURL}/status/${status}?page=${page}&size=${size}`
      )
      
      if (response.data.status === 200) {
        console.log('✅ Transactions by status fetched successfully')
        return response.data
      }
      
      throw new Error(response.data.message || 'Không thể tải giao dịch theo trạng thái')
    } catch (error) {
      console.error('❌ Error fetching transactions by status:', error)
      throw error
    }
  }

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

  // PUT /api/admin/transactions/{id}/status - Cập nhật status transaction (tương thích với TransactionsList)
  async updateTransactionStatus(id: string, data: TransactionUpdateStatusRequest): Promise<Transaction> {
    try {
      console.log('📤 Updating api/admin/transaction status:', id, data)
      
      // Note: Backend không có endpoint này, nhưng giữ lại để tương thích
      // Có thể cần implement ở backend hoặc xử lý khác
      throw new Error('Method not implemented - backend endpoint missing')
    } catch (error) {
      console.error('❌ Error updating transaction status:', error)
      throw error
    }
  }

  // GET /api/admin/transactions/stats - Lấy thống kê transactions (tương thích với TransactionsList)
  async getTransactionStats(): Promise<TransactionStats> {
    try {
      console.log('📡 Fetching api/admin/transaction stats')
      
      // Note: Backend không có endpoint này, nhưng giữ lại để tương thích
      // Có thể cần implement ở backend hoặc xử lý khác
      throw new Error('Method not implemented - backend endpoint missing')
    } catch (error) {
      console.error('❌ Error fetching transaction stats:', error)
      throw error
    }
  }
}

// Export singleton instance
export const transactionsApi = new TransactionsApiService()
export default transactionsApi
