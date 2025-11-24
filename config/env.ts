
/**
 * Environment Variables Configuration
 * 
 * Centralized configuration for all environment variables used in the app.
 * Uses EXPO_PUBLIC_* prefix for client-side variables as per Expo best practices.
 * 
 * @see https://docs.expo.dev/guides/environment-variables/
 */

import Constants from 'expo-constants'

// ============================================================================
// API Configuration
// ============================================================================

/**
 * Backend API Base URL
 * Priority: EXPO_PUBLIC_API_BASE_URL → Constants.expoConfig.extra.API_BASE_URL → fallback
 */
const getApiBaseUrl = (): string => {
  // 1. Check environment variable first
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl
  }

  // 2. Fallback to app.json extra (for backward compatibility)
  const extraUrl = (Constants?.expoConfig as any)?.extra?.API_BASE_URL as string | undefined
  if (extraUrl && extraUrl.trim().length > 0) {
    return extraUrl
  }

  // 3. Default fallback
  return 'https://mumii-be.namtechie.id.vn'
}

export const API_BASE_URL = getApiBaseUrl()

// ============================================================================
// Goong Maps Configuration
// ============================================================================

/**
 * Goong API Key (for Places API, Directions API)
 * Priority: EXPO_PUBLIC_GOONG_API_KEY → Constants.expoConfig.extra.GOONG_API_KEY → empty
 */
const getGoongApiKey = (): string => {
  const envKey = process.env.EXPO_PUBLIC_GOONG_API_KEY
  if (envKey && envKey.trim().length > 0) {
    return envKey
  }

  const extraKey = (Constants?.expoConfig as any)?.extra?.GOONG_API_KEY as string | undefined
  if (extraKey && extraKey.trim().length > 0) {
    return extraKey
  }

  return ''
}

/**
 * Goong Map Tiles Key (for Map Display)
 * Priority: EXPO_PUBLIC_GOONG_MAPTILES_KEY → Constants.expoConfig.extra.GOONG_MAPTILES_KEY → empty
 */
const getGoongMapTilesKey = (): string => {
  const envKey = process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY
  if (envKey && envKey.trim().length > 0) {
    return envKey
  }

  const extraKey = (Constants?.expoConfig as any)?.extra?.GOONG_MAPTILES_KEY as string | undefined
  if (extraKey && extraKey.trim().length > 0) {
    return extraKey
  }

  return ''
}

export const GOONG_API_KEY = getGoongApiKey()
export const GOONG_MAPTILES_KEY = getGoongMapTilesKey()

// ============================================================================
// Debug & Validation
// ============================================================================

/**
 * Debug function to log environment variable status
 */
export const logEnvStatus = (): void => {
  if (!__DEV__) return

  console.log('='.repeat(60))
  console.log('[ENV CONFIG] Environment Variables Status:')
  console.log('='.repeat(60))
  
  // API Base URL
  console.log(`[ENV CONFIG] API_BASE_URL: ${API_BASE_URL}`)
  console.log(`[ENV CONFIG] Source: ${process.env.EXPO_PUBLIC_API_BASE_URL ? 'EXPO_PUBLIC_API_BASE_URL' : 'app.json fallback'}`)
  
  // Goong API Key
  const hasGoongApi = GOONG_API_KEY.length > 0
  console.log(`[ENV CONFIG] GOONG_API_KEY: ${hasGoongApi ? '✅ configured' : '❌ missing'}`)
  console.log(`[ENV CONFIG] Source: ${process.env.EXPO_PUBLIC_GOONG_API_KEY ? 'EXPO_PUBLIC_GOONG_API_KEY' : 'app.json fallback'}`)
  
  // Goong Map Tiles Key
  const hasGoongTiles = GOONG_MAPTILES_KEY.length > 0
  console.log(`[ENV CONFIG] GOONG_MAPTILES_KEY: ${hasGoongTiles ? '✅ configured' : '❌ missing'}`)
  console.log(`[ENV CONFIG] Source: ${process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY ? 'EXPO_PUBLIC_GOONG_MAPTILES_KEY' : 'app.json fallback'}`)
  
  // Overall status
  const allConfigured = hasGoongApi && hasGoongTiles
  console.log(`[ENV CONFIG] Overall Status: ${allConfigured ? '✅ All configured' : '❌ Missing keys'}`)
  
  if (!allConfigured) {
    console.log('[ENV CONFIG] ⚠️  Please set the following environment variables:')
    if (!hasGoongApi) console.log('[ENV CONFIG]   - EXPO_PUBLIC_GOONG_API_KEY')
    if (!hasGoongTiles) console.log('[ENV CONFIG]   - EXPO_PUBLIC_GOONG_MAPTILES_KEY')
  }
  
  console.log('='.repeat(60))
}

/**
 * Validate that all required environment variables are configured
 */
export const validateEnvConfig = (): { valid: boolean; missing: string[] } => {
  const missing: string[] = []
  
  if (!GOONG_API_KEY) missing.push('EXPO_PUBLIC_GOONG_API_KEY')
  if (!GOONG_MAPTILES_KEY) missing.push('EXPO_PUBLIC_GOONG_MAPTILES_KEY')
  
  return {
    valid: missing.length === 0,
    missing
  }
}

// Auto-log in development
if (__DEV__) {
  logEnvStatus()
}
