# UI Updates - Google Maps Style Interface

## 📝 Tổng quan

Cập nhật UI của Map Screen để giống Google Maps với các tính năng:
- ✅ Ô tìm kiếm địa điểm với autocomplete (Google Places API)
- ✅ Các nút Quick Action (Nhà riêng, Nhà hàng, Khách sạn, v.v.)
- ✅ Nút vị trí hiện tại (My Location)
- ✅ Nút Layers (chọn loại bản đồ)
- ✅ Chỉ đường tự động khi chọn địa điểm

## 🎨 Thay đổi UI

### 1. Google Places Search Bar
**File:** `components/common/GooglePlacesSearchBar.tsx`

Tính năng:
- Autocomplete địa chỉ khi gõ (debounce 500ms)
- Menu icon (hamburger) bên trái
- Voice search icon
- Profile/Avatar icon bên phải
- Hiển thị gợi ý địa điểm khi search
- Nút "Vị trí hiện tại" để quay về vị trí người dùng

API sử dụng:
- Google Places Autocomplete API
- Google Places Details API

### 2. Quick Action Buttons
**File:** `components/common/QuickActionButtons.tsx`

Các nút nhanh:
- 🏠 Nhà riêng
- 🍽️ Nhà hàng
- 🏨 Khách sạn
- ⛽ Xăng dầu
- ☕ Cà phê
- 🛒 Mua sắm
- 🏦 Ngân hàng
- 🏥 Bệnh viện

Khi nhấn vào một nút:
- Tìm kiếm địa điểm gần nhất theo loại
- Zoom map đến địa điểm đó
- Hiển thị chỉ đường từ vị trí hiện tại

### 3. Google Places Autocomplete Service
**File:** `services/GooglePlacesAutocomplete.ts`

Các function chính:
- `getAutocompletePredictions(input, options)` - Lấy gợi ý địa điểm
- `getPlaceDetails(placeId)` - Lấy chi tiết địa điểm (tọa độ, địa chỉ)
- `searchNearbyPlaces(location, type, radius)` - Tìm địa điểm gần

## 🔧 Cập nhật Map Screen

**File:** `app/(tabs)/map.tsx`

### Thay đổi chính:
1. **Xóa:** FilterButtons component (filters cũ)
2. **Xóa:** RestaurantSearchBar component (search bar cũ)
3. **Thêm:** GooglePlacesSearchBar component
4. **Thêm:** QuickActionButtons component
5. **Cập nhật:** Buttons styling (Google Maps style)

### Tính năng mới:
- Autocomplete tìm kiếm địa điểm
- Chọn địa điểm → Tự động chỉ đường
- Quick Actions → Tìm địa điểm gần theo loại
- My Location button (white background, shadow)
- Layers button (satellite/terrain/traffic) - placeholder

### State mới:
```typescript
const [selectedDestination, setSelectedDestination] = useState<{
  lat: number, 
  lon: number, 
  name: string
} | null>(null)
const mapRef = useRef<MapView>(null)
```

### Handler mới:
- `handlePlaceSelected()` - Xử lý khi chọn địa điểm từ autocomplete
- `handleQuickAction()` - Xử lý khi nhấn Quick Action button

## 📦 Google Maps APIs Sử dụng

### 1. Places API (Autocomplete)
```
GET https://maps.googleapis.com/maps/api/place/autocomplete/json
```
Params:
- `input` - Từ khóa tìm kiếm
- `key` - API key
- `language=vi` - Ngôn ngữ
- `location` - Vị trí ưu tiên (optional)
- `radius` - Bán kính (optional)

### 2. Places API (Details)
```
GET https://maps.googleapis.com/maps/api/place/details/json
```
Params:
- `place_id` - Google Place ID
- `fields` - Các trường cần lấy
- `key` - API key
- `language=vi`

### 3. Places API (Nearby Search)
```
GET https://maps.googleapis.com/maps/api/place/nearbysearch/json
```
Params:
- `location` - Vị trí tìm kiếm
- `radius` - Bán kính (mét)
- `type` - Loại địa điểm (restaurant, cafe, hospital, etc.)
- `key` - API key

### 4. Directions API
```
Sử dụng qua MapProvider.getDirections()
```
- Tự động chọn giữa Google Directions hoặc OpenRouteService
- Dựa vào `MAP_PROVIDER` constant

## 🔑 Cấu hình Map

Không yêu cầu Google Maps API key. Provider mặc định: OpenStreetMap/MapLibre.

### APIs cần enable trong Google Cloud Console:
1. ✅ Maps SDK for Android
2. ✅ Places API (Autocomplete, Details, Nearby Search)
3. ✅ Directions API
4. ⚠️ Maps JavaScript API (nếu build web)

## 🎯 Usage Flow

### 1. Tìm kiếm địa điểm
```
User gõ "Bitexco" 
→ Autocomplete gợi ý 
→ User chọn 
→ Map zoom đến địa điểm 
→ Hiển thị marker 
→ Tự động chỉ đường từ vị trí hiện tại
```

### 2. Quick Action
```
User nhấn "Nhà hàng" 
→ Tìm nhà hàng gần nhất 
→ Zoom map đến nhà hàng 
→ Hiển thị chỉ đường
```

### 3. Vị trí hiện tại
```
User nhấn nút "My Location" 
→ Map zoom về vị trí hiện tại 
→ Refresh vị trí
```

## 📊 Quota Usage

### Google Places API:
- **Autocomplete (per session):** ~$2.83 / 1000 sessions
- **Place Details:** $17 / 1000 requests
- **Nearby Search:** $32 / 1000 requests

### Google Directions API:
- **Basic:** $5 / 1000 requests
- **Advanced:** $10 / 1000 requests

**💡 Tip:** Google cung cấp **$200 free credit/tháng** → đủ dùng cho dev/testing

## 🚀 Testing

1. Start app: `npx expo start`
2. Nhấn vào ô search → Gõ địa chỉ
3. Chọn một gợi ý → Map zoom đến địa điểm
4. Nhấn Quick Action button → Tìm địa điểm gần
5. Nhấn My Location → Quay về vị trí hiện tại

## 📝 Notes

- UI đã được style theo Google Maps (white buttons, shadows, rounded corners)
- Autocomplete có debounce 500ms để tránh spam API
- Layers button hiện tại chỉ là placeholder (chưa implement map types)
- Voice search icon chỉ là UI (chưa implement voice recognition)
- Menu icon (hamburger) chỉ là UI (chưa implement drawer menu)

## 🔮 Future Enhancements

1. Implement map layers (satellite, terrain, traffic)
2. Voice search integration
3. Drawer menu với saved places
4. Route alternatives display
5. Real-time traffic overlay
6. Place photos from Places API
7. Reviews and ratings display

