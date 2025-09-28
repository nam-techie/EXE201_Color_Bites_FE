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
