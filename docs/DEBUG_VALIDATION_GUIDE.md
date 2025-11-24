# 🔍 Debug & Validation Guide

> **Hướng dẫn debug và validation cho Color Bites Environment Variables**  
> Cập nhật: 25/01/2025

---

## 🚨 KIỂM TRA NHANH

### 1. Console Logs Validation

Khi app khởi động, tìm các log sau trong console:

```bash
# ✅ LOGS TỐT - Tất cả đều có
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

```bash
# ❌ LOGS LỖI - Thiếu keys
============================================================
[ENV CONFIG] Environment Variables Status:
============================================================
[ENV CONFIG] API_BASE_URL: https://mumii-be.namtechie.id.vn
[ENV CONFIG] Source: EXPO_PUBLIC_API_BASE_URL
[ENV CONFIG] GOONG_API_KEY: ❌ missing
[ENV CONFIG] Source: app.json fallback
[ENV CONFIG] GOONG_MAPTILES_KEY: ❌ missing
[ENV CONFIG] Source: app.json fallback
[ENV CONFIG] Overall Status: ❌ Missing keys
[ENV CONFIG] ⚠️  Please set the following environment variables:
[ENV CONFIG]   - EXPO_PUBLIC_GOONG_API_KEY
[ENV CONFIG]   - EXPO_PUBLIC_GOONG_MAPTILES_KEY
============================================================
```

### 2. EAS Secrets Validation

```bash
# Kiểm tra secrets đã set chưa
eas env:list --profile preview

# Output mong đợi:
EXPO_PUBLIC_API_BASE_URL: https://mumii-be.namtechie.id.vn
EXPO_PUBLIC_GOONG_API_KEY: ********
EXPO_PUBLIC_GOONG_MAPTILES_KEY: ********
```

---

## 🐛 TROUBLESHOOTING THEO LỖI

### Lỗi: "GOONG_MAPTILES_KEY is empty"

**Triệu chứng:**
- Map hiển thị trắng
- Console log: `[goong-style] GOONG_MAPTILES_KEY is empty`

**Nguyên nhân:**
- EAS secret chưa được set
- Key không đúng format
- Profile không match

**Giải pháp:**
```bash
# 1. Kiểm tra secrets
eas env:list --profile preview

# 2. Nếu thiếu, set lại
eas secret:create --name EXPO_PUBLIC_GOONG_MAPTILES_KEY --value YOUR_KEY --profile preview

# 3. Rebuild
eas build --profile preview --platform android
```

### Lỗi: "Map hiển thị trắng"

**Triệu chứng:**
- Map load nhưng chỉ thấy màu xanh/trắng
- Không có đường phố, tên địa điểm

**Nguyên nhân:**
- Vector style thiếu token ở glyphs/sprite
- Network error khi fetch style JSON
- API key không có quyền truy cập Map Tiles

**Giải pháp:**
```bash
# 1. Test URL trực tiếp trong browser
https://tiles.goong.io/assets/goong_map_web.json?api_key=YOUR_MAPTILES_KEY

# Nếu trả về JSON → key đúng
# Nếu trả về lỗi → key sai hoặc hết quota

# 2. Kiểm tra console có lỗi network không
# Tìm log: [goong-style] Fetching style: web from https://...

# 3. Verify app đang dùng buildGoongStyleDataUrl()
# Trong map.tsx phải có:
buildGoongStyleDataUrl(currentStyle)
  .then(url => setStyleURL(url))
```

### Lỗi: "REQUEST_DENIED"

**Triệu chứng:**
- Places search không hoạt động
- Directions không hoạt động
- Console log: `REQUEST_DENIED`

**Nguyên nhân:**
- API key không đúng
- Key bị restrict quá chặt
- Hết quota

**Giải pháp:**
```bash
# 1. Kiểm tra key có đúng không
# Test API trực tiếp:
curl "https://rsapi.goong.io/Place/AutoComplete?api_key=YOUR_KEY&input=pizza"

# 2. Kiểm tra restrictions trong Goong dashboard
# Tạm thời remove restrictions để test

# 3. Kiểm tra quota usage
# Vào Goong dashboard → Usage
```

### Lỗi: "OVER_QUERY_LIMIT"

**Triệu chứng:**
- API hoạt động một lúc rồi dừng
- Console log: `OVER_QUERY_LIMIT`

**Nguyên nhân:**
- Vượt quá giới hạn free tier
- Quá nhiều requests trong thời gian ngắn

**Giải pháp:**
```bash
# 1. Kiểm tra usage tại Goong dashboard
# 2. Upgrade plan nếu cần
# 3. Implement caching để giảm API calls
```

---

## 🧪 TESTING CHECKLIST

### ✅ Test 1: Environment Variables

```bash
# 1. Kiểm tra console logs khi app khởi động
# Phải thấy: [ENV CONFIG] Overall Status: ✅ All configured

# 2. Kiểm tra EAS secrets
eas env:list --profile preview
# Phải thấy 3 biến: API_BASE_URL, GOONG_API_KEY, GOONG_MAPTILES_KEY
```

### ✅ Test 2: Map Display

```bash
# 1. Mở app → Tab Map
# 2. Map phải hiển thị chi tiết (không trắng)
# 3. Có thể zoom/pan bình thường
# 4. Không có watermark "Mapbox" hoặc "Google"

# 5. Test map style switching
# Nhấn button layers → map style phải thay đổi
```

### ✅ Test 3: Places Search

```bash
# 1. Nhấn vào search bar
# 2. Gõ "pizza" hoặc "nhà hàng"
# 3. Phải có suggestions từ Goong
# 4. Chọn suggestion → map di chuyển đến vị trí
# 5. Không có lỗi REQUEST_DENIED
```

### ✅ Test 4: Directions

```bash
# 1. Nhấn vào marker nhà hàng
# 2. Nhấn "Chỉ đường"
# 3. Phải hiển thị route từ vị trí hiện tại
# 4. Route có màu xanh trên map
# 5. Không có lỗi REQUEST_DENIED
```

### ✅ Test 5: Network & Performance

```bash
# 1. Test trên WiFi và 4G
# 2. Test với network chậm
# 3. Kiểm tra không có memory leaks
# 4. App không crash khi switch tabs
```

---

## 🔧 DEBUG COMMANDS

### Kiểm tra Environment Variables

```bash
# 1. Kiểm tra tất cả EXPO_PUBLIC_* variables
npx expo start --clear

# 2. Thêm debug vào code
console.log('All env vars:', Object.keys(process.env).filter(k => k.startsWith('EXPO_PUBLIC')))
```

### Kiểm tra Goong API Keys

```bash
# 1. Test Places API
curl "https://rsapi.goong.io/Place/AutoComplete?api_key=YOUR_KEY&input=pizza"

# 2. Test Directions API
curl "https://rsapi.goong.io/Direction?api_key=YOUR_KEY&origin=10.762622,106.660172&destination=10.771999,106.698000&vehicle=car"

# 3. Test Map Tiles
curl "https://tiles.goong.io/assets/goong_map_web.json?api_key=YOUR_KEY"
```

### Kiểm tra Build Configuration

```bash
# 1. Kiểm tra eas.json
cat eas.json

# 2. Kiểm tra app.json
cat app.json | grep -A 10 "extra"

# 3. Kiểm tra config/env.ts
cat config/env.ts
```

---

## 📊 MONITORING & METRICS

### Goong Dashboard Monitoring

1. **Vào Goong Dashboard**: https://account.goong.io/
2. **Usage Tab**: Xem số requests đã sử dụng
3. **Keys Tab**: Kiểm tra key status và restrictions
4. **Billing Tab**: Monitor quota và costs

### App Performance Monitoring

```bash
# 1. Console logs để monitor
# Tìm các log:
# - [ENV CONFIG] - Environment status
# - [goong-style] - Map style loading
# - [MapProvider] - API calls
# - [MAP DEBUG] - Map functionality

# 2. Network tab trong dev tools
# Kiểm tra API calls có thành công không
# Response time và error rates
```

---

## 🆘 ESCALATION

### Nếu vẫn không được sau khi thử tất cả:

1. **Kiểm tra Goong Dashboard**:
   - Quota còn không
   - Billing account active không
   - Keys có bị disable không

2. **Kiểm tra EAS Build**:
   - Build logs có lỗi không
   - Environment variables có được inject không
   - App có crash không

3. **Contact Support**:
   - Goong Support: https://help.goong.io/
   - Expo Support: https://forums.expo.dev/
   - Project team: Color Bites Team

---

## 📚 TÀI LIỆU THAM KHẢO

- [EAS Secrets Documentation](https://docs.expo.dev/build-reference/variables/)
- [Goong API Documentation](https://help.goong.io/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [MapLibre React Native](https://github.com/maplibre/maplibre-react-native)

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: 25/01/2025
