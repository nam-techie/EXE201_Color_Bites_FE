// Mood type definitions
export interface Mood {
  id: string
  name: string
  description: string
  usageCount: number
  createdAt: string
  updatedAt: string
  isDeleted: boolean
}

// API request/response types
export interface CreateMoodDto {
  name: string
  description: string
}

export interface UpdateMoodDto {
  name?: string
  description?: string
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
