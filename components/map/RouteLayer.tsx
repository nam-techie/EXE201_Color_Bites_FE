import type { DirectionResult } from '@/services/GoongDirectionService'
import Mapbox from '@rnmapbox/maps'
import { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

interface RouteLayerProps {
  routeData: DirectionResult | null
  visible?: boolean
  color?: string
  width?: number
  opacity?: number
  showArrows?: boolean
  alternativeRoutes?: DirectionResult[]
}

export default function RouteLayer({
  routeData,
  visible = true,
  color = '#3B82F6',
  width = 6,
  opacity = 0.8,
  showArrows = true,
  alternativeRoutes = []
}: RouteLayerProps) {
  const routeSourceRef = useRef<Mapbox.ShapeSource>(null)
  const alternativeSourceRef = useRef<Mapbox.ShapeSource>(null)

  // Convert route geometry to GeoJSON
  const routeToGeoJSON = (route: DirectionResult) => {
    if (!route.geometry || route.geometry.length === 0) return null

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: route.geometry.map(coord => [coord[0], coord[1]]) // [lng, lat]
      },
      properties: {
        distance: route.distance,
        duration: route.duration,
        color: color,
        width: width
      }
    }
  }

  // Convert alternative routes to GeoJSON
  const alternativesToGeoJSON = () => {
    if (alternativeRoutes.length === 0) return null

    return {
      type: 'FeatureCollection',
      features: alternativeRoutes.map((route, index) => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: route.geometry.map(coord => [coord[0], coord[1]])
        },
        properties: {
          distance: route.distance,
          duration: route.duration,
          alternative: true,
          index: index,
          color: '#6B7280',
          width: width - 2
        }
      }))
    }
  }

  // Update route source when route data changes
  useEffect(() => {
    if (routeData && routeSourceRef.current) {
      const geoJSON = routeToGeoJSON(routeData)
      if (geoJSON) {
        routeSourceRef.current.setShape(geoJSON)
      }
    }
  }, [routeData])

  // Update alternative routes source
  useEffect(() => {
    if (alternativeRoutes.length > 0 && alternativeSourceRef.current) {
      const geoJSON = alternativesToGeoJSON()
      if (geoJSON) {
        alternativeSourceRef.current.setShape(geoJSON)
      }
    }
  }, [alternativeRoutes])

  if (!visible || !routeData) return null

  return (
    <View style={styles.container}>
      {/* Alternative Routes */}
      {alternativeRoutes.length > 0 && (
        <Mapbox.ShapeSource
          ref={alternativeSourceRef}
          id="alternative-routes-source"
          shape={alternativesToGeoJSON()}
        >
          <Mapbox.LineLayer
            id="alternative-routes-line"
            style={{
              lineColor: '#6B7280',
              lineWidth: width - 2,
              lineOpacity: 0.6,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </Mapbox.ShapeSource>
      )}

      {/* Main Route */}
      <Mapbox.ShapeSource
        ref={routeSourceRef}
        id="route-source"
        shape={routeToGeoJSON(routeData)}
      >
        {/* Route Line */}
        <Mapbox.LineLayer
          id="route-line"
          style={{
            lineColor: color,
            lineWidth: width,
            lineOpacity: opacity,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />

        {/* Route Outline for better visibility */}
        <Mapbox.LineLayer
          id="route-outline"
          style={{
            lineColor: '#FFFFFF',
            lineWidth: width + 2,
            lineOpacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />

        {/* Direction Arrows */}
        {showArrows && (
          <Mapbox.SymbolLayer
            id="route-arrows"
            style={{
              symbolPlacement: 'line',
              symbolSpacing: 50,
              iconImage: 'arrow-icon',
              iconSize: 0.8,
              iconRotate: ['get', 'bearing'],
              iconRotationAlignment: 'map',
            }}
          />
        )}
      </Mapbox.ShapeSource>

      {/* Start Marker */}
      {routeData.geometry && routeData.geometry.length > 0 && (
        <Mapbox.ShapeSource
          id="start-marker-source"
          shape={{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: routeData.geometry[0]
            },
            properties: {
              type: 'start'
            }
          }}
        >
          <Mapbox.CircleLayer
            id="start-marker"
            style={{
              circleRadius: 8,
              circleColor: '#10B981',
              circleStrokeColor: '#FFFFFF',
              circleStrokeWidth: 3,
            }}
          />
        </Mapbox.ShapeSource>
      )}

      {/* End Marker */}
      {routeData.geometry && routeData.geometry.length > 0 && (
        <Mapbox.ShapeSource
          id="end-marker-source"
          shape={{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: routeData.geometry[routeData.geometry.length - 1]
            },
            properties: {
              type: 'end'
            }
          }}
        >
          <Mapbox.CircleLayer
            id="end-marker"
            style={{
              circleRadius: 10,
              circleColor: '#EF4444',
              circleStrokeColor: '#FFFFFF',
              circleStrokeWidth: 3,
            }}
          />
        </Mapbox.ShapeSource>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
})
