# 🔧 Environment Variables Setup Guide

> **Hướng dẫn setup biến môi trường cho Color Bites với EAS Secrets**  
> Cập nhật: 25/01/2025

---

## 📋 TỔNG QUAN

Dự án Color Bites sử dụng **chuẩn Expo** với biến `EXPO_PUBLIC_*` cho tất cả client-side configuration. Tất cả API keys được quản lý qua **EAS Secrets** để đảm bảo bảo mật.

### Biến môi trường cần thiết:

| Biến | Mục đích | Bắt buộc |
|------|----------|----------|
| `EXPO_PUBLIC_API_BASE_URL` | Backend API URL | ✅ |
| `EXPO_PUBLIC_GOONG_API_KEY` | Goong Places API | ✅ |
| `EXPO_PUBLIC_GOONG_MAPTILES_KEY` | Goong Map Tiles | ✅ |

---

## 🚀 SETUP EAS SECRETS

### Bước 1: Cài đặt EAS CLI

```bash
npm install -g @expo/eas-cli
eas login
```

### Bước 2: Set secrets cho từng profile

#### Development Profile
```bash
eas secret:create --name EXPO_PUBLIC_API_BASE_URL --value https://mumii-be.namtechie.id.vn --profile development
eas secret:create --name EXPO_PUBLIC_GOONG_API_KEY --value YOUR_GOONG_API_KEY --profile development
eas secret:create --name EXPO_PUBLIC_GOONG_MAPTILES_KEY --value YOUR_GOONG_MAPTILES_KEY --profile development
```

#### Preview Profile
```bash
eas secret:create --name EXPO_PUBLIC_API_BASE_URL --value https://mumii-be.namtechie.id.vn --profile preview
eas secret:create --name EXPO_PUBLIC_GOONG_API_KEY --value YOUR_GOONG_API_KEY --profile preview
eas secret:create --name EXPO_PUBLIC_GOONG_MAPTILES_KEY --value YOUR_GOONG_MAPTILES_KEY --profile preview
```

#### Production Profile
```bash
eas secret:create --name EXPO_PUBLIC_API_BASE_URL --value https://mumii-be.namtechie.id.vn --profile production
eas secret:create --name EXPO_PUBLIC_GOONG_API_KEY --value YOUR_GOONG_API_KEY --profile production
eas secret:create --name EXPO_PUBLIC_GOONG_MAPTILES_KEY --value YOUR_GOONG_MAPTILES_KEY --profile production
```

### Bước 3: Verify secrets

```bash
# Kiểm tra secrets cho profile preview
eas env:list --profile preview

# Kiểm tra secrets cho profile production
eas env:list --profile production
```

**Output mong đợi:**
```
EXPO_PUBLIC_API_BASE_URL: https://mumii-be.namtechie.id.vn
EXPO_PUBLIC_GOONG_API_KEY: ********
EXPO_PUBLIC_GOONG_MAPTILES_KEY: ********
```

---

## 🔑 LẤY GOONG API KEYS

### 1. Đăng ký tài khoản Goong

1. Vào: https://account.goong.io/
2. Đăng ký tài khoản mới
3. Xác thực email

### 2. Tạo API Key (Places & Directions)

1. Vào **"Keys"** trong dashboard
2. Nhấn **"Create New Key"**
3. **Name**: `Color Bites API Key`
4. **Services**: Chọn:
   - ✅ **Places API** (Autocomplete, Place Detail)
   - ✅ **Directions API**
   - ✅ **Geocoding API**
5. **Restrictions**: 
   - **HTTP referrers**: `localhost:8080, 127.0.0.1:8080` (cho dev)
   - **Bundle ID**: `com.phuongnam.mumii` (cho mobile)
6. Copy key → dùng cho `EXPO_PUBLIC_GOONG_API_KEY`

### 3. Tạo Map Tiles Key

1. Nhấn **"Create New Key"** lần nữa
2. **Name**: `Color Bites Map Tiles Key`
3. **Services**: Chọn:
   - ✅ **Map Tiles API**
4. **Restrictions**: Tương tự như trên
5. Copy key → dùng cho `EXPO_PUBLIC_GOONG_MAPTILES_KEY`

---

## 🏗️ BUILD VÀ TEST

### Development Build

```bash
# Build development
eas build --profile development --platform android

# Install và test
eas build:run --profile development --platform android
```

### Preview Build

```bash
# Build preview
eas build --profile preview --platform android

# Install và test
eas build:run --profile preview --platform android
```

### Production Build

```bash
# Build production
eas build --profile production --platform android

# Install và test
eas build:run --profile production --platform android
```

---

## 🧪 VALIDATION CHECKLIST

### ✅ Kiểm tra Console Logs

Khi app khởi động, console phải hiển thị:

```
============================================================
[ENV CONFIG] Environment Variables Status:
============================================================
[ENV CONFIG] API_BASE_URL: https://mumii-be.namtechie.id.vn
[ENV CONFIG] Source: EXPO_PUBLIC_API_BASE_URL
[ENV CONFIG] GOONG_API_KEY: ✅ configured
[ENV CONFIG] Source: EXPO_PUBLIC_GOONG_API_KEY
[ENV CONFIG] GOONG_MAPTILES_KEY: ✅ configured
[ENV CONFIG] Source: EXPO_PUBLIC_GOONG_MAPTILES_KEY
[ENV CONFIG] Overall Status: ✅ All configured
============================================================
```

### ✅ Test Map Display

1. Mở app → Tab **Map**
2. Bản đồ phải hiển thị chi tiết (không trắng)
3. Không có watermark "Mapbox" hoặc "Google"
4. Có thể zoom/pan bình thường

### ✅ Test Places Search

1. Nhấn vào search bar
2. Gõ "pizza" hoặc "nhà hàng"
3. Phải có suggestions từ Goong
4. Chọn suggestion → map di chuyển đến vị trí

### ✅ Test Directions

1. Nhấn vào marker nhà hàng
2. Nhấn **"Chỉ đường"**
3. Phải hiển thị route từ vị trí hiện tại
4. Route có màu xanh trên map

---

## 🐛 TROUBLESHOOTING

### Lỗi: "GOONG_MAPTILES_KEY is empty"

**Nguyên nhân**: Map Tiles key chưa được set hoặc không đúng

**Giải pháp**:
1. Kiểm tra `eas env:list --profile preview`
2. Verify key có đúng không
3. Rebuild app: `eas build --profile preview --platform android`

### Lỗi: "Map hiển thị trắng"

**Nguyên nhân**: Vector style thiếu token ở glyphs/sprite

**Giải pháp**:
1. App đã sử dụng `buildGoongStyleDataUrl()` để inject token
2. Kiểm tra console có lỗi network không
3. Test URL trực tiếp: `https://tiles.goong.io/assets/goong_map_web.json?api_key=YOUR_KEY`

### Lỗi: "REQUEST_DENIED"

**Nguyên nhân**: API key không đúng hoặc bị restrict

**Giải pháp**:
1. Kiểm tra key có đúng không
2. Kiểm tra restrictions trong Goong dashboard
3. Tạm thời remove restrictions để test

### Lỗi: "OVER_QUERY_LIMIT"

**Nguyên nhân**: Vượt quá giới hạn free tier

**Giải pháp**:
1. Kiểm tra usage tại Goong dashboard
2. Upgrade plan nếu cần
3. Implement caching để giảm API calls

---

## 📊 MONITORING

### Kiểm tra Usage

1. Vào Goong dashboard → **"Usage"**
2. Xem số lượng requests đã sử dụng
3. Monitor theo ngày/tháng

### Free Tier Limits

- **Places API**: 1,000 requests/tháng
- **Directions API**: 1,000 requests/tháng  
- **Map Tiles**: 10,000 requests/tháng

### Optimization Tips

- Cache search results
- Debounce search input
- Use batch requests khi có thể
- Implement offline fallback

---

## 🔄 MIGRATION TỪ HARD-CODE

### Trước (app.json hard-code):
```json
{
  "expo": {
    "extra": {
      "GOONG_API_KEY": "hardcoded_key",
      "GOONG_MAPTILES_KEY": "hardcoded_key"
    }
  }
}
```

### Sau (EAS Secrets):
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "c29c07da-27fc-4c9c-8d03-dc4b8f31de9e"
      }
    }
  }
}
```

**Lợi ích**:
- ✅ Bảo mật cao hơn
- ✅ Quản lý keys dễ dàng
- ✅ Không commit keys vào Git
- ✅ Chuẩn Expo best practices

---

## 📚 TÀI LIỆU LIÊN QUAN

- [EAS Secrets Documentation](https://docs.expo.dev/build-reference/variables/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Goong Account](https://account.goong.io/)
- [Goong API Documentation](https://help.goong.io/)

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: 25/01/2025
