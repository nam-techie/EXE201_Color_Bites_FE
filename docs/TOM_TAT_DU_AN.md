# 📖 TÓM TẮT DỰ ÁN COLOR BITES

> **Tài liệu tổng hợp ngắn gọn cho dự án Color Bites**  
> Cập nhật: 10/10/2025

---

## 🚀 BẮT ĐẦU NHANH (5 PHÚT)

### 1. Cài đặt
```bash
npm install
```

### 2. Cấu hình API (Tạo file `.env`)
```env
# Backend API
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080

# Google Maps API Key (Bắt buộc)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_api_key_here

# OpenRouteService API Key (Tùy chọn - dùng khi muốn dùng OpenStreetMap)
EXPO_PUBLIC_OPENROUTE_API_KEY=your_openroute_key_here

# Gemini API Key (Bắt buộc cho AI chat)
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
```

### 3. Lấy Google Maps API Key
1. Vào: https://console.cloud.google.com/
2. Tạo project mới
3. Enable APIs: **Places API** và **Directions API**
4. Tạo API Key tại **APIs & Services** > **Credentials**
5. Copy key và paste vào file `.env`

### 4. Chạy App
```bash
npm start
```

### 5. Kiểm tra
Console phải hiển thị:
```
✅ [MapProvider] Initialized with Google Maps API
✅ [MapProvider] Status: ✅ Configured
```

**XONG! 🎉**

---

## 🗺️ HỆ THỐNG BẢN ĐỒ

### 2 Providers hỗ trợ:

| | Google Maps (Mặc định) | OpenStreetMap |
|---|---|---|
| **Chi phí** | $200 credit/tháng | Miễn phí |
| **Dữ liệu** | ⭐⭐⭐⭐⭐ Rất chi tiết | ⭐⭐⭐ Tốt |
| **Traffic** | ✅ Real-time | ❌ Không có |
| **Rate limit** | Cao | 2000 requests/day |

### Chuyển đổi Provider

File `constants/index.ts`, dòng 40:

```typescript
// Dùng Google Maps
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 'google'

// Dùng OpenStreetMap
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 'openstreetmap'
```

Sau đó restart app.

---

## 📱 CẤU TRÚC DỰ ÁN

```
app/
├── (tabs)/              # Các màn hình chính
│   ├── index.tsx       # Trang chủ
│   ├── explore.tsx     # Khám phá
│   ├── map.tsx         # Bản đồ
│   ├── create.tsx      # Tạo bài viết
│   └── profile.tsx     # Hồ sơ
└── auth/               # Đăng nhập/đăng ký
    ├── login.tsx
    ├── signup-form.tsx
    └── ...

components/             # Các component tái sử dụng
├── common/            # Button, Input, Modal...
├── map/               # Map components
└── create-post/       # Tạo bài viết

services/              # API services
├── MapProvider.ts     # 🆕 Switch giữa Google/OSM
├── GoogleMapService.ts        # 🆕 Google Places API
├── GoogleDirectionService.ts  # 🆕 Google Directions API
├── MapService.ts              # OpenStreetMap
├── DirectionService.ts        # OpenRouteService
├── AuthService.ts     # Xác thực
├── PostService.ts     # Bài viết
└── ...

context/
├── AuthProvider.tsx   # Quản lý authentication
└── ThemeContext.tsx   # Quản lý theme

constants/
└── index.ts          # Config: API keys, MAP_PROVIDER
```

---

## 💡 SỬ DỤNG MAP API

### Tìm nhà hàng gần vị trí
```typescript
import { MapProvider } from '@/services/MapProvider'

const restaurants = await MapProvider.fetchRestaurants(
  10.762622,  // latitude
  106.660172, // longitude
  2000        // bán kính (meters)
)
```

### Lấy chỉ đường
```typescript
const route = await MapProvider.getDirections(
  { lat: 10.762622, lon: 106.660172 }, // điểm xuất phát
  { lat: 10.771999, lon: 106.698000 }, // điểm đến
  'driving-car' // profile: 'driving-car' | 'cycling-regular' | 'foot-walking'
)

console.log(route.distance) // khoảng cách (meters)
console.log(route.duration) // thời gian (seconds)
console.log(route.geometry) // tọa độ route
```

### Tìm kiếm theo từ khóa
```typescript
const pizzaPlaces = await MapProvider.searchRestaurants(
  'pizza',    // từ khóa
  10.762622,  // latitude
  106.660172, // longitude
  5000        // bán kính
)
```

---

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi: "API key not configured"
**Giải pháp:** Tạo file `.env` và thêm API key, sau đó restart server

### Lỗi: "REQUEST_DENIED"
**Giải pháp:**
1. Kiểm tra API key có đúng không
2. Enable **Places API** và **Directions API** trong Google Cloud Console
3. Thử tạo API key mới không có restrictions

### Lỗi: "OVER_QUERY_LIMIT"
**Giải pháp:** Chuyển sang OpenStreetMap
```typescript
// constants/index.ts
export const MAP_PROVIDER = 'openstreetmap'
```

### Không tìm thấy nhà hàng
**Giải pháp:** Tăng bán kính tìm kiếm
```typescript
const restaurants = await MapProvider.fetchRestaurants(lat, lon, 5000)
```

---

## 🧪 TESTING

### Test Map Provider setup
```bash
node scripts/testMapProvider.js
```

Output mong đợi:
```
✅ GOOGLE_MAPS_API_KEY constant found
✅ MAP_PROVIDER constant found
✅ services/GoogleMapService.ts (11KB)
✅ services/GoogleDirectionService.ts (13KB)
✅ services/MapProvider.ts (8KB)
✅ map.tsx is using MapProvider
```

---

## 📞 CẦN TRỢ GIÚP?

### Bước 1: Kiểm tra console log
Xem logs khi chạy app để biết lỗi gì

### Bước 2: Chạy test script
```bash
node scripts/testMapProvider.js
```

### Bước 3: Kiểm tra provider status
Trong code:
```typescript
import { logProviderInfo } from '@/services/MapProvider'
logProviderInfo()
```

---

## 📚 TÀI LIỆU CHI TIẾT (Nếu cần)

Các file tài liệu chi tiết đã được chuyển vào thư mục `docs/archive/`:

- `HOW_TO_ADD_YOUR_API_KEY.md` - Hướng dẫn thêm API key chi tiết
- `QUICK_START_GOOGLE_MAPS.md` - Quick start guide
- `ENV_CONFIG_GUIDE.md` - Cấu hình environment variables
- `MAP_PROVIDER_GUIDE.md` - API reference đầy đủ
- `GOOGLE_MAPS_INTEGRATION_README.md` - Tổng quan tích hợp
- `IMPLEMENTATION_SUMMARY.md` - Chi tiết implementation
- `DEVELOPMENT_GUIDE.md` - Hướng dẫn phát triển
- `CODEBASE.md` - Tổng quan codebase

---

## ✅ CHECKLIST

### Setup ban đầu
- [ ] Clone project
- [ ] Chạy `npm install`
- [ ] Tạo file `.env`
- [ ] Lấy Google Maps API key
- [ ] Enable Places API và Directions API
- [ ] Paste key vào `.env`
- [ ] Restart server

### Testing
- [ ] Chạy `node scripts/testMapProvider.js`
- [ ] Kiểm tra console log
- [ ] Test tìm nhà hàng
- [ ] Test chỉ đường

### Production ready
- [ ] Bảo mật API key (add restrictions)
- [ ] Setup backend API
- [ ] Test trên thiết bị thật
- [ ] Kiểm tra billing limit

---

## 🎯 KHUYẾN NGHỊ

- **Development**: Dùng **OpenStreetMap** (miễn phí, tiết kiệm)
- **Production**: Dùng **Google Maps** (chất lượng tốt, dữ liệu chi tiết)
- **Fallback**: Config cả 2 providers, tự động switch khi hết quota

---

## 🔗 LINKS HỮU ÍCH

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Maps Pricing](https://mapsplatform.google.com/pricing/)
- [OpenRouteService](https://openrouteservice.org/)
- [Expo Docs](https://docs.expo.dev/)

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Liên hệ**: Color Bites Team

