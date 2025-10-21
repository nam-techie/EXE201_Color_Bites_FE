# 🗺️ GOONG MAPS SETUP GUIDE

> **Hướng dẫn chi tiết setup Goong Maps cho Color Bites**  
> Cập nhật: 10/10/2025

---

## 📋 TỔNG QUAN

Goong Maps là dịch vụ bản đồ tối ưu cho Việt Nam, cung cấp:
- **Map Tiles**: Bản đồ hiển thị với dữ liệu chi tiết cho VN
- **Places API**: Tìm kiếm địa điểm, nhà hàng
- **Directions API**: Chỉ đường với traffic real-time
- **Free Tier**: Miễn phí với giới hạn hợp lý

---

## 🚀 BƯỚC 1: ĐĂNG KÝ TÀI KHOẢN

### 1.1 Truy cập Goong Account
- Vào: https://account.goong.io/
- Nhấn **"Đăng ký"** hoặc **"Sign Up"**

### 1.2 Điền thông tin
- **Email**: Email của bạn
- **Password**: Mật khẩu mạnh
- **Company**: Tên công ty/dự án (tùy chọn)
- **Phone**: Số điện thoại (tùy chọn)

### 1.3 Xác thực email
- Kiểm tra email và nhấn link xác thực
- Đăng nhập vào dashboard

---

## 🔑 BƯỚC 2: TẠO API KEYS

### 2.1 Truy cập Keys Management
- Sau khi đăng nhập, vào **"Keys"** hoặc **"API Keys"**
- Nhấn **"Create New Key"**

### 2.2 Tạo API Key (cho Places & Directions)
- **Name**: `Color Bites API Key`
- **Description**: `API key for places search and directions`
- **Services**: Chọn:
  - ✅ **Places API** (Autocomplete, Place Detail)
  - ✅ **Directions API**
  - ✅ **Geocoding API**
- **Restrictions**: 
  - **HTTP referrers**: `localhost:8080, 127.0.0.1:8080` (cho dev)
  - **IP addresses**: IP của server production (nếu có)

### 2.3 Tạo Map Tiles Key (cho Map Display)
- Nhấn **"Create New Key"** lần nữa
- **Name**: `Color Bites Map Tiles Key`
- **Description**: `Map tiles key for map display`
- **Services**: Chọn:
  - ✅ **Map Tiles API**
- **Restrictions**: 
  - **HTTP referrers**: `localhost:8080, 127.0.0.1:8080` (cho dev)

### 2.4 Copy Keys
- Copy cả 2 keys và lưu vào file `.env`
- **QUAN TRỌNG**: Không commit keys vào Git!

---

## ⚙️ BƯỚC 3: CẤU HÌNH PROJECT

### 3.1 Tạo file `.env`
```env
# Goong Maps Configuration
EXPO_PUBLIC_GOONG_API_KEY=your_api_key_here
EXPO_PUBLIC_GOONG_MAPTILES_KEY=your_maptiles_key_here

# Backend API
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 3.2 Cập nhật app.json (đã được thực hiện)
```json
{
  "expo": {
    "extra": {
      "GOONG_API_KEY": "placeholder_will_use_env",
      "GOONG_MAPTILES_KEY": "placeholder_will_use_env"
    }
  }
}
```

### 3.3 Kiểm tra constants/index.ts (đã được thực hiện)
```typescript
export const GOONG_API_KEY = process.env.EXPO_PUBLIC_GOONG_API_KEY || ''
export const GOONG_MAPTILES_KEY = process.env.EXPO_PUBLIC_GOONG_MAPTILES_KEY || ''
export const GOONG_MAP_STYLE = `https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_MAPTILES_KEY}`
```

---

## 🔧 BƯỚC 4: BUILD VÀ TEST

### 4.1 Prebuild (Bắt buộc)
```bash
# Expo Go KHÔNG chạy được với @rnmapbox/maps
# Phải dùng Expo Dev Client:
npx expo prebuild
```

### 4.2 Run trên Android
```bash
npx expo run:android
```

### 4.3 Run trên iOS
```bash
npx expo run:ios
```

### 4.4 Kiểm tra Console Logs
Khi app khởi động, console phải hiển thị:
```
✅ [ENV DEBUG] Goong API key: configured
✅ [ENV DEBUG] Goong Map Tiles key: configured
✅ [MapProvider] Using Goong Maps + Goong Direction API
✅ [MapProvider] Provider: Goong Maps
✅ [MapProvider] Status: ✅ Configured
```

---

## 🧪 BƯỚC 5: TESTING

### 5.1 Test Map Display
- Mở app → Tab **Map**
- Bản đồ phải hiển thị với style Goong
- Không có watermark "Mapbox" hoặc "Google"

### 5.2 Test Places Search
- Nhấn vào search bar
- Gõ "pizza" hoặc "nhà hàng"
- Phải có suggestions từ Goong

### 5.3 Test Directions
- Nhấn vào marker nhà hàng
- Nhấn **"Chỉ đường"**
- Phải hiển thị route từ vị trí hiện tại

### 5.4 Test Nearby Restaurants
- App phải tự động load nhà hàng gần vị trí
- Markers hiển thị với icon phù hợp

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Goong API keys not configured"
**Nguyên nhân**: Keys chưa được load từ `.env`
**Giải pháp**:
1. Kiểm tra file `.env` có đúng format không
2. Restart Metro bundler: `npx expo start --clear`
3. Rebuild app: `npx expo prebuild && npx expo run:android`

### Lỗi: "REQUEST_DENIED"
**Nguyên nhân**: API key không đúng hoặc bị restrict
**Giải pháp**:
1. Kiểm tra key có đúng không
2. Kiểm tra restrictions trong Goong dashboard
3. Tạm thời remove restrictions để test

### Lỗi: "Map không hiển thị"
**Nguyên nhân**: Map Tiles key không đúng hoặc đang dùng Expo Go
**Giải pháp**:
1. Đảm bảo đang dùng **Expo Dev Client** (không phải Expo Go)
2. Kiểm tra Map Tiles key
3. Kiểm tra network connection

### Lỗi: "OVER_QUERY_LIMIT"
**Nguyên nhân**: Vượt quá giới hạn free tier
**Giải pháp**:
1. Kiểm tra usage tại Goong dashboard
2. Upgrade plan nếu cần
3. Implement caching để giảm API calls

---

## 📊 MONITORING USAGE

### 5.1 Kiểm tra Usage
- Vào Goong dashboard → **"Usage"**
- Xem số lượng requests đã sử dụng
- Monitor theo ngày/tháng

### 5.2 Free Tier Limits
- **Places API**: 1,000 requests/tháng
- **Directions API**: 1,000 requests/tháng  
- **Map Tiles**: 10,000 requests/tháng

### 5.3 Optimization Tips
- Cache search results
- Debounce search input
- Use batch requests khi có thể
- Implement offline fallback

---

## 🚀 PRODUCTION DEPLOYMENT

### 6.1 Update Restrictions
- **HTTP referrers**: Domain production của bạn
- **IP addresses**: IP server production
- **Bundle ID**: Bundle ID của app (cho mobile)

### 6.2 Environment Variables
```env
# Production
EXPO_PUBLIC_GOONG_API_KEY=prod_api_key_here
EXPO_PUBLIC_GOONG_MAPTILES_KEY=prod_maptiles_key_here
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

### 6.3 EAS Build
```bash
# Build development
eas build --profile development --platform android

# Build production
eas build --profile production --platform android
```

---

## 📚 API REFERENCE

### Places API
```typescript
// Autocomplete
GET https://rsapi.goong.io/Place/AutoComplete?api_key=KEY&input=query&location=lat,lng

// Place Detail
GET https://rsapi.goong.io/Place/Detail?api_key=KEY&place_id=PLACE_ID
```

### Directions API
```typescript
// Directions
GET https://rsapi.goong.io/Direction?api_key=KEY&origin=lat,lng&destination=lat,lng&vehicle=car
```

### Map Tiles
```typescript
// Style URL
https://tiles.goong.io/assets/goong_map_web.json?api_key=TILES_KEY
```

---

## 🔗 LINKS HỮU ÍCH

- [Goong Account](https://account.goong.io/)
- [Goong API Documentation](https://help.goong.io/)
- [Goong Pricing](https://goong.io/pricing)
- [Expo Dev Client](https://docs.expo.dev/development/introduction/)
- [@rnmapbox/maps Docs](https://github.com/rnmapbox/maps)

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Đăng ký tài khoản Goong
- [ ] Tạo API Key (Places + Directions)
- [ ] Tạo Map Tiles Key
- [ ] Copy keys vào `.env`
- [ ] Chạy `npx expo prebuild`
- [ ] Chạy `npx expo run:android`
- [ ] Test map display
- [ ] Test places search
- [ ] Test directions
- [ ] Test nearby restaurants
- [ ] Monitor usage
- [ ] Setup production restrictions

---

**Version**: 1.0.0  
**Status**: ✅ Complete  
**Last Updated**: 10/10/2025
