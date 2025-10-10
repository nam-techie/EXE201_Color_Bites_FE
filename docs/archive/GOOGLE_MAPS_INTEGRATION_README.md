# 🗺️ Google Maps Integration - README

## ✅ Hoàn thành tích hợp Google Maps API

Project đã được tích hợp **Google Maps API** thành công! Bạn có thể dễ dàng switch giữa **Google Maps** và **OpenStreetMap**.

---

## 📦 Các file đã tạo

### Services (Core)
- ✅ `services/GoogleMapService.ts` - Google Places API (tìm nhà hàng)
- ✅ `services/GoogleDirectionService.ts` - Google Directions API (chỉ đường)
- ✅ `services/MapProvider.ts` - Abstraction layer (switch provider)

### Configuration
- ✅ `constants/index.ts` - Thêm `GOOGLE_MAPS_API_KEY` và `MAP_PROVIDER`

### Integration
- ✅ `app/(tabs)/map.tsx` - Cập nhật dùng `MapProvider`

### Documentation
- ✅ `QUICK_START_GOOGLE_MAPS.md` - Hướng dẫn nhanh 3 phút
- ✅ `ENV_CONFIG_GUIDE.md` - Hướng dẫn chi tiết cấu hình ENV
- ✅ `MAP_PROVIDER_GUIDE.md` - API reference đầy đủ

### Scripts
- ✅ `scripts/testMapProvider.js` - Test script để verify setup

---

## 🚀 Bắt đầu sử dụng

### Bước 1: Thêm Google Maps API Key

Tạo file `.env` trong thư mục root:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

**Chưa có API key?** Xem `ENV_CONFIG_GUIDE.md` để biết cách lấy.

### Bước 2: Restart server

```bash
npm start
```

### Bước 3: Kiểm tra

Console sẽ hiển thị:

```
✅ [MapProvider] Initialized with Google Maps API
✅ [MapProvider] Current Provider: Google Maps
✅ [MapProvider] Status: ✅ Configured
```

**Xong!** App đã dùng Google Maps API.

---

## 🔄 Chuyển đổi Provider

### Dùng Google Maps (Mặc định)

File `constants/index.ts`, dòng 40:

```typescript
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 'google'
```

### Dùng OpenStreetMap (Miễn phí)

File `constants/index.ts`, dòng 40:

```typescript
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 'openstreetmap'
```

**Khi nào dùng OpenStreetMap?**
- Hết quota Google Maps
- Development/testing (tiết kiệm)
- Không cần real-time traffic

---

## 📚 Documentation

| File | Mô tả |
|------|-------|
| `QUICK_START_GOOGLE_MAPS.md` | ⚡ Hướng dẫn nhanh 3 phút |
| `ENV_CONFIG_GUIDE.md` | 🔑 Cách lấy và cấu hình API keys |
| `MAP_PROVIDER_GUIDE.md` | 📖 API reference đầy đủ + troubleshooting |

---

## 🧪 Test Setup

Chạy test script để verify:

```bash
node scripts/testMapProvider.js
```

Output mong đợi:

```
✅ GOOGLE_MAPS_API_KEY constant found
✅ MAP_PROVIDER constant found
✅ services/GoogleMapService.ts
✅ services/GoogleDirectionService.ts
✅ services/MapProvider.ts
✅ map.tsx is using MapProvider
```

---

## 💡 Ví dụ sử dụng

### Tìm nhà hàng gần vị trí

```typescript
import { MapProvider } from '@/services/MapProvider'

const restaurants = await MapProvider.fetchRestaurants(
  10.762622,  // latitude
  106.660172, // longitude
  2000        // radius (meters)
)
```

### Lấy chỉ đường

```typescript
const route = await MapProvider.getDirections(
  { lat: 10.762622, lon: 106.660172 }, // origin
  { lat: 10.771999, lon: 106.698000 }, // destination
  'driving-car' // profile
)

console.log(route.distance) // meters
console.log(route.duration) // seconds
```

### Kiểm tra provider hiện tại

```typescript
const provider = MapProvider.getProvider()
console.log(provider) // 'google' hoặc 'openstreetmap'
```

---

## 🏗️ Kiến trúc

```
app/(tabs)/map.tsx
       ↓
services/MapProvider.ts
       ↓
   ┌───────────────────┐
   ↓                   ↓
Google Maps      OpenStreetMap
   ↓                   ↓
GoogleMapService   MapService
GoogleDirectionService   DirectionService
```

**Ưu điểm**:
- ✅ Dễ dàng switch provider
- ✅ Code cũ (OpenStreetMap) được giữ nguyên
- ✅ Không phá vỡ existing code
- ✅ Fallback khi hết quota

---

## 🐛 Troubleshooting

### Lỗi: "API key not configured"

**Giải pháp**: Tạo file `.env` và thêm API key

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

### Lỗi: "REQUEST_DENIED"

**Giải pháp**: Enable APIs trong Google Cloud Console
- Places API
- Directions API

### Lỗi: "OVER_QUERY_LIMIT"

**Giải pháp**: Chuyển sang OpenStreetMap

```typescript
export const MAP_PROVIDER = 'openstreetmap'
```

**Xem thêm**: `MAP_PROVIDER_GUIDE.md` phần Troubleshooting

---

## 📊 So sánh Providers

| Feature | Google Maps | OpenStreetMap |
|---------|-------------|---------------|
| **Dữ liệu** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Chi phí** | $200/tháng | Miễn phí |
| **Traffic** | ✅ Real-time | ❌ |
| **Rate limit** | Cao | 2000/day |

---

## ✅ Checklist

- [ ] Đã tạo file `.env`
- [ ] Đã thêm `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Đã enable Places API và Directions API
- [ ] Đã restart server
- [ ] Đã test map feature
- [ ] Đã test directions feature
- [ ] Đã đọc `MAP_PROVIDER_GUIDE.md`

---

## 🔗 Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Maps Pricing](https://mapsplatform.google.com/pricing/)
- [OpenRouteService](https://openrouteservice.org/)

---

## 🤝 Cần hỗ trợ?

1. Đọc `QUICK_START_GOOGLE_MAPS.md` - Hướng dẫn nhanh
2. Đọc `ENV_CONFIG_GUIDE.md` - Cấu hình chi tiết
3. Đọc `MAP_PROVIDER_GUIDE.md` - API reference đầy đủ
4. Chạy `node scripts/testMapProvider.js` - Test setup

---

## 📝 Changelog

### v1.0.0 (2025-10-10)
- ✅ Tích hợp Google Maps API
- ✅ Tạo MapProvider abstraction layer
- ✅ Giữ nguyên OpenStreetMap support
- ✅ Dễ dàng switch giữa providers
- ✅ Full documentation
- ✅ Test scripts

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Date**: 2025-10-10

