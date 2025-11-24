// Post response interface từ backend API
export interface PostResponse {
  id: string
  accountId: string
  accountName: string
  content: string
  moodId: string
  moodName: string
  reactionCount: number
  commentCount: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  authorEmail: string
  authorIsActive: boolean
  authorRole: string
}

// Posts page response với pagination
export interface PostsPageResponse {
  content: PostResponse[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// API response wrapper
export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

// Post filters interface
export interface PostFilters {
  search?: string
  status?: 'all' | 'active' | 'deleted'
  moodId?: string
  authorId?: string
  dateRange?: {
    start: string
    end: string
  }
}

// Post statistics interface
export interface PostStatistics {
  totalPosts: number
  activePosts: number
  deletedPosts: number
  totalReactions: number
  totalComments: number
  averageReactionsPerPost: number
  averageCommentsPerPost: number
}

// Post form data interface (for creating/editing)
export interface PostFormData {
  content: string
  moodId: string
  tags?: string[]
  isPublic?: boolean
}

// Post detail interface (extended with additional info)
export interface PostDetail extends PostResponse {
  tags?: Array<{
    id: string
    name: string
  }>
  images?: Array<{
    id: string
    url: string
    alt?: string
  }>
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  reactions?: Array<{
    id: string
    type: string
    userId: string
    userName: string
    createdAt: string
  }>
  comments?: Array<{
    id: string
    content: string
    userId: string
    userName: string
    createdAt: string
    isDeleted: boolean
  }>
}

// Post action types
export type PostAction = 'view' | 'edit' | 'delete' | 'restore' | 'feature'

// Post status enum
export enum PostStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
  PENDING = 'pending',
  FEATURED = 'featured'
}

// Post status labels
export const POST_STATUS_LABELS = {
  [PostStatus.ACTIVE]: 'Hoạt động',
  [PostStatus.DELETED]: 'Đã xóa',
  [PostStatus.PENDING]: 'Chờ duyệt',
  [PostStatus.FEATURED]: 'Nổi bật'
} as const

// Post status colors
export const POST_STATUS_COLORS = {
  [PostStatus.ACTIVE]: '#52c41a',
  [PostStatus.DELETED]: '#ff4d4f',
  [PostStatus.PENDING]: '#faad14',
  [PostStatus.FEATURED]: '#1890ff'
} as const
