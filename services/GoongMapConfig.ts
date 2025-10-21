import { GOONG_MAP_STYLE } from '@/constants'
import Mapbox from '@rnmapbox/maps'

// Initialize Mapbox SDK với Goong tiles
Mapbox.setAccessToken(null) // Không cần Mapbox token
Mapbox.setConnected(true)

export { Mapbox }
export const GOONG_STYLE_URL = GOONG_MAP_STYLE
