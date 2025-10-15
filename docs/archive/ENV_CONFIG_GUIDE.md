# 🔑 Hướng dẫn cấu hình Environment Variables

## 📋 Tổng quan

File này hướng dẫn cách cấu hình các API keys cho Color Bites app, bao gồm:
- Google Maps API Key
- OpenRouteService API Key
- Backend API URL

---

## 🚀 Bước 1: Tạo file .env

```bash
# Tạo file .env từ template
cp .env.example .env
```

Hoặc tạo file `.env` mới trong thư mục root với nội dung:

```env
# Backend API
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080

# Google Maps API Key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# OpenRouteService API Key (Fallback)
EXPO_PUBLIC_OPENROUTE_API_KEY=your_openroute_api_key_here
```

---

## 🗺️ Bước 2: Lấy Google Maps API Key

### 2.1. Truy cập Google Cloud Console

1. Vào: https://console.cloud.google.com/
2. Đăng nhập với tài khoản Google
3. Tạo project mới hoặc chọn project có sẵn

### 2.2. Enable APIs

Vào **APIs & Services** > **Library**, tìm và enable các APIs sau:

- ✅ **Maps SDK for Android**
- ✅ **Maps SDK for iOS**
- ✅ **Places API** (Nearby Search)
- ✅ **Directions API**

### 2.3. Tạo API Key

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API key được tạo

### 2.4. Bảo mật API Key (Khuyến nghị)

1. Click **Restrict Key** bên cạnh API key vừa tạo
2. **Application restrictions**:
   - Chọn **Android apps** hoặc **iOS apps**
   - Thêm package name: `com.yourcompany.colorbites`
3. **API restrictions**:
   - Chọn **Restrict key**
   - Chọn 4 APIs đã enable ở trên
4. Click **Save**

### 2.5. Paste vào .env

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🛣️ Bước 3: Lấy OpenRouteService API Key (Optional)

### 3.1. Đăng ký tài khoản

1. Vào: https://openrouteservice.org/dev/#/signup
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

### 3.2. Tạo API Token

1. Đăng nhập vào Dashboard
2. Click **Request a token**
3. Đặt tên cho token (ví dụ: "Color Bites App")
4. Copy token

### 3.3. Paste vào .env

```env
EXPO_PUBLIC_OPENROUTE_API_KEY=5b3ce3597851110001cf6248XXXXXXXXXXXXXXXXXXXXXXXX
```

**Free tier**: 2000 requests/day

---

## 🔄 Bước 4: Restart Expo Dev Server

Sau khi cấu hình xong, restart server:

```bash
# Dừng server hiện tại (Ctrl+C)
# Khởi động lại
npm start
```

---

## ✅ Bước 5: Kiểm tra cấu hình

Khi app khởi động, kiểm tra console log:

```
[ENV DEBUG] Google Maps key source: env length: 39
[ENV DEBUG] Map provider: google
[MapProvider] Initialized with Google Maps API
========================================
[MapProvider] Current Provider: Google Maps
[MapProvider] Status: ✅ Configured
========================================
```

Nếu thấy `❌ Not Configured`, kiểm tra lại các bước trên.

---

## 🔀 Chuyển đổi giữa Google Maps và OpenStreetMap

### Cách 1: Thay đổi trong code (Khuyến nghị)

Mở file `constants/index.ts`, tìm dòng 40:

```typescript
// Đổi từ 'google' sang 'openstreetmap'
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 'openstreetmap'
```

Restart app.

### Cách 2: Thay đổi runtime (Advanced)

Trong code, có thể gọi:

```typescript
import { MapProvider } from '@/services/MapProvider'

// Check provider hiện tại
console.log(MapProvider.getProvider()) // 'google' hoặc 'openstreetmap'
```

---

## 🐛 Troubleshooting

### Lỗi: "API key not configured"

**Nguyên nhân**: File .env chưa tạo hoặc API key chưa điền

**Giải pháp**:
1. Kiểm tra file `.env` có tồn tại không
2. Kiểm tra API key đã điền đúng chưa
3. Restart Expo dev server

### Lỗi: "REQUEST_DENIED"

**Nguyên nhân**: API key bị từ chối

**Giải pháp**:
1. Kiểm tra API key có đúng không
2. Kiểm tra đã enable APIs chưa (Places API, Directions API)
3. Kiểm tra restrictions của API key (nếu có)
4. Thử tạo API key mới không có restrictions

### Lỗi: "OVER_QUERY_LIMIT"

**Nguyên nhân**: Đã vượt quá giới hạn request

**Google Maps Free Tier**:
- $200 credit/tháng
- Places API: $17/1000 requests
- Directions API: $5/1000 requests

**Giải pháp**:
1. Chuyển sang OpenStreetMap (miễn phí):
   ```typescript
   // constants/index.ts
   export const MAP_PROVIDER = 'openstreetmap'
   ```
2. Hoặc nâng cấp Google Cloud billing

### Lỗi: "No restaurants found"

**Nguyên nhân**: Không có nhà hàng trong bán kính tìm kiếm

**Giải pháp**:
1. Tăng bán kính tìm kiếm trong code
2. Di chuyển đến khu vực có nhiều nhà hàng hơn
3. Thử đổi provider để so sánh kết quả

### App không load được map

**Giải pháo**:
1. Kiểm tra kết nối internet
2. Kiểm tra console log xem có lỗi gì
3. Thử clear cache: `npm start -- --clear`
4. Thử rebuild: `npm run android` hoặc `npm run ios`

---

## 📊 So sánh Google Maps vs OpenStreetMap

| Feature | Google Maps | OpenStreetMap |
|---------|-------------|---------------|
| **Dữ liệu nhà hàng** | ⭐⭐⭐⭐⭐ Rất chi tiết | ⭐⭐⭐ Tốt |
| **Chỉ đường** | ⭐⭐⭐⭐⭐ Real-time traffic | ⭐⭐⭐⭐ Tốt |
| **Chi phí** | $200 credit/tháng | Miễn phí |
| **Rate limit** | Cao (theo credit) | 2000 requests/day |
| **Độ chính xác** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Thông tin bổ sung** | Rating, reviews, photos | Cơ bản |

**Khuyến nghị**: 
- Development: Dùng OpenStreetMap (tiết kiệm)
- Production: Dùng Google Maps (chất lượng tốt hơn)

---

## 🔗 Links hữu ích

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)
- [OpenRouteService](https://openrouteservice.org/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, xem thêm:
- `MAP_PROVIDER_GUIDE.md` - Hướng dẫn chi tiết về Map Provider
- `CODEBASE.md` - Tổng quan về codebase
- `DEVELOPMENT_GUIDE.md` - Hướng dẫn development

---

**Cập nhật lần cuối**: 2025-10-10

