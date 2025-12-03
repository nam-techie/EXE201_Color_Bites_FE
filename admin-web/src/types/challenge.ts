// Challenge type definitions - khớp với API Documentation backend

// Enum cho loại thử thách (theo backend)
export type ChallengeType = 'PARTNER_LOCATION' | 'THEME_COUNT'

// Enum cho trạng thái tham gia
export type ParticipationStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED'

// Enum cho trạng thái bài nộp
export type EntryStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// Interface cho ảnh trong challenge
export interface ImageObject {
  url: string
  description?: string
}

// Challenge interface - khớp với ChallengeDefinitionResponse từ backend
export interface Challenge {
  id: string
  title: string
  description?: string
  challengeType: ChallengeType
  restaurantId?: string | null
  restaurantName?: string | null
  typeObjId?: string | null
  typeObjName?: string | null
  images?: ImageObject[] | null
  targetCount: number
  startDate: string
  endDate: string
  rewardDescription?: string | null
  createdBy?: string
  createdAt: string
  isActive: boolean
  participantCount?: number
  // Mapped fields for UI compatibility
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED'
}

// Response ngắn gọn cho danh sách thử thách (GET /api/challenges)
export interface ChallengeDetailResponse {
  id: string
  title: string
  challengeType: ChallengeType
  restaurantId?: string
  typeObjId?: string
  startDate: string
  endDate: string
}

// Challenge Entry - khớp với ChallengeEntryResponse từ backend
export interface ChallengeEntry {
  id: string
  participationId: string
  restaurantId: string
  photoUrl?: string
  latitude: number
  longitude: number
  status: EntryStatus
  caption?: string
  createdAt: string
  restaurantName?: string
  challengeTitle?: string
  accountId?: string
  // Additional fields for admin display
  userName?: string
  userEmail?: string
  reviewedAt?: string
  reviewedBy?: string
}

// Challenge Participation - khớp với ChallengeParticipationResponse
export interface ChallengeParticipation {
  id: string
  accountId: string
  challengeId: string
  status: ParticipationStatus
  completedAt?: string
  createdAt: string
  challengeTitle?: string
  targetCount?: number
  challengeType?: string
}

// API Request Types - khớp với CreateChallengeDefinitionRequest từ backend
export interface CreateChallengeDto {
  title: string // 2-200 ký tự, bắt buộc
  description?: string // tối đa 1000 ký tự
  challengeType: ChallengeType // bắt buộc
  restaurantId?: string // bắt buộc nếu challengeType = PARTNER_LOCATION
  typeObjId?: string // bắt buộc nếu challengeType = THEME_COUNT
  images?: ImageObject[]
  targetCount: number // >= 1, bắt buộc
  startDate: string // phải trong tương lai, bắt buộc
  durationDay: number // số ngày, bắt buộc
  rewardDescription?: string // tối đa 500 ký tự
}

// API Request Types - khớp với UpdateChallengeDefinitionRequest từ backend
export interface UpdateChallengeDto {
  title?: string // 2-200 ký tự
  description?: string // tối đa 1000 ký tự
  challengeType?: ChallengeType
  restaurantId?: string
  typeObjId?: string
  images?: ImageObject[]
  targetCount?: number // >= 1
  startDate?: string
  endDate?: string
  rewardDescription?: string // tối đa 500 ký tự
  isActive?: boolean
}

// Request nộp bài thử thách
export interface SubmitChallengeEntryRequest {
  restaurantId: string
  latitude: number // -90 to 90
  longitude: number // -180 to 180
  caption?: string // max 500 chars
}

// List params for pagination and filtering
export interface ChallengeListParams {
  page?: number
  size?: number
  search?: string
  challengeType?: ChallengeType
  status?: string
  sortBy?: 'title' | 'createdAt' | 'participantCount' | 'startDate'
  order?: 'asc' | 'desc'
}

// Statistics
export interface ChallengeStats {
  totalChallenges: number
  activeChallenges: number
  completedChallenges: number
  totalParticipants: number
  totalEntries: number
  pendingEntries: number
  approvedEntries: number
  rejectedEntries: number
}

// Challenge type configurations
export const CHALLENGE_TYPE_CONFIG = {
  FOOD_CHALLENGE: {
    label: 'Thử thách ăn uống',
    icon: 'utensils',
    color: '#52c41a'
  },
  PHOTO_CHALLENGE: {
    label: 'Thử thách chụp ảnh',
    icon: 'camera',
    color: '#1890ff'
  },
  REVIEW_CHALLENGE: {
    label: 'Thử thách đánh giá',
    icon: 'star',
    color: '#faad14'
  },
  SOCIAL_CHALLENGE: {
    label: 'Thử thách xã hội',
    icon: 'users',
    color: '#722ed1'
  }
}

export const CHALLENGE_STATUS_CONFIG = {
  ACTIVE: {
    label: 'Hoạt động',
    color: 'green',
    bgColor: '#f6ffed'
  },
  INACTIVE: {
    label: 'Chưa kích hoạt',
    color: 'orange',
    bgColor: '#fffbe6'
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: 'blue',
    bgColor: '#e6f7ff'
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'red',
    bgColor: '#fff2f0'
  }
}

export const ENTRY_STATUS_CONFIG: Record<EntryStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: {
    label: 'Chờ duyệt',
    color: 'orange',
    bgColor: '#fffbe6'
  },
  APPROVED: {
    label: 'Đã duyệt',
    color: 'green',
    bgColor: '#f6ffed'
  },
  REJECTED: {
    label: 'Từ chối',
    color: 'red',
    bgColor: '#fff2f0'
  }
}

export const PARTICIPATION_STATUS_CONFIG: Record<ParticipationStatus, { label: string; color: string; bgColor: string }> = {
  ACTIVE: {
    label: 'Đang thực hiện',
    color: 'blue',
    bgColor: '#e6f7ff'
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: 'green',
    bgColor: '#f6ffed'
  },
  FAILED: {
    label: 'Thất bại',
    color: 'red',
    bgColor: '#fff2f0'
  }
}
