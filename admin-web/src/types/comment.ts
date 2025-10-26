// Comment types for admin dashboard - Updated theo backend document
export interface Comment {
  id: string
  postId: string
  postTitle: string
  content: string
  accountId: string
  accountName: string
  parentCommentId: string | null
  replyCount: number
  isDeleted: boolean  // ← Thay đổi từ status
  createdAt: string
  updatedAt: string
  // Admin fields
  authorEmail: string
  authorIsActive: boolean
  authorRole: string
  postAuthorName: string
  postAuthorEmail: string
}

// Comment filters - Updated cho isDeleted
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
