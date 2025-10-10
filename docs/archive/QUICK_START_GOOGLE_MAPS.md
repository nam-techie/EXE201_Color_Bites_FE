# 🚀 Quick Start - Google Maps API

## ⚡ Bắt đầu nhanh trong 3 phút

### Bước 1: Tạo file .env

Tạo file `.env` trong thư mục root của project:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

**Thay `YOUR_API_KEY_HERE` bằng API key của bạn.**

### Bước 2: Restart server

```bash
# Dừng server (Ctrl+C)
npm start
```

### Bước 3: Kiểm tra

Mở app, xem console log:

```
✅ [ENV DEBUG] Google Maps key source: env length: 39
✅ [ENV DEBUG] Map provider: google
✅ [MapProvider] Initialized with Google Maps API
```

**Xong! App đã dùng Google Maps API.** 🎉

---

## 🔄 Chuyển về OpenStreetMap (nếu hết quota)

### Cách 1: Nhanh nhất

Mở file `constants/index.ts`, dòng 40:

```typescript
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 'openstreetmap'
```

Restart app.

### Cách 2: Comment Google key

Trong file `.env`:

```env
# EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

Đổi provider trong `constants/index.ts`:

```typescript
export const MAP_PROVIDER = 'openstreetmap'
```

---

## 📍 Vị trí các file quan trọng

```
📁 Project Root
├── .env                          # ⚠️ TẠO FILE NÀY - Chứa API keys
├── constants/index.ts            # 🔧 Đổi MAP_PROVIDER ở đây (dòng 40)
├── services/
│   ├── MapProvider.ts            # 🆕 Main service (dùng file này)
│   ├── GoogleMapService.ts       # 🆕 Google Places API
│   ├── GoogleDirectionService.ts # 🆕 Google Directions API
│   ├── MapService.ts             # ✅ OpenStreetMap (giữ nguyên)
│   └── DirectionService.ts       # ✅ OpenRouteService (giữ nguyên)
└── app/(tabs)/map.tsx            # 🔧 Đã cập nhật dùng MapProvider
```

---

## ❓ Troubleshooting nhanh

### Lỗi: "API key not configured"

**Giải pháp**: 
1. Kiểm tra file `.env` đã tạo chưa
2. Kiểm tra API key đã paste đúng chưa (không có khoảng trắng)
3. Restart server

### Lỗi: "REQUEST_DENIED"

**Giải pháp**:
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Enable 2 APIs:
   - **Places API**
   - **Directions API**
3. Restart app

### Lỗi: "OVER_QUERY_LIMIT"

**Giải pháp**: Chuyển sang OpenStreetMap (xem phần trên)

---

## 📚 Docs đầy đủ

- **ENV_CONFIG_GUIDE.md** - Hướng dẫn lấy API key chi tiết
- **MAP_PROVIDER_GUIDE.md** - Hướng dẫn đầy đủ về Map Provider
- **CODEBASE.md** - Tổng quan codebase

---

## 🎯 Checklist

- [ ] Tạo file `.env`
- [ ] Paste Google Maps API key vào `.env`
- [ ] Restart server
- [ ] Kiểm tra console log (phải thấy "Initialized with Google Maps API")
- [ ] Test app: mở map, xem có load nhà hàng không
- [ ] Test directions: chọn nhà hàng, xem có hiện route không

---

**Nếu gặp vấn đề, xem file `MAP_PROVIDER_GUIDE.md` để biết thêm chi tiết!**

