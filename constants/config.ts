// API Configuration for different environments
export const API_CONFIG = {
  // Development - Replace with your actual LAN IP address
  DEVELOPMENT: 'http://10.0.240.67:8080',
  
  // Android Emulator - Special IP for AVD
  ANDROID_EMULATOR: 'http://10.0.2.2:8080',
  
  // iOS Simulator - Can use localhost or LAN IP
  IOS_SIMULATOR: 'http://localhost:8080',
  
  // Production - Your deployed backend URL
  PRODUCTION: 'https://your-backend-domain.com',
}

// Current API base URL - Change this based on your environment
export const API_BASE_URL = API_CONFIG.DEVELOPMENT

// API timeout in milliseconds
export const API_TIMEOUT = 10000

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    UPLOAD_IMAGE: '/api/auth/uploadImage',
  },
  RESTAURANTS: {
    LIST: '/api/restaurants',
    DETAIL: '/api/restaurants/:id',
    SEARCH: '/api/restaurants/search',
  },
  // Add more endpoints as needed
} 