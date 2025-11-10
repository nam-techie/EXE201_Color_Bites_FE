// Comment types for admin dashboard - khớp với AdminCommentResponse từ backend - Updated theo backend document
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
  isDeleted?: boolean
  accountId?: string
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

// Comment restore request
export interface CommentRestoreRequest {
  // No body needed for restore endpoint
}

export interface BulkDeleteCommentsRequest {
  commentIds: string[]
}
