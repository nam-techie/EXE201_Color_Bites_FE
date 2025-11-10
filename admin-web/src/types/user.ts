// Định nghĩa types cho User Management dựa trên backend API
export interface ListAccountResponse {
  id: string
  username: string
  active: boolean // Jackson converts isActive -> active
  role: string
  avatarUrl: string
  created: string // LocalDateTime từ backend
  updated: string // LocalDateTime từ backend
}

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export interface UserTableProps {
  users: ListAccountResponse[]
  onBlockUser: (id: string) => void
  onActivateUser: (id: string) => void
  loading?: boolean
}

// User Information Response từ backend API /api/admin/viewDetailUser/{id}
export interface UserInformationResponse {
  username: string
  accountId: string
  gender: string
  avatarUrl: string
  subscriptionPlan: string
  subscriptionStatus: 'ACTIVE' | 'EXPIRED' | 'CANCELED' // Trạng thái subscription
  subscriptionStartsAt: string // ISO timestamps
  subscriptionExpiresAt: string // ISO timestamps
  subscriptionRemainingDays: number // Server-calculated remaining days
  bio: string
  createdAt: string // ISO timestamps
  updatedAt: string // ISO timestamps
}