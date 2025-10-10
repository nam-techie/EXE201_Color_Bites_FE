# 🗺️ Map Provider Guide - Hướng dẫn chi tiết

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
3. [Cách chuyển đổi Provider](#cách-chuyển-đổi-provider)
4. [API Reference](#api-reference)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

---

## 🎯 Tổng quan

Color Bites app hỗ trợ **2 map providers**:

### 1. **Google Maps** (Mặc định)
- **Places API**: Tìm kiếm nhà hàng
- **Directions API**: Chỉ đường
- **Ưu điểm**: Dữ liệu chính xác, real-time traffic, thông tin phong phú
- **Nhược điểm**: Có giới hạn request, cần API key có billing

### 2. **OpenStreetMap** (Fallback)
- **Overpass API**: Tìm kiếm nhà hàng (miễn phí)
- **OpenRouteService**: Chỉ đường (2000 requests/day)
- **Ưu điểm**: Miễn phí, open source
- **Nhược điểm**: Dữ liệu ít chi tiết hơn, không có real-time traffic

---

## 🏗️ Kiến trúc hệ thống

```
app/(tabs)/map.tsx
       ↓
services/MapProvider.ts (Abstraction Layer)
       ↓
   ┌───────────────────┐
   ↓                   ↓
Google Maps      OpenStreetMap
   ↓                   ↓
GoogleMapService   MapService
GoogleDirectionService   DirectionService
```

### File Structure

```
services/
├── MapProvider.ts              # 🆕 Abstraction layer (Switch provider)
├── GoogleMapService.ts         # 🆕 Google Places API
├── GoogleDirectionService.ts   # 🆕 Google Directions API
├── MapService.ts               # ✅ OpenStreetMap (giữ nguyên)
└── DirectionService.ts         # ✅ OpenRouteService (giữ nguyên)

constants/
└── index.ts                    # 🔧 Cấu hình MAP_PROVIDER

app/(tabs)/
└── map.tsx                     # 🔧 Cập nhật dùng MapProvider
```

---

## 🔀 Cách chuyển đổi Provider

### Phương pháp 1: Thay đổi trong constants (Khuyến nghị)

**Bước 1**: Mở file `constants/index.ts`

**Bước 2**: Tìm dòng 40, đổi giá trị `MAP_PROVIDER`:

```typescript
// Đổi từ 'google' sang 'openstreetmap'
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 'openstreetmap'
```

**Bước 3**: Restart app

```bash
# Stop server (Ctrl+C)
npm start
```

**Bước 4**: Kiểm tra console log

```
[ENV DEBUG] Map provider: openstreetmap
[MapProvider] Initialized with OpenStreetMap API
```

### Phương pháp 2: Environment Variable (Advanced)

Thêm vào `.env`:

```env
EXPO_PUBLIC_MAP_PROVIDER=openstreetmap
```

Cập nhật `constants/index.ts`:

```typescript
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 
  (process.env.EXPO_PUBLIC_MAP_PROVIDER as any) || 'google'
```

---

## 📚 API Reference

### MapProvider API

```typescript
import { MapProvider } from '@/services/MapProvider'
```

#### 1. Lấy thông tin provider hiện tại

```typescript
const provider = MapProvider.getProvider()
// Returns: 'google' | 'openstreetmap'
```

#### 2. Tìm kiếm nhà hàng gần vị trí

```typescript
const restaurants = await MapProvider.fetchRestaurants(
  latitude: number,
  longitude: number,
  radius?: number // mặc định 2000m
)
// Returns: Restaurant[]
```

**Ví dụ**:
```typescript
const restaurants = await MapProvider.fetchRestaurants(
  10.762622,  // Latitude
  106.660172, // Longitude
  3000        // Bán kính 3km
)
```

#### 3. Lấy chỉ đường giữa 2 điểm

```typescript
const route = await MapProvider.getDirections(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  profile?: string // 'driving-car' | 'cycling-regular' | 'foot-walking'
)
// Returns: DirectionResult | null
```

**Ví dụ**:
```typescript
const route = await MapProvider.getDirections(
  { lat: 10.762622, lon: 106.660172 },
  { lat: 10.771999, lon: 106.698000 },
  'driving-car'
)

console.log(route.distance) // meters
console.log(route.duration) // seconds
console.log(route.geometry) // [[lon, lat], ...]
```

#### 4. Tối ưu route cho nhiều điểm

```typescript
const route = await MapProvider.getOptimizedRoute(
  waypoints: { lat: number; lon: number }[],
  profile?: string
)
// Returns: DirectionResult | null
```

**Ví dụ**:
```typescript
const waypoints = [
  { lat: 10.762622, lon: 106.660172 }, // Điểm A
  { lat: 10.771999, lon: 106.698000 }, // Điểm B
  { lat: 10.780000, lon: 106.700000 }, // Điểm C
]

const route = await MapProvider.getOptimizedRoute(waypoints, 'cycling-regular')
```

#### 5. Lấy các route thay thế

```typescript
const routes = await MapProvider.getRouteAlternatives(
  origin: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  profile?: string,
  alternativeRoutes?: number // mặc định 2
)
// Returns: DirectionResult[] | null
```

#### 6. Tìm kiếm nhà hàng theo từ khóa

```typescript
const restaurants = await MapProvider.searchRestaurants(
  query: string,
  latitude?: number,
  longitude?: number,
  radius?: number
)
// Returns: Restaurant[]
```

**Ví dụ**:
```typescript
// Tìm pizza gần vị trí hiện tại
const pizzaPlaces = await MapProvider.searchRestaurants(
  'pizza',
  10.762622,
  106.660172,
  5000
)
```

#### 7. Lấy chi tiết nhà hàng (Google only)

```typescript
const restaurant = await MapProvider.getRestaurantDetails(placeId: string)
// Returns: Restaurant | null
```

**Lưu ý**: Chỉ hoạt động với Google Maps provider.

#### 8. Kiểm tra trạng thái provider

```typescript
import { checkProviderStatus, logProviderInfo } from '@/services/MapProvider'

const status = checkProviderStatus()
console.log(status.provider)    // 'Google Maps' | 'OpenStreetMap'
console.log(status.configured)  // true | false
console.log(status.message)     // Chi tiết

// Hoặc log trực tiếp
logProviderInfo()
```

### Utility Functions

```typescript
import {
  formatDistance,
  formatDuration,
  getCuisineIcon,
  calculateDistance,
} from '@/services/MapProvider'

// Format khoảng cách
formatDistance(1500) // "1.5km"
formatDistance(800)  // "800m"

// Format thời gian
formatDuration(3600) // "1h 0m"
formatDuration(1800) // "30m"

// Lấy icon theo loại cuisine
const { name, color } = getCuisineIcon('vietnamese')
// { name: 'noodles', color: '#22C55E' }

// Tính khoảng cách giữa 2 điểm (km)
const distance = calculateDistance(
  10.762622, 106.660172, // Point A
  10.771999, 106.698000  // Point B
)
```

---

## 🐛 Troubleshooting

### 1. Lỗi: "API key not configured"

**Console log**:
```
[GoogleMapService] API key not configured
[MapProvider] Status: ❌ Not Configured
```

**Nguyên nhân**: Chưa cấu hình API key

**Giải pháp**:
1. Tạo file `.env`:
   ```env
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
   ```
2. Restart server: `npm start`
3. Hoặc chuyển sang OpenStreetMap:
   ```typescript
   export const MAP_PROVIDER = 'openstreetmap'
   ```

### 2. Lỗi: "REQUEST_DENIED"

**Console log**:
```
[GoogleMapService] API returned error status: REQUEST_DENIED
```

**Nguyên nhân**: API key bị từ chối

**Giải pháp**:
1. Kiểm tra API key có đúng không
2. Kiểm tra đã enable APIs:
   - Places API
   - Directions API
3. Kiểm tra restrictions (nếu có)
4. Thử tạo API key mới không có restrictions

### 3. Lỗi: "OVER_QUERY_LIMIT"

**Console log**:
```
[GoogleMapService] API returned error status: OVER_QUERY_LIMIT
Đã vượt quá giới hạn request. Hãy chuyển sang OpenStreetMap.
```

**Nguyên nhân**: Hết quota

**Giải pháp**:
1. **Tạm thời**: Chuyển sang OpenStreetMap
   ```typescript
   export const MAP_PROVIDER = 'openstreetmap'
   ```
2. **Lâu dài**: 
   - Kiểm tra Google Cloud billing
   - Tăng quota
   - Optimize code để giảm số requests

### 4. Không tìm thấy nhà hàng

**Console log**:
```
[GoogleMapService] Found 0 restaurants
```

**Nguyên nhân**: 
- Không có nhà hàng trong bán kính
- API key chưa enable Places API
- Vị trí không chính xác

**Giải pháp**:
1. Tăng bán kính tìm kiếm:
   ```typescript
   const restaurants = await MapProvider.fetchRestaurants(lat, lon, 5000)
   ```
2. Thử đổi provider để so sánh
3. Kiểm tra location permissions

### 5. Route không hiển thị

**Nguyên nhân**:
- API key chưa enable Directions API
- Không có đường đi giữa 2 điểm
- Profile không hợp lệ

**Giải pháp**:
1. Kiểm tra console log
2. Thử profile khác:
   ```typescript
   const route = await MapProvider.getDirections(
     origin, 
     destination, 
     'foot-walking' // Thay vì 'driving-car'
   )
   ```
3. Kiểm tra 2 điểm có quá xa không

### 6. Polyline không decode được

**Lỗi**: Route hiển thị sai

**Nguyên nhân**: Google trả về encoded polyline

**Giải pháp**: Code đã xử lý tự động, nếu vẫn lỗi:
1. Kiểm tra `GoogleDirectionService.ts` function `decodePolyline`
2. Log geometry để debug:
   ```typescript
   console.log('Geometry:', route.geometry)
   ```

---

## ✅ Best Practices

### 1. Quản lý API Keys

```typescript
// ❌ KHÔNG làm thế này
const API_KEY = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXX' // Hard-code

// ✅ Làm thế này
// Dùng environment variables
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
```

### 2. Error Handling

```typescript
// ❌ KHÔNG làm thế này
const restaurants = await MapProvider.fetchRestaurants(lat, lon)

// ✅ Làm thế này
try {
  const restaurants = await MapProvider.fetchRestaurants(lat, lon)
  if (restaurants.length === 0) {
    Alert.alert('Thông báo', 'Không tìm thấy nhà hàng gần đây')
  }
} catch (error) {
  console.error('Error fetching restaurants:', error)
  Alert.alert('Lỗi', 'Không thể tải dữ liệu')
}
```

### 3. Optimize Requests

```typescript
// ❌ KHÔNG gọi API liên tục
useEffect(() => {
  MapProvider.fetchRestaurants(lat, lon)
}, [lat, lon]) // Re-fetch mỗi khi lat/lon thay đổi

// ✅ Debounce hoặc throttle
import { debounce } from 'lodash'

const fetchRestaurants = debounce(async (lat, lon) => {
  const data = await MapProvider.fetchRestaurants(lat, lon)
  setRestaurants(data)
}, 500)

useEffect(() => {
  fetchRestaurants(lat, lon)
}, [lat, lon])
```

### 4. Cache Results

```typescript
// Cache restaurants để tránh gọi API lại
const restaurantCache = new Map()

async function fetchRestaurantsWithCache(lat, lon) {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`
  
  if (restaurantCache.has(key)) {
    return restaurantCache.get(key)
  }
  
  const restaurants = await MapProvider.fetchRestaurants(lat, lon)
  restaurantCache.set(key, restaurants)
  
  return restaurants
}
```

### 5. Fallback Strategy

```typescript
// Tự động fallback khi Google Maps lỗi
async function fetchRestaurantsWithFallback(lat, lon) {
  try {
    // Thử Google Maps trước
    const restaurants = await MapProvider.fetchRestaurants(lat, lon)
    if (restaurants.length > 0) return restaurants
  } catch (error) {
    console.warn('Google Maps failed, trying OpenStreetMap...')
  }
  
  // Fallback sang OpenStreetMap
  // Tạm thời đổi provider
  const originalProvider = MAP_PROVIDER
  MAP_PROVIDER = 'openstreetmap'
  
  const restaurants = await MapProvider.fetchRestaurants(lat, lon)
  
  // Restore provider
  MAP_PROVIDER = originalProvider
  
  return restaurants
}
```

### 6. Monitor Usage

```typescript
// Track số lượng API calls
let apiCallCount = 0

async function fetchRestaurants(lat, lon) {
  apiCallCount++
  console.log('[API Usage] Total calls:', apiCallCount)
  
  if (apiCallCount > 100) {
    console.warn('[API Usage] High usage detected!')
  }
  
  return MapProvider.fetchRestaurants(lat, lon)
}
```

---

## 📊 So sánh chi tiết

| Feature | Google Maps | OpenStreetMap |
|---------|-------------|---------------|
| **Places API** | ✅ Rất chi tiết | ⚠️ Cơ bản |
| **Directions API** | ✅ Real-time traffic | ✅ Tốt |
| **Free tier** | $200/tháng | Unlimited (Overpass)<br>2000/day (ORS) |
| **Rate limit** | Cao | Thấp |
| **Latency** | Nhanh | Trung bình |
| **Data freshness** | Real-time | Cập nhật định kỳ |
| **Restaurant info** | Name, rating, photos, reviews | Name, cuisine, hours |
| **Route optimization** | ✅ | ✅ |
| **Alternative routes** | ✅ | ✅ |
| **Traffic data** | ✅ Real-time | ❌ |
| **Indoor maps** | ✅ | ❌ |
| **Street View** | ✅ | ❌ |

---

## 🔗 Resources

### Google Maps
- [Google Maps Platform](https://mapsplatform.google.com/)
- [Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API Docs](https://developers.google.com/maps/documentation/directions)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)

### OpenStreetMap
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [OpenRouteService](https://openrouteservice.org/)
- [Nominatim](https://nominatim.org/)

### Expo
- [Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Location API](https://docs.expo.dev/versions/latest/sdk/location/)

---

## 📝 Changelog

### v1.0.0 (2025-10-10)
- ✅ Thêm Google Maps API support
- ✅ Tạo MapProvider abstraction layer
- ✅ Giữ nguyên OpenStreetMap support
- ✅ Dễ dàng switch giữa 2 providers
- ✅ Full documentation

---

## 🤝 Contributing

Nếu bạn muốn thêm provider mới (ví dụ: Mapbox, HERE Maps):

1. Tạo service mới: `services/NewProviderService.ts`
2. Implement các functions tương tự `GoogleMapService.ts`
3. Cập nhật `MapProvider.ts` để support provider mới
4. Cập nhật `constants/index.ts`:
   ```typescript
   export const MAP_PROVIDER: 'google' | 'openstreetmap' | 'newprovider' = 'google'
   ```
5. Update docs

---

**Cập nhật lần cuối**: 2025-10-10  
**Tác giả**: Color Bites Team  
**Version**: 1.0.0

