// API Configuration
export const OPENROUTE_API_KEY = process.env.EXPO_PUBLIC_OPENROUTE_API_KEY || ''

// Backend API Configuration
// For Android Emulator, use 10.0.2.2 instead of localhost
const getApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL
  if (envUrl) return envUrl
  
  // Default URLs for development
//   return 'http://localhost:8080'  // Backend đã hoạt động trên localhost
//   return 'http://10.0.2.2:8080'  // Android Emulator
  return 'http://192.168.1.106:8080'  // Physical device
}

export const API_BASE_URL = getApiBaseUrl()
export const API_ENDPOINTS = {
   // Post endpoints
   POSTS: {
      CREATE: '/api/posts/create',
      LIST: '/api/posts/list',
      BY_ID: '/api/posts/read',
      BY_USER: '/api/posts/read/user',
      BY_MOOD: '/api/posts/read/mood',
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
      ME: '/api/auth/me',
   },
   // User Information endpoints
   USER_INFO: {
      GET: '/api/user-info',
   },
}

// Map Configuration
export const DEFAULT_MAP_REGION = {
   latitudeDelta: 0.05,
   longitudeDelta: 0.05,
}

export const DEFAULT_SEARCH_RADIUS = 2000 // meters

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