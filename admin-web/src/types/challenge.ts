// Challenge type definitions
export interface Challenge {
  id: string
  title: string
  description: string
  type: 'FOOD_CHALLENGE' | 'PHOTO_CHALLENGE' | 'REVIEW_CHALLENGE' | 'SOCIAL_CHALLENGE'
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED'
  restaurantId?: string
  restaurantName?: string
  startDate: string
  endDate: string
  reward?: string
  participantCount: number
  completionCount: number
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

export interface ChallengeEntry {
  id: string
  challengeId: string
  userId: string
  userName: string
  userEmail: string
  content: string
  images?: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

// API request/response types
export interface CreateChallengeDto {
  title: string
  description: string
  type: 'FOOD_CHALLENGE' | 'PHOTO_CHALLENGE' | 'REVIEW_CHALLENGE' | 'SOCIAL_CHALLENGE'
  restaurantId?: string
  startDate: string
  endDate: string
  reward?: string
}

export interface UpdateChallengeDto {
  title?: string
  description?: string
  type?: 'FOOD_CHALLENGE' | 'PHOTO_CHALLENGE' | 'REVIEW_CHALLENGE' | 'SOCIAL_CHALLENGE'
  restaurantId?: string
  startDate?: string
  endDate?: string
  reward?: string
}

export interface ChallengeListParams {
  page?: number
  size?: number
  search?: string
  type?: string
  status?: string
  sortBy?: 'title' | 'createdAt' | 'participantCount' | 'startDate'
  order?: 'asc' | 'desc'
}

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
    icon: '🍽️',
    color: '#52c41a'
  },
  PHOTO_CHALLENGE: {
    label: 'Thử thách chụp ảnh',
    icon: '📸',
    color: '#1890ff'
  },
  REVIEW_CHALLENGE: {
    label: 'Thử thách đánh giá',
    icon: '⭐',
    color: '#faad14'
  },
  SOCIAL_CHALLENGE: {
    label: 'Thử thách xã hội',
    icon: '👥',
    color: '#722ed1'
  }
}

export const CHALLENGE_STATUS_CONFIG = {
  ACTIVE: {
    label: 'Hoạt động',
    color: '#52c41a',
    bgColor: '#f6ffed'
  },
  INACTIVE: {
    label: 'Không hoạt động',
    color: '#faad14',
    bgColor: '#fffbe6'
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: '#1890ff',
    bgColor: '#e6f7ff'
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: '#ff4d4f',
    bgColor: '#fff2f0'
  }
}
