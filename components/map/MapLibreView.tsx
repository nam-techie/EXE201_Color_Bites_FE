import type { Restaurant } from '@/type/location'
import { Camera, LineLayer, MapView, PointAnnotation, ShapeSource } from '@maplibre/maplibre-react-native'
import { useMemo, useRef } from 'react'
import { View } from 'react-native'

interface MapLibreViewProps {
  styleURL: string
  restaurants?: Restaurant[]
  selectedRestaurant?: Restaurant | null
  onMarkerPress?: (restaurant: Restaurant) => void
  userLocation?: { latitude: number; longitude: number } | null
  routeCoordinates?: { latitude: number; longitude: number }[]
}

export default function MapLibreView({ 
  styleURL, 
  restaurants = [], 
  selectedRestaurant,
  onMarkerPress,
  userLocation,
  routeCoordinates = []
}: MapLibreViewProps) {
  const url = useMemo(() => styleURL, [styleURL])
  const cameraRef = useRef<any>(null)

  // Center map on user location or default center
  const centerCoordinate = userLocation 
    ? [userLocation.longitude, userLocation.latitude] as [number, number]
    : [106.6297, 10.8231] as [number, number] // Ho Chi Minh City

  return (
    <View style={{ flex: 1 }}>
      <MapView 
        style={{ flex: 1 }} 
        {...({ styleURL: url } as any)}
        compassEnabled 
        zoomEnabled
        logoEnabled={false}
        attributionEnabled={false}
        projection="mercator"
        localizeLabels={true}
      >
        <Camera
          ref={cameraRef}
          centerCoordinate={centerCoordinate}
          zoomLevel={14}
        />

        {/* User location marker */}
        {userLocation && (
          <PointAnnotation
            id="user-location"
            coordinate={[userLocation.longitude, userLocation.latitude]}
          >
            <View style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#3B82F6',
              borderWidth: 3,
              borderColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }} />
          </PointAnnotation>
        )}

        {/* Restaurant markers */}
        {restaurants.map((restaurant) => (
          <PointAnnotation
            key={restaurant.id}
            id={`restaurant-${restaurant.id}`}
            coordinate={[restaurant.lon, restaurant.lat]}
            onSelected={() => onMarkerPress?.(restaurant)}
          >
            <View style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: selectedRestaurant?.id === restaurant.id ? '#EF4444' : '#F97316',
              borderWidth: 2,
              borderColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#FFFFFF',
              }} />
            </View>
          </PointAnnotation>
        ))}

        {/* Route line */}
        {routeCoordinates.length > 0 && (
          <ShapeSource
            id="route-source"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates.map(coord => [coord.longitude, coord.latitude])
              },
              properties: {}
            }}
          >
            <LineLayer
              id="route-line"
              style={{
                lineColor: '#3B82F6',
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          </ShapeSource>
        )}
      </MapView>
    </View>
  )
}


