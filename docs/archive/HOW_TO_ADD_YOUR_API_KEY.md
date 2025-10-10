# 🔑 Cách thêm Google Maps API Key của bạn

## ⚡ Siêu nhanh - 2 bước

### Bước 1: Tạo file .env

Trong thư mục root của project (cùng cấp với `package.json`), tạo file tên `.env`

### Bước 2: Paste API key vào

Mở file `.env`, paste dòng này:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

**Thay `YOUR_API_KEY_HERE` bằng API key bạn có.**

Ví dụ:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Bước 3: Restart

```bash
# Dừng server (Ctrl+C)
npm start
```

**XONG!** 🎉

---

## 📍 Vị trí file .env

```
📁 EXE201_Color_Bites_FE/
├── 📄 package.json
├── 📄 .env                 ⬅️ TẠO FILE NÀY
├── 📄 app.json
├── 📁 app/
├── 📁 services/
└── ...
```

---

## ✅ Kiểm tra xem đã đúng chưa

### Cách 1: Chạy test script

```bash
node scripts/testMapProvider.js
```

Phải thấy:

```
✅ EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is configured
   Key length: 39 characters
```

### Cách 2: Xem console khi chạy app

```bash
npm start
```

Console phải hiển thị:

```
✅ [ENV DEBUG] Google Maps key source: env length: 39
✅ [MapProvider] Status: ✅ Configured
```

---

## 🐛 Nếu không hoạt động

### Lỗi: "API key not configured"

**Kiểm tra**:
1. File `.env` có ở đúng vị trí không? (cùng cấp với `package.json`)
2. Tên file có đúng là `.env` không? (không phải `env.txt` hay `.env.txt`)
3. API key có khoảng trắng thừa không?

**Sửa**:
```env
# ❌ SAI
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = AIzaSy...  (có khoảng trắng)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=  AIzaSy... (có khoảng trắng)

# ✅ ĐÚNG
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### Lỗi: "REQUEST_DENIED"

**Nguyên nhân**: API key chưa enable APIs

**Sửa**:
1. Vào: https://console.cloud.google.com/
2. Chọn project của bạn
3. Vào "APIs & Services" > "Library"
4. Tìm và enable:
   - ✅ **Places API**
   - ✅ **Directions API**
5. Restart app

---

## 🔄 Muốn dùng OpenStreetMap thay vì Google Maps?

Mở file `constants/index.ts`, tìm dòng 40:

```typescript
// Đổi từ 'google' sang 'openstreetmap'
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 'openstreetmap'
```

Restart app.

**Khi nào dùng OpenStreetMap?**
- Hết quota Google Maps
- Development/testing
- Muốn tiết kiệm chi phí

---

## 📝 File .env đầy đủ

Nếu bạn muốn cấu hình đầy đủ:

```env
# Google Maps API Key (BẮT BUỘC nếu dùng Google Maps)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_key_here

# OpenRouteService API Key (OPTIONAL - dùng khi fallback sang OpenStreetMap)
EXPO_PUBLIC_OPENROUTE_API_KEY=your_openroute_key_here

# Backend API URL (OPTIONAL - mặc định localhost)
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## 🎯 Tóm tắt

1. ✅ Tạo file `.env` trong thư mục root
2. ✅ Paste: `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key`
3. ✅ Restart: `npm start`
4. ✅ Kiểm tra console log

**Chỉ cần 2 phút!** ⏱️

---

## 📚 Xem thêm

- `QUICK_START_GOOGLE_MAPS.md` - Hướng dẫn nhanh
- `ENV_CONFIG_GUIDE.md` - Hướng dẫn chi tiết lấy API key
- `MAP_PROVIDER_GUIDE.md` - API reference đầy đủ

---

**Cần hỗ trợ?** Đọc `MAP_PROVIDER_GUIDE.md` phần Troubleshooting.

