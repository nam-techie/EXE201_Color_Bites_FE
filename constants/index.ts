// API Configuration
// Import from centralized config
import { API_BASE_URL, GOONG_API_KEY, GOONG_MAPTILES_KEY } from '@/config/env'

// Goong Map Style URL
export const GOONG_MAP_STYLE = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`

// Re-export from centralized config for backward compatibility
export { API_BASE_URL, GOONG_API_KEY, GOONG_MAPTILES_KEY }
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

export const DEFAULT_SEARCH_RADIUS = 2000 // meters


// Goong Map Styles
export const GOONG_STYLE_BASE = 'https://tiles.goong.io/assets/goong_map_web.json'
export const GOONG_STYLE_SATELLITE = 'https://tiles.goong.io/assets/goong_satellite.json'
export const GOONG_STYLE_HIGHLIGHT = 'https://tiles.goong.io/assets/goong_map_highlight.json'

// Default map center (Ho Chi Minh City)
export const DEFAULT_MAP_CENTER = [106.6297, 10.8231] // [lng, lat]

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