// Authentication types matching backend API
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  fullName?: string
}

export interface AccountResponse {
  id: string
  username: string
  email: string
  role: string
  token: string
  refreshToken?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthApiResponse<T> {
  status: number
  message: string
  data: T
}

export interface LogoutResponse {
  message: string
}
