import Constants from 'expo-constants';

// --- HÀM LẤY KEY TỪ app.json ---
const getGoongMaptilesKeyFromAppJson = (): string => {
  // Constants.expoConfig chứa toàn bộ nội dung của app.json
  // Chúng ta truy cập vào mục "extra" và lấy key
  // Dấu ?. là optional chaining để tránh lỗi nếu "extra" không tồn tại
  const key = (Constants.expoConfig as any)?.extra?.GOONG_MAPTILES_KEY;
  return key || '';
};

// Lấy Maptiles Key từ app.json (ưu tiên) hoặc environment variables (fallback)
const getGoongMaptilesKey = (): string => {
  const appJsonKey = getGoongMaptilesKeyFromAppJson()
  const envKey = process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY
  return appJsonKey || envKey || ''
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

// In ra để kiểm tra xem key đã được load đúng từ app.json chưa
if (__DEV__) {
  const appJsonKey = getGoongMaptilesKeyFromAppJson()
  const envKey = process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY
  
  console.log('[GoongMapStyles] Đọc MapTiles Key từ app.json:', appJsonKey ? `✅ CÓ KEY: ...${appJsonKey.slice(-5)}` : '❌ KHÔNG TÌM THẤY KEY TRONG app.json')
  console.log('[GoongMapStyles] Fallback từ .env:', envKey ? `✅ CÓ KEY: ...${envKey.slice(-5)}` : '❌ KHÔNG CÓ KEY TRONG .ENV')
  console.log('[GoongMapStyles] Key cuối cùng được sử dụng:', GOONG_MAPTILES_KEY ? `✅ ${GOONG_MAPTILES_KEY.substring(0, 8)}...` : '❌ UNDEFINED')
  
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
