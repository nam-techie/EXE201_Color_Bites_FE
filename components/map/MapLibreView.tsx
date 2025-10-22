import { MapView } from '@maplibre/maplibre-react-native'
import { useMemo } from 'react'
import { View } from 'react-native'

export default function MapLibreView({ styleURL }: { styleURL: string }) {
  const url = useMemo(() => styleURL, [styleURL])
  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} styleURL={url} compassEnabled zoomEnabled />
    </View>
  )
}


