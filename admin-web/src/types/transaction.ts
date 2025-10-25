// Transaction types for admin dashboard
export interface Transaction {
  id: string
  userId: string
  amount: number
  type: TransactionType
  status: TransactionStatus
  description?: string
  createdAt: string
  updatedAt: string
  // Related data (populated by API)
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export type TransactionType = 'deposit' | 'withdraw' | 'reward' | 'refund'

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface TransactionFilters {
  status?: TransactionStatus
  type?: TransactionType
  userId?: string
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
  status: TransactionStatus
}

export interface TransactionStats {
  totalRevenue: number
  pendingAmount: number
  failedCount: number
  completedCount: number
  totalTransactions: number
  averageAmount: number
}

// Transaction type configuration for UI
export const TRANSACTION_TYPE_CONFIG = {
  deposit: {
    label: 'Nạp tiền',
    color: 'success',
    icon: '💰'
  },
  withdraw: {
    label: 'Rút tiền',
    color: 'warning',
    icon: '💸'
  },
  reward: {
    label: 'Thưởng',
    color: 'processing',
    icon: '🎁'
  },
  refund: {
    label: 'Hoàn tiền',
    color: 'default',
    icon: '↩️'
  }
} as const

// Transaction status configuration for UI
export const TRANSACTION_STATUS_CONFIG = {
  pending: {
    label: 'Chờ xử lý',
    color: 'warning',
    bgColor: '#fffbe6',
    textColor: '#faad14'
  },
  completed: {
    label: 'Hoàn thành',
    color: 'success',
    bgColor: '#f6ffed',
    textColor: '#52c41a'
  },
  failed: {
    label: 'Thất bại',
    color: 'error',
    bgColor: '#fff2f0',
    textColor: '#ff4d4f'
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'default',
    bgColor: '#f5f5f5',
    textColor: '#8c8c8c'
  }
} as const
