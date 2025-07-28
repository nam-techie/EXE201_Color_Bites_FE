// API Configuration
export const OPENROUTE_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImFiMWU5ZjI3MzkzYjRhZTJhOGY5MWNjMDU1OTk4M2E3IiwiaCI6Im11cm11cjY0In0="

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
    "driving-car": 3000,
    "driving-hgv": 5000,
    "cycling-regular": 0,
    "foot-walking": 0,
} as const
