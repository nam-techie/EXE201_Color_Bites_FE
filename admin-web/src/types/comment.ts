// Comment types for admin dashboard - khớp với AdminCommentResponse từ backend
export interface Comment {
  id: string
  postId: string
  postTitle?: string // Backend trả về postTitle
  accountId: string // Backend trả về accountId
  accountName?: string // Backend trả về accountName
  userId?: string // Alias cho accountId
  content: string
  parentCommentId?: string | null
  replyCount?: number | null
  isDeleted: boolean // Backend trả về isDeleted (false = public, true = đã xóa)
  createdAt: string
  updatedAt?: string
  status?: CommentStatus // Mapped từ isDeleted
  // Additional fields from backend
  authorEmail?: string
  authorIsActive?: boolean
  authorRole?: string
  postAuthorName?: string // Backend trả về postAuthorName
  postAuthorEmail?: string
  // Related data (populated by API) - giữ lại để tương thích
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

export type CommentStatus = 'active' | 'hidden' | 'reported' | 'deleted'

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
