<!-- 35e86369-9dff-4c8d-84ef-78312341b2e1 5bdee60a-f071-4404-a849-e529484337da -->
# Kế Hoạch Tích Hợp Mapbox SDK với Goong Maps

## 📋 Tổng Quan

Thay thế hoàn toàn hệ thống map hiện tại (react-native-maps + WebView) bằng Mapbox SDK (@rnmapbox/maps) với Goong tiles. UI mới theo phong cách hiện đại, hỗ trợ tìm kiếm địa chỉ, chỉ đường, và multiple map styles.

---

## 🎯 Mục Tiêu Chính

1. ✅ Gỡ bỏ hoàn toàn map cũ (react-native-maps, MapLibreView, MapGoongWebView)
2. ✅ Cài đặt và cấu hình @rnmapbox/maps với Goong tiles
3. ✅ Xây dựng UI map mới với search, directions, và map styles
4. ✅ Tích hợp Goong Autocomplete API cho tìm kiếm
5. ✅ Tích hợp Goong Directions API cho chỉ đường
6. ✅ Thêm current location tracking
7. ✅ Hỗ trợ 3 map styles: Light, Dark, Satellite

---

## 📝 Chi Tiết Thực Hiện

### PHASE 1: Cleanup & Dependencies

#### 1.1 Gỡ bỏ thư viện cũ

- Xóa `react-native-maps` khỏi package.json
- Xóa `react-native-webview` (nếu chỉ dùng cho map)
- Xóa file `components/map/MapLibreView.tsx`
- Xóa file `components/map/MapGoongWebView.tsx`
- Xóa các import liên quan trong map.tsx

#### 1.2 Cài đặt Mapbox SDK

```bash
npm install @rnmapbox/maps@^10.1.39
```

#### 1.3 Cấu hình Mapbox SDK

- **File**: `app.json`
  - Thêm config cho @rnmapbox/maps
  - Setup Goong tiles URL
- **File**: `babel.config.js`
  - Thêm plugin cho Mapbox (nếu cần)

---

### PHASE 2: Goong Map Styles Configuration

#### 2.1 Tạo file cấu hình map styles

- **File mới**: `services/GoongMapStyles.ts`
  - Define 3 styles: Light (default), Dark, Satellite
  - URLs từ Goong tiles API
```typescript
export const GOONG_MAP_STYLES = {
  light: `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`,
  dark: `https://tiles.goong.io/assets/goong_map_dark.json?api_key=${GOONG_MAPTILES_KEY}`,
  satellite: `https://tiles.goong.io/assets/goong_satellite.json?api_key=${GOONG_MAPTILES_KEY}`
}
```


---

### PHASE 3: UI Components - Search & Controls

#### 3.1 Tạo Search Component mới

- **File mới**: `components/map/MapSearchBar.tsx`
  - Input field với autocomplete
  - Dropdown suggestions từ Goong API
  - Debounce search (300ms)
  - Clear button
  - Recent searches cache

#### 3.2 Tạo Map Style Selector

- **File mới**: `components/map/MapStyleSelector.tsx`
  - 3 buttons: Light, Dark, Satellite
  - Icons phù hợp cho mỗi style
  - Animated selection indicator

#### 3.3 Tạo Current Location Button

- **File mới**: `components/map/CurrentLocationButton.tsx`
  - FAB button ở góc phải màn hình
  - Animate khi đang fetch location
  - Fly to user location khi tap

#### 3.4 Navigation Panel Component

- **File mới**: `components/map/NavigationPanel.tsx`
  - Hiển thị route summary (distance, duration, cost)
  - Step-by-step directions
  - Vehicle selector (car, bike, taxi, motorbike)
  - Start navigation button
  - Swipeable panel (collapse/expand)

---

### PHASE 4: Main Map Screen

#### 4.1 Refactor map.tsx hoàn toàn

- **File**: `app/(tabs)/map.tsx`

**Layout mới:**

```
┌────────────────────────────────┐
│  [≡] Search Bar        [👤]   │ ← Top: Search + Avatar
├────────────────────────────────┤
│                                │
│      MAPBOX VIEW               │
│      with Goong Tiles          │
│                                │
│                                │
│                    [🌓] Style  │ ← Right: Style selector
│                    [📍] MyLoc  │ ← Right: Current location
│                                │
├────────────────────────────────┤
│  Navigation Panel (swipeable)  │ ← Bottom: Directions
└────────────────────────────────┘
```

**State Management:**

- `mapStyle`: 'light' | 'dark' | 'satellite'
- `userLocation`: current coordinates
- `searchQuery`: search text
- `searchResults`: Goong autocomplete results
- `selectedPlace`: place detail
- `routeData`: directions from Goong
- `navigationMode`: boolean

**Key Features:**

- Mapbox MapView với Goong styleURL
- Custom markers cho restaurants
- Route line layer
- User location marker với heading indicator
- Tap handlers cho markers

---

### PHASE 5: Service Layer Integration

#### 5.1 Cập nhật GoongService.ts

- **File**: `services/GoongService.ts`
  - Enhance autocompleteV2: add more params
  - Add caching cho recent searches
  - Add error retry logic

#### 5.2 Cập nhật GoongDirectionService.ts

- **File**: `services/GoongDirectionService.ts`
  - Format geometry cho Mapbox LineLayer
  - Add turn-by-turn instructions parsing
  - Add ETA calculation với traffic

#### 5.3 Location Service

- **File mới**: `services/LocationService.ts`
  - getCurrentLocation()
  - watchLocation() - continuous tracking
  - requestPermissions()
  - calculateHeading() cho direction arrow

---

### PHASE 6: Marker & Route Rendering

#### 6.1 Custom Marker Component

- **File mới**: `components/map/MapboxRestaurantMarker.tsx`
  - Use Mapbox SymbolLayer
  - Custom icon từ cuisine type
  - Cluster markers khi zoom out
  - Tap animation

#### 6.2 Route Layer Component

- **File mới**: `components/map/RouteLayer.tsx`
  - LineLayer với gradient color
  - Arrow markers cho direction
  - Alternative routes với opacity khác nhau
  - Animate route drawing

---

### PHASE 7: Advanced Features

#### 7.1 Camera Controls

- Smooth flyTo animations
- Follow user mode (auto-center)
- Pitch/bearing controls
- Zoom to fit route bounds

#### 7.2 Offline Caching

- Cache map tiles for offline use
- Save recent searches
- Cache directions

#### 7.3 Performance Optimization

- Debounce search queries
- Virtualize marker rendering
- Lazy load route geometry
- Compress API responses

---

### PHASE 8: Testing & Polish

#### 8.1 Prebuild & Run

```bash
npx expo prebuild --clean
npx expo run:android
```

#### 8.2 Test Checklist

- [ ] Map displays với Goong tiles
- [ ] Search autocomplete hoạt động
- [ ] Select place → fly to location
- [ ] Directions từ current location
- [ ] Switch map styles smoothly
- [ ] Current location button
- [ ] Markers hiển thị đúng
- [ ] Route line render smooth
- [ ] Navigation panel swipeable
- [ ] Performance tốt (60fps)

---

## 🗂️ Cấu Trúc File Mới

```
services/
├── GoongMapStyles.ts          # NEW - Map style configs
├── LocationService.ts         # NEW - Location tracking
├── GoongService.ts            # UPDATED - Enhanced autocomplete
├── GoongDirectionService.ts   # UPDATED - Mapbox format
└── MapProvider.ts             # UPDATED - Add style methods

components/map/
├── MapSearchBar.tsx           # NEW - Search with autocomplete
├── MapStyleSelector.tsx       # NEW - Style switcher
├── CurrentLocationButton.tsx  # NEW - My location FAB
├── NavigationPanel.tsx        # NEW - Directions panel
├── MapboxRestaurantMarker.tsx # NEW - Custom markers
├── RouteLayer.tsx             # NEW - Route rendering
├── MapLibreView.tsx           # DELETE
├── MapGoongWebView.tsx        # DELETE
├── RoutePlanningPanel.tsx     # KEEP/REFACTOR
└── RouteProfileSelector.tsx   # KEEP/REFACTOR

app/(tabs)/
└── map.tsx                    # COMPLETE REWRITE

package.json                   # UPDATED - Dependencies
app.json                       # UPDATED - Mapbox config
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **@rnmapbox/maps yêu cầu Expo Dev Client**, không chạy được trên Expo Go
2. **Phải chạy `npx expo prebuild --clean`** sau khi cài dependency
3. **Android**: Cần thêm permissions trong AndroidManifest.xml (auto generate)
4. **iOS**: Cần location permissions trong Info.plist (auto generate)
5. **Goong API Keys**: Đảm bảo có cả API_KEY và MAPTILES_KEY
6. **Map Styles**: Goong có thể không có dark/satellite style → fallback to light

---

## 🎨 UI/UX Improvements

### Search Bar

- Floating trên map như Google Maps
- Auto-focus khi tap
- Show loading spinner khi fetching
- Empty state message
- Error handling UI

### Map Styles

- Icons: ☀️ Light, 🌙 Dark, 🛰️ Satellite
- Smooth transition animation (fade)
- Persist user preference

### Navigation

- Bottom sheet với drag handle
- Collapse/expand animation
- Show route overview trước
- Step-by-step khi start navigation

### Markers

- Cluster khi >50 markers
- Pulse animation khi select
- Custom icon theo cuisine
- Show price tag

---

## 🔧 Implementation Priority

**P0 (Critical - Must have):**

1. Setup Mapbox SDK với Goong tiles
2. Basic map display với user location
3. Search autocomplete
4. Directions API integration

**P1 (Important - Should have):**

5. Map style selector
6. Custom markers
7. Navigation panel UI
8. Current location button

**P2 (Nice to have):**

9. Marker clustering
10. Offline caching
11. Route alternatives
12. Advanced animations

---

## 📦 Dependencies to Add

```json
{
  "@rnmapbox/maps": "^10.1.39"
}
```

## 📦 Dependencies to Remove

```json
{
  "react-native-maps": "1.20.1",
  "react-native-webview": "13.13.5"  // if only used for map
}
```

---

## 🚀 Expected Outcome

- ✅ Modern map UI giống Mapbox/Google Maps
- ✅ Smooth animations và transitions
- ✅ Tìm kiếm địa chỉ nhanh và chính xác
- ✅ Chỉ đường với Goong traffic data
- ✅ Multiple map styles
- ✅ Performance tốt (60fps)
- ✅ Offline-ready architecture
- ✅ User-friendly và intuitive

---

**Estimated Time**: 4-6 hours implementation

**Risk Level**: Medium (SDK migration, có thể cần troubleshoot native build)

**Success Criteria**: Map hoạt động mượt mà, search và directions work perfectly

### To-dos

- [ ] Gỡ bỏ react-native-maps, react-native-webview và các file map cũ (MapLibreView, MapGoongWebView)
- [ ] Cài đặt @rnmapbox/maps và cấu hình trong app.json, babel.config.js
- [ ] Tạo services/GoongMapStyles.ts với 3 styles: light, dark, satellite
- [ ] Tạo services/LocationService.ts cho current location tracking
- [ ] Tạo components/map/MapSearchBar.tsx với Goong autocomplete
- [ ] Tạo components/map/MapStyleSelector.tsx cho chuyển đổi styles
- [ ] Tạo components/map/CurrentLocationButton.tsx
- [ ] Tạo components/map/NavigationPanel.tsx cho directions UI
- [ ] Tạo components/map/MapboxRestaurantMarker.tsx với custom icons
- [ ] Tạo components/map/RouteLayer.tsx cho hiển thị route
- [ ] Viết lại hoàn toàn app/(tabs)/map.tsx với Mapbox MapView
- [ ] Cập nhật GoongService.ts và GoongDirectionService.ts để format data cho Mapbox
- [ ] Chạy npx expo prebuild --clean và test trên Android