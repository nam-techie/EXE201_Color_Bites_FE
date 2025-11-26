// API Configuration
// Read from multiple sources to be robust on Expo (env/app.json extra)
import Constants from 'expo-constants'
import { Platform } from 'react-native'

const envKey = process.env.EXPO_PUBLIC_OPENROUTE_API_KEY
const extraKey = (Constants?.expoConfig as any)?.extra?.OPENROUTE_API_KEY as
  | string
  | undefined

export const OPENROUTE_API_KEY = envKey || extraKey || ''

// Dev diagnostics: verify env is loaded (will NOT print actual key)
if (__DEV__) {
  const hasEnv = !!envKey
  const hasExtra = !!extraKey
  const len = (envKey || extraKey || '').length
  // This helps diagnose "not configured" vs "expired" quickly without leaking the key
  console.log('[ENV DEBUG] ORS key source:', hasEnv ? 'env' : hasExtra ? 'extra' : 'none', 'length:', len)
}

// Map Provider - OpenStreetMap only
if (__DEV__) {
  console.log('[ENV DEBUG] Map provider: OpenStreetMap')
}

// Goong API Configuration
const goongEnvKey = process.env.EXPO_PUBLIC_GOONG_API_KEY
const goongExtraKey = (Constants?.expoConfig as any)?.extra?.GOONG_API_KEY as string | undefined
export const GOONG_API_KEY = goongEnvKey || goongExtraKey || 'ZBpYUzDG5EsrTKY0WQL3yYknnIGclL9boJvNV2Xm'
if (__DEV__) {
  const hasGoongEnv = !!goongEnvKey
  const hasGoongExtra = !!goongExtraKey
  const goongLen = (goongEnvKey || goongExtraKey || GOONG_API_KEY).length
  console.log('[ENV DEBUG] Goong key source:', hasGoongEnv ? 'env' : hasGoongExtra ? 'extra' : 'hardcoded', 'length:', goongLen)
}

// Gemini Configuration
const geminiEnvKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY
const geminiExtraKey = (Constants?.expoConfig as any)?.extra?.GEMINI_API_KEY as string | undefined
export const GEMINI_API_KEY = geminiEnvKey || geminiExtraKey || 'AIzaSyBZvlgYVcB_3_TUIVWydsqe_IizB4OFZJM'

if (__DEV__) {
  console.log('[ENV DEBUG] Gemini key configured:', GEMINI_API_KEY ? 'yes' : 'no')
}

// Backend API Configuration
// Chọn baseURL theo môi trường chạy để tránh lỗi Network Error
const getApiBaseUrl = () => {
  // Ưu tiên biến môi trường nếu được cấu hình
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL
  console.log('[ENV DEBUG] process.env.EXPO_PUBLIC_API_BASE_URL:', envUrl)
  if (envUrl && envUrl.trim().length > 0) return envUrl

  // Cho phép cấu hình qua app.json -> expo.extra.API_BASE_URL
  const extraUrl = (Constants?.expoConfig as any)?.extra?.API_BASE_URL as string | undefined
  if (extraUrl && extraUrl.trim().length > 0) return extraUrl

  // Mặc định theo nền tảng dev
  // - Android Emulator dùng 10.0.2.2 để trỏ về localhost của máy host
  // - iOS Simulator và Web có thể dùng localhost trực tiếp
  // - Thiết bị thật: cố gắng suy ra IP LAN từ expo manifest nếu có, nếu không nhắc cấu hình .env
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080'
  }

  if (Platform.OS === 'ios' || Platform.OS === 'web') {
    return 'http://localhost:8080'
  }

  // Fallback cuối cùng: cố gắng lấy IP LAN từ expo dev server
  const manifestHost = (Constants?.expoConfig as any)?.hostUri as string | undefined
  if (manifestHost) {
    const host = manifestHost.split(':')[0]
    return `http://${host}:8080`
  }

  // Nếu không thể đoán, trả về localhost và ghi log cảnh báo
  if (__DEV__) {
    console.warn('[ENV WARN] API base URL không được cấu hình. Dùng mặc định http://localhost:8080. Hãy đặt EXPO_PUBLIC_API_BASE_URL trong .env để tránh lỗi kết nối trên thiết bị thật.')
  }
  return 'http://localhost:8080'
}

export const API_BASE_URL = getApiBaseUrl()
// export const API_BASE_URL = 'https://api-mumii.namtechie.id.vn'
if (__DEV__) {
  console.log('[ENV DEBUG] API base URL:', API_BASE_URL)
  console.log('[ENV DEBUG] Platform.OS:', Platform.OS)
  console.log('[ENV DEBUG] All process.env keys:', Object.keys(process.env).filter(k => k.startsWith('EXPO_PUBLIC')))
}
export const API_ENDPOINTS = {
  // Post endpoints
  POSTS: {
    CREATE: '/api/posts/create',
    LIST: '/api/posts/list',
    BY_ID: '/api/posts/read',
    BY_USER: '/api/posts/read/user',
    BY_MOOD: '/api/posts/read/mood',
    BY_PRIVACY: '/api/posts/read/privacy',
    SEARCH: '/api/posts/search',
    UPDATE: '/api/posts/edit',
    DELETE: '/api/posts/delete',
    REACT: '/api/posts/react',
    TOGGLE_REACTION: '/api/reactions/toggle',
    COUNT_USER: '/api/posts/count/user',
  },
  // Comment endpoints  
  COMMENTS: {
    CREATE: '/api/comments/create/posts',
    LIST: '/api/comments/read/posts',
  },
  // Mood endpoints
  MOODS: {
    LIST: '/api/moods/list',
  },
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VERIFY_TOKEN: '/api/auth/verify',
    CHANGE_PASSWORD: '/api/auth/change-password',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    ME: '/api/auth/me',
  },
  // OTP endpoints
  OTP: {
    VERIFY_REGISTER: '/api/otp/verify-register',
    VERIFY_RESET_PASSWORD: '/api/otp/verify-reset-password',
  },
  // User Information endpoints
  USER_INFO: {
    GET: '/api/user-info',
    UPDATE: '/api/user-info',
    UPLOAD_AVATAR: '/api/user-info/uploadAvatar', // usage: `${UPLOAD_AVATAR}/${accountId}`
  },
  // Payment endpoints
  PAYMENT: {
    CREATE: '/api/payment/subscription/create',
    STATUS: '/api/payment/subscription/status',
    CONFIRM: '/api/payment/subscription/confirm',
    HISTORY: '/api/payment/history',
  },
}

// Map Configuration
export const DEFAULT_MAP_REGION = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

export const DEFAULT_SEARCH_RADIUS = 10000 // meters (10km)

// Route Configuration
export const DEFAULT_ROUTE_ALTERNATIVES = 2
export const ROUTE_OPTIMIZATION_PARAMS = {
  weight_factor: 1.4,
  share_factor: 0.6,
}

// Cost Configuration (VND per km)
export const TRANSPORT_COSTS = {
  'driving-car': 3000,
  'driving-hgv': 5000,
  'cycling-regular': 0,
  'foot-walking': 0,
} as const