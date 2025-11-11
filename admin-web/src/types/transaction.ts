// Transaction types for admin dashboard - Updated theo backend document
export interface Transaction {
  id: string
  accountId: string
  accountName: string
  accountEmail: string
  amount: number
  currency: string
  type: string
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELED'
  plan: string
  gateway: string
  orderCode: string
  providerTxnId: string
  metadata: Record<string, any>
  rawPayload: Record<string, any>
  createdAt: string
  updatedAt: string
  // Admin fields
  accountIsActive: boolean
  accountRole: string
}

export interface TransactionFilters {
  status?: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELED'
  type?: string
  accountId?: string
  dateRange?: {
    start: string
    end: string
  }
  amountRange?: {
    min: number
    max: number
  }
  search?: string
  page?: number
  limit?: number
}

export interface TransactionListResponse {
  data: Transaction[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TransactionUpdateStatusRequest {
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELED'
}

export interface TransactionStats {
  totalRevenue: number
  pendingAmount: number
  failedCount: number
  completedCount: number
  totalTransactions: number
  averageAmount: number
}

// Transaction status configuration for UI
export const TRANSACTION_STATUS_CONFIG = {
  SUCCESS: {
    label: 'Thành công',
    color: 'success',
    bgColor: '#f6ffed',
    textColor: '#52c41a'
  },
  PENDING: {
    label: 'Chờ xử lý',
    color: 'warning',
    bgColor: '#fffbe6',
    textColor: '#faad14'
  },
  FAILED: {
    label: 'Thất bại',
    color: 'error',
    bgColor: '#fff2f0',
    textColor: '#ff4d4f'
  },
  CANCELED: {
    label: 'Đã hủy',
    color: 'default',
    bgColor: '#f5f5f5',
    textColor: '#8c8c8c'
  }
} as const
