// Transaction status constants
export const TRANSACTION_STATUS = {
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED'
} as const

export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUS.SUCCESS]: 'Thành công',
  [TRANSACTION_STATUS.PENDING]: 'Chờ xử lý',
  [TRANSACTION_STATUS.FAILED]: 'Thất bại',
  [TRANSACTION_STATUS.CANCELED]: 'Đã hủy'
} as const

// User role constants
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MODERATOR: 'MODERATOR'
} as const

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Quản trị viên',
  [USER_ROLES.USER]: 'Người dùng',
  [USER_ROLES.MODERATOR]: 'Điều hành viên'
} as const

// Challenge type constants
export const CHALLENGE_TYPES = {
  FOOD_CHALLENGE: 'FOOD_CHALLENGE',
  RESTAURANT_CHALLENGE: 'RESTAURANT_CHALLENGE',
  PHOTO_CHALLENGE: 'PHOTO_CHALLENGE',
  REVIEW_CHALLENGE: 'REVIEW_CHALLENGE'
} as const

export const CHALLENGE_TYPE_LABELS = {
  [CHALLENGE_TYPES.FOOD_CHALLENGE]: 'Thử thách món ăn',
  [CHALLENGE_TYPES.RESTAURANT_CHALLENGE]: 'Thử thách nhà hàng',
  [CHALLENGE_TYPES.PHOTO_CHALLENGE]: 'Thử thách ảnh',
  [CHALLENGE_TYPES.REVIEW_CHALLENGE]: 'Thử thách đánh giá'
} as const

// Challenge entry status constants
export const CHALLENGE_ENTRY_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const

export const CHALLENGE_ENTRY_STATUS_LABELS = {
  [CHALLENGE_ENTRY_STATUS.PENDING]: 'Chờ duyệt',
  [CHALLENGE_ENTRY_STATUS.APPROVED]: 'Đã duyệt',
  [CHALLENGE_ENTRY_STATUS.REJECTED]: 'Từ chối'
} as const

// Pagination constants
export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'] as const
export const DEFAULT_PAGE_SIZE = 20
export const DEFAULT_PAGE = 1

// API constants
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE_URL)
    ? (import.meta as any).env.VITE_API_BASE_URL
    : 'http://localhost:8080'
export const API_TIMEOUT = 30000

// Date format constants
export const DATE_FORMATS = {
  DATE: 'DD/MM/YYYY',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
} as const

// Currency constants
export const CURRENCY = {
  VND: 'VND',
  USD: 'USD',
  EUR: 'EUR'
} as const

// File upload constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

// Status color mapping
export const STATUS_COLORS = {
  SUCCESS: '#52c41a',
  PENDING: '#faad14',
  FAILED: '#ff4d4f',
  CANCELED: '#d9d9d9',
  ACTIVE: '#52c41a',
  INACTIVE: '#d9d9d9',
  DELETED: '#ff4d4f',
  BLOCKED: '#ff4d4f',
  APPROVED: '#52c41a',
  REJECTED: '#ff4d4f'
} as const

// Table column widths
export const COLUMN_WIDTHS = {
  ID: 80,
  NAME: 150,
  EMAIL: 200,
  PHONE: 120,
  DATE: 120,
  STATUS: 100,
  ACTIONS: 120,
  AVATAR: 60
} as const

// Auto refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  STATISTICS: 30000, // 30 seconds
  NOTIFICATIONS: 60000, // 1 minute
  REAL_TIME: 5000 // 5 seconds
} as const

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'adminAuthToken',
  USER_INFO: 'adminUser',
  THEME: 'adminTheme',
  LANGUAGE: 'adminLanguage',
  SETTINGS: 'adminSettings'
} as const

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập tính năng này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Đã xảy ra lỗi từ server. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  TIMEOUT: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.'
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Tạo mới thành công.',
  UPDATED: 'Cập nhật thành công.',
  DELETED: 'Xóa thành công.',
  RESTORED: 'Khôi phục thành công.',
  SAVED: 'Lưu thành công.',
  SENT: 'Gửi thành công.',
  UPLOADED: 'Tải lên thành công.'
} as const

// Filter options
export const FILTER_OPTIONS = {
  STATUS: [
    { key: 'all', label: 'Tất cả', value: 'all' },
    { key: 'active', label: 'Hoạt động', value: 'active' },
    { key: 'inactive', label: 'Không hoạt động', value: 'inactive' },
    { key: 'deleted', label: 'Đã xóa', value: 'deleted' }
  ],
  DATE_RANGE: [
    { key: 'today', label: 'Hôm nay', value: 'today' },
    { key: 'yesterday', label: 'Hôm qua', value: 'yesterday' },
    { key: 'thisWeek', label: 'Tuần này', value: 'thisWeek' },
    { key: 'lastWeek', label: 'Tuần trước', value: 'lastWeek' },
    { key: 'thisMonth', label: 'Tháng này', value: 'thisMonth' },
    { key: 'lastMonth', label: 'Tháng trước', value: 'lastMonth' },
    { key: 'thisYear', label: 'Năm nay', value: 'thisYear' },
    { key: 'custom', label: 'Tùy chọn', value: 'custom' }
  ]
} as const
