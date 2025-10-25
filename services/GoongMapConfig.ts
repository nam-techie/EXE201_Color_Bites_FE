import MapLibreGL from '@maplibre/maplibre-react-native'

// MapLibre không dùng access token như Mapbox
MapLibreGL.setAccessToken(null)

export { MapLibreGL }
