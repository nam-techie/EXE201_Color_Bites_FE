// Tag types for admin dashboard
export interface Tag {
  id: string
  name: string
  slug: string
  color: string
  description?: string
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface TagFormData {
  name: string
  color: string
  description?: string
}

export interface TagFilters {
  search?: string
  sortBy?: 'name' | 'usageCount' | 'createdAt'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface TagListResponse {
  data: Tag[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface BulkDeleteTagsRequest {
  tagIds: string[]
}

// Predefined color options for tag color picker
export const TAG_COLORS = [
  '#f56565', // red-500
  '#ed8936', // orange-500
  '#ecc94b', // yellow-500
  '#48bb78', // green-500
  '#38b2ac', // teal-500
  '#4299e1', // blue-500
  '#9f7aea', // purple-500
  '#ed64a6', // pink-500
  '#667eea', // indigo-500
  '#f093fb', // pink-400
  '#f5576c', // red-400
  '#4facfe', // blue-400
  '#43e97b', // green-400
  '#fa709a', // pink-500
  '#ffecd2', // orange-100
  '#a8edea', // teal-200
  '#d299c2', // purple-300
  '#fad0c4', // pink-200
  '#ff9a9e', // red-300
  '#a18cd1'  // purple-400
] as const

export type TagColor = typeof TAG_COLORS[number]
