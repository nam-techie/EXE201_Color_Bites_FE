// Comment types for admin dashboard
export interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
  status: CommentStatus
  // Related data (populated by API)
  post?: {
    id: string
    title: string
    slug: string
  }
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

export type CommentStatus = 'active' | 'hidden' | 'reported'

export interface CommentFilters {
  status?: CommentStatus
  userId?: string
  postId?: string
  dateRange?: {
    start: string
    end: string
  }
  search?: string
  page?: number
  limit?: number
}

export interface CommentListResponse {
  data: Comment[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CommentUpdateStatusRequest {
  status: CommentStatus
}

export interface BulkDeleteCommentsRequest {
  commentIds: string[]
}
