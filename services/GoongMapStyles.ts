import { GOONG_MAPTILES_KEY } from '@/constants'

/**
 * Goong Map Styles Configuration
 * 
 * Cung cấp các style URL cho Mapbox với Goong tiles
 * Hỗ trợ 3 styles: Light (default), Dark, Satellite
 */

export type MapStyle = 'light' | 'dark' | 'satellite'

export interface MapStyleConfig {
  id: MapStyle
  name: string
  icon: string
  description: string
  styleUrl: string
}

// Goong Map Style URLs
export const GOONG_MAP_STYLES: Record<MapStyle, string> = {
  light: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`,
  dark: `https://tiles.goong.io/assets/goong_map_dark.json?api_key=${GOONG_MAPTILES_KEY}`,
  satellite: `https://tiles.goong.io/assets/goong_satellite.json?api_key=${GOONG_MAPTILES_KEY}`
}

// Map Style Configurations với metadata
export const MAP_STYLE_CONFIGS: MapStyleConfig[] = [
  {
    id: 'light',
    name: 'Bản đồ',
    icon: '☀️',
    description: 'Bản đồ tiêu chuẩn với đường phố và địa danh',
    styleUrl: GOONG_MAP_STYLES.light
  },
  {
    id: 'dark',
    name: 'Tối',
    icon: '🌙',
    description: 'Bản đồ tối cho ban đêm, dễ nhìn hơn',
    styleUrl: GOONG_MAP_STYLES.dark
  },
  {
    id: 'satellite',
    name: 'Vệ tinh',
    icon: '🛰️',
    description: 'Hình ảnh vệ tinh thực tế',
    styleUrl: GOONG_MAP_STYLES.satellite
  }
]

/**
 * Get style URL by style ID
 * @param styleId - Style identifier
 * @returns Style URL string
 */
export function getMapStyleUrl(styleId: MapStyle): string {
  return GOONG_MAP_STYLES[styleId] || GOONG_MAP_STYLES.light
}

/**
 * Get style configuration by style ID
 * @param styleId - Style identifier
 * @returns Style configuration object
 */
export function getMapStyleConfig(styleId: MapStyle): MapStyleConfig {
  return MAP_STYLE_CONFIGS.find(config => config.id === styleId) || MAP_STYLE_CONFIGS[0]
}

/**
 * Get all available map styles
 * @returns Array of style configurations
 */
export function getAllMapStyles(): MapStyleConfig[] {
  return MAP_STYLE_CONFIGS
}

/**
 * Check if a style ID is valid
 * @param styleId - Style identifier to check
 * @returns True if valid style ID
 */
export function isValidMapStyle(styleId: string): styleId is MapStyle {
  return styleId in GOONG_MAP_STYLES
}

/**
 * Get default map style
 * @returns Default style ID
 */
export function getDefaultMapStyle(): MapStyle {
  return 'light'
}

// Style transition configurations
export const STYLE_TRANSITION = {
  duration: 500, // milliseconds
  delay: 0
}

// Map style validation
export function validateMapStyle(styleId: string): MapStyle {
  if (isValidMapStyle(styleId)) {
    return styleId
  }
  
  console.warn(`Invalid map style: ${styleId}. Falling back to light style.`)
  return 'light'
}
