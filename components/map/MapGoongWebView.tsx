import Constants from 'expo-constants'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

type Marker = { id: string; lat: number; lon: number }

interface MapGoongWebViewProps {
  center?: { lat: number; lon: number }
  zoom?: number
  markers?: Marker[]
  routeGeoJSON?: any
  onMessage?: (msg: any) => void
}

function getEnv() {
  const extra = Constants.expoConfig?.extra as any
  return {
    mapKey: (extra?.EXPO_PUBLIC_GOONG_MAP_KEY as string) || '',
    styleUrl: (extra?.EXPO_PUBLIC_GOONG_MAP_STYLE_URL as string) || 'https://tiles.goong.io/assets/goong_map_web.json',
  }
}

export default function MapGoongWebView({ center, zoom = 13, markers = [], routeGeoJSON, onMessage }: MapGoongWebViewProps) {
  const { mapKey, styleUrl } = getEnv()
  const webRef = useRef<WebView>(null)

  const html = `<!doctype html>
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
      <style> html,body,#map{height:100%;margin:0;padding:0} .marker{background:#f97316;width:10px;height:10px;border-radius:5px} </style>
      <script src="https://maps.goong.io/js/sdk.js?api_key=${mapKey}"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = new goongjs.Map({
          container: 'map',
          style: '${styleUrl}',
          center: [${center?.lon ?? 106.7}, ${center?.lat ?? 10.776}],
          zoom: ${zoom}
        });

        map.addControl(new goongjs.NavigationControl(), 'top-right');

        const rnBridge = {
          send: (obj) => { window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(obj)); }
        }

        function addMarkers(items){
          (items||[]).forEach(m => {
            const el = document.createElement('div');
            el.className = 'marker';
            new goongjs.Marker(el).setLngLat([m.lon, m.lat]).addTo(map);
          })
        }

        function setRouteGeoJSON(geojson){
          try{
            if(!geojson) return;
            if(map.getSource('route-src')){
              map.getSource('route-src').setData(geojson);
              return;
            }
            map.addSource('route-src', { type: 'geojson', data: geojson });
            map.addLayer({ id: 'route-line', type: 'line', source: 'route-src', paint: { 'line-color': '#3887be', 'line-width': 6 } })
          }catch(e){ rnBridge.send({ type:'error', message: e?.message }) }
        }

        map.on('load', () => {
          addMarkers(${JSON.stringify(markers)});
          ${routeGeoJSON ? `setRouteGeoJSON(${JSON.stringify(routeGeoJSON)});` : ''}
        });

        map.on('click', (e) => rnBridge.send({ type:'tap', lng: e.lngLat.lng, lat: e.lngLat.lat }));

        window.addEventListener('message', (ev) => {
          try{
            const payload = JSON.parse(ev.data);
            if(payload?.type === 'setCamera'){
              map.easeTo({ center: [payload.lon, payload.lat], zoom: payload.zoom || map.getZoom() });
            } else if(payload?.type === 'setMarkers'){
              addMarkers(payload.markers || []);
            } else if(payload?.type === 'setRouteGeoJSON'){
              setRouteGeoJSON(payload.geojson);
            }
          }catch(_){/* ignore */}
        })
      </script>
    </body>
  </html>`

  // Sync updates to WebView after initial load
  useEffect(() => {
    if (!webRef.current || !center) return
    try {
      webRef.current.postMessage(JSON.stringify({ type: 'setCamera', lat: center.lat, lon: center.lon, zoom }))
    } catch {}
  }, [center?.lat, center?.lon, zoom])

  useEffect(() => {
    if (!webRef.current || !markers) return
    try { webRef.current.postMessage(JSON.stringify({ type: 'setMarkers', markers })) } catch {}
  }, [markers])

  useEffect(() => {
    if (!webRef.current || !routeGeoJSON) return
    try { webRef.current.postMessage(JSON.stringify({ type: 'setRouteGeoJSON', geojson: routeGeoJSON })) } catch {}
  }, [routeGeoJSON])

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef}
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={(e) => {
          try { onMessage && onMessage(JSON.parse(e.nativeEvent.data)) } catch { /* ignore */ }
        }}
      />
    </View>
  )
}


