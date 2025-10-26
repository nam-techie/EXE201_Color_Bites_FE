// Tag types for admin dashboard - Updated theo backend document
export interface Tag {
  id: string
  name: string
  description: string
  usageCount: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  // Admin fields
  createdBy: string
  createdByName: string
  createdByEmail: string
  postCount: number
  restaurantCount: number
}

export interface TagFormData {
  name: string
  description?: string
}

export interface TagFilters {
  search?: string
  isDeleted?: boolean
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
