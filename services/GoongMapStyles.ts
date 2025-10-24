import Constants from 'expo-constants'

// Lấy Maptiles Key từ environment variables
const getGoongMaptilesKey = (): string => {
  const envKey = process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY
  const extraKey = (Constants?.expoConfig as any)?.extra?.GOONG_MAPTILES_KEY as string | undefined
  return envKey || extraKey || ''
}

const GOONG_MAPTILES_KEY = getGoongMaptilesKey()

// Map Style Types
export type MapStyle = 'light' | 'dark' | 'web' | 'satellite' | 'highlight'

// Map Style URLs
export const GOONG_MAP_STYLES: Record<MapStyle, string> = {
  web: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`,
  light: `https://tiles.goong.io/assets/goong_map_light.json?api_key=${GOONG_MAPTILES_KEY}`,
  dark: `https://tiles.goong.io/assets/goong_map_dark.json?api_key=${GOONG_MAPTILES_KEY}`,
  satellite: `https://tiles.goong.io/assets/goong_satellite.json?api_key=${GOONG_MAPTILES_KEY}`,
  highlight: `https://tiles.goong.io/assets/goong_map_highlight.json?api_key=${GOONG_MAPTILES_KEY}`
}

// Debug: Log API key status
if (__DEV__) {
  console.log('[GoongMapStyles] MapTiles Key configured:', GOONG_MAPTILES_KEY ? '✅' : '❌ VUI LÒNG KIỂM TRA LẠI .ENV')
  console.log('[GoongMapStyles] MapTiles Key value:', GOONG_MAPTILES_KEY ? `${GOONG_MAPTILES_KEY.substring(0, 8)}...` : 'undefined')
  
  // Debug: Log generated URLs
  console.log('[GoongMapStyles] Generated URLs:')
  Object.entries(GOONG_MAP_STYLES).forEach(([key, url]) => {
    console.log(`[GoongMapStyles] ${key}: ${url}`)
  })
}

// Map Style Configuration
export interface MapStyleConfig {
  id: MapStyle
  name: string
  icon: string
  description: string
  styleUrl: string
}

export const MAP_STYLE_CONFIGS: MapStyleConfig[] = [
  {
    id: 'web',
    name: 'Bản đồ',
    icon: '🗺️',
    description: 'Bản đồ chi tiết Việt Nam với POI và địa danh',
    styleUrl: GOONG_MAP_STYLES.web
  },
  {
    id: 'light',
    name: 'Sáng',
    icon: '☀️',
    description: 'Bản đồ sáng với độ tương phản cao',
    styleUrl: GOONG_MAP_STYLES.light
  },
  {
    id: 'dark',
    name: 'Tối',
    icon: '🌙',
    description: 'Bản đồ tối cho mắt dễ chịu',
    styleUrl: GOONG_MAP_STYLES.dark
  },
  {
    id: 'satellite',
    name: 'Vệ tinh',
    icon: '🛰️',
    description: 'Hình ảnh vệ tinh thực tế',
    styleUrl: GOONG_MAP_STYLES.satellite
  },
  {
    id: 'highlight',
    name: 'Nổi bật',
    icon: '⭐',
    description: 'Bản đồ đơn giản với các điểm nổi bật',
    styleUrl: GOONG_MAP_STYLES.highlight
  }
]

// Helper Functions
export const getMapStyleUrl = (styleId: MapStyle): string => {
  return GOONG_MAP_STYLES[styleId] || GOONG_MAP_STYLES.web
}

export const getDefaultMapStyle = (): MapStyle => {
  return 'web'
}

export const validateMapStyle = (styleId: string): MapStyle => {
  const validStyles: MapStyle[] = ['light', 'dark', 'web', 'satellite', 'highlight']
  return validStyles.includes(styleId as MapStyle) ? (styleId as MapStyle) : 'web'
}

export const getMapStyleConfig = (styleId: MapStyle): MapStyleConfig | undefined => {
  return MAP_STYLE_CONFIGS.find(config => config.id === styleId)
}

// Export all styles for easy access
export const ALL_MAP_STYLES = Object.keys(GOONG_MAP_STYLES) as MapStyle[]
