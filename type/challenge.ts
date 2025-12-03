// Challenge Types - Theo API Documentation backend

// Enum cho loại thử thách
export enum ChallengeType {
   PARTNER_LOCATION = 'PARTNER_LOCATION', // Thử thách tại địa điểm nhà hàng
   THEME_COUNT = 'THEME_COUNT', // Thử thách theo chủ đề món ăn
}

// Enum cho trạng thái tham gia
export enum ParticipationStatus {
   ACTIVE = 'ACTIVE', // Đang tham gia
   COMPLETED = 'COMPLETED', // Đã hoàn thành
   FAILED = 'FAILED', // Thất bại
}

// Enum cho trạng thái bài nộp
export enum EntryStatus {
   PENDING = 'PENDING', // Đang chờ duyệt
   APPROVED = 'APPROVED', // Đã được duyệt
   REJECTED = 'REJECTED', // Bị từ chối
}

// Interface cho ảnh trong challenge
export interface ImageObject {
   url: string
   description?: string
}

// Response ngắn gọn cho danh sách thử thách (GET /api/challenges)
export interface ChallengeDetailResponse {
   id: string
   title: string
   challengeType: ChallengeType
   restaurantId?: string
   typeObjId?: string
   startDate: string // ISO 8601 format
   endDate: string // ISO 8601 format
}

// Response chi tiết cho thử thách (GET /api/challenges/{id})
export interface ChallengeDefinitionResponse {
   id: string
   title: string
   description?: string
   challengeType: ChallengeType
   restaurantId?: string
   typeObjId?: string
   images?: ImageObject[]
   targetCount: number
   startDate: string
   endDate: string
   rewardDescription?: string
   createdBy?: string
   createdAt?: string
   isActive: boolean
   restaurantName?: string
   typeObjName?: string
   participantCount?: number
}

// Response cho tham gia thử thách (POST /api/challenges/{challengeId}/join)
export interface ChallengeParticipationResponse {
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

// Response cho bài nộp thử thách
export interface ChallengeEntryResponse {
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
}

// Request tạo thử thách (POST /api/challenges)
export interface CreateChallengeRequest {
   title: string
   description?: string
   challengeType: ChallengeType
   restaurantId?: string // Required if PARTNER_LOCATION
   typeObjId?: string // Required if THEME_COUNT
   images?: ImageObject[]
   targetCount: number
   startDate: string // ISO 8601 format
   durationDay: number
   rewardDescription?: string
}

// Request nộp bài thử thách (POST /api/challenges/participations/{challengeId}/entries)
export interface SubmitChallengeEntryRequest {
   restaurantId: string
   latitude: number // -90 to 90
   longitude: number // -180 to 180
   caption?: string // max 500 chars
}

// Request cập nhật bài nộp
export interface UpdateChallengeEntryRequest {
   restaurantId?: string
   photoUrl?: string
   latitude?: number
   longitude?: number
   caption?: string
}

// Response phân trang cho participations
export interface PaginatedParticipationResponse {
   content: ChallengeParticipationResponse[]
   totalElements: number
   totalPages: number
   size: number
   number: number
   first: boolean
   last: boolean
}

// Response phân trang cho entries
export interface PaginatedEntryResponse {
   content: ChallengeEntryResponse[]
   totalElements: number
   totalPages: number
   size: number
   number: number
   first: boolean
   last: boolean
}

