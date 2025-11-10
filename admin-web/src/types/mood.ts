// Mood type definitions - khớp với AdminMoodResponse từ backend
export interface Mood {
  id: string
  name: string
  emoji: string // Backend trả về emoji character
  createdAt: string
  updatedAt?: string
  isDeleted?: boolean
  usageCount?: number // Có thể không có trong response
}

// API request/response types
export interface CreateMoodDto {
  name: string
  emoji: string
}

export interface UpdateMoodDto {
  name?: string
  emoji?: string
}

export interface MoodListParams {
  page?: number
  size?: number
  search?: string
  sortBy?: 'name' | 'usageCount' | 'createdAt'
  order?: 'asc' | 'desc'
}

export interface MoodStats {
  totalMoods: number
  activeMoods: number
  deletedMoods: number
  mostUsedMood: {
    id: string
    name: string
    usageCount: number
  }
}
