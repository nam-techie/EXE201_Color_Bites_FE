# 🔍 Debug API Keys - Goong Maps

## 🚨 **Vấn đề hiện tại**

Map hiển thị màu xanh trống thay vì bản đồ chi tiết Goong. Nguyên nhân có thể là:

1. **GOONG_MAPTILES_KEY** không được cấu hình đúng
2. **Environment variables** không được load
3. **API key** không hợp lệ hoặc hết hạn

## 🔧 **Cách kiểm tra**

### **Bước 1: Kiểm tra Console Logs**

Khi chạy app, bạn sẽ thấy các log sau trong console:

```
[GoongMapStyles] MapTiles Key configured: ✅ hoặc ❌
[CONSTANTS DEBUG] Final GOONG_MAPTILES_KEY: configured hoặc missing
```

### **Bước 2: Kiểm tra Environment Variables**

Tạo file `.env` ở thư mục gốc dự án với nội dung:

```env
# .env
EXPO_PUBLIC_GOONG_API_KEY="YOUR_API_KEY_HERE"
EXPO_PUBLIC_GOONG_MAPTILES_KEY="YOUR_MAPTILES_KEY_HERE"
```

### **Bước 3: Kiểm tra app.json**

Đảm bảo `app.json` có cấu hình:

```json
{
  "expo": {
    "extra": {
      "GOONG_API_KEY": "YOUR_API_KEY_HERE",
      "GOONG_MAPTILES_KEY": "YOUR_MAPTILES_KEY_HERE"
    }
  }
}
```

### **Bước 4: Kiểm tra Goong Dashboard**

1. Đăng nhập vào [Goong Dashboard](https://account.goong.io/)
2. Vào **API Keys**
3. Kiểm tra có **2 keys**:
   - **API Key** - cho tìm kiếm, chỉ đường
   - **MapTiles Key** - cho hiển thị bản đồ

## 🐛 **Debug Commands**

### **Kiểm tra Environment Variables**

```bash
# Kiểm tra tất cả env vars
npx expo start --clear

# Hoặc thêm debug vào code
console.log('All env vars:', Object.keys(process.env).filter(k => k.startsWith('EXPO_PUBLIC')))
```

### **Kiểm tra URL được tạo**

Thêm debug vào `GoongMapStyles.ts`:

```typescript
// Thêm vào cuối file GoongMapStyles.ts
if (__DEV__) {
  console.log('[DEBUG] Generated URLs:')
  Object.entries(GOONG_MAP_STYLES).forEach(([key, url]) => {
    console.log(`[DEBUG] ${key}: ${url}`)
  })
}
```

## ✅ **Các bước khắc phục**

### **Nếu thấy "❌ VUI LÒNG KIỂM TRA LẠI .ENV":**

1. **Kiểm tra file `.env`** có tồn tại không
2. **Kiểm tra tên biến** có đúng `EXPO_PUBLIC_GOONG_MAPTILES_KEY` không
3. **Restart Expo** với `npx expo start -c`

### **Nếu thấy "✅" nhưng map vẫn trống:**

1. **Kiểm tra API key** có hợp lệ không
2. **Kiểm tra quota** có còn không
3. **Test URL** trực tiếp trong browser

### **Nếu không thấy log nào:**

1. **Kiểm tra `__DEV__`** có bằng `true` không
2. **Kiểm tra console** có bị filter không
3. **Thêm `console.log`** thủ công

## 🧪 **Test URL trực tiếp**

Mở browser và test URL:

```
https://tiles.goong.io/assets/goong_map_web.json?api_key=YOUR_MAPTILES_KEY
```

Nếu trả về JSON hợp lệ → API key đúng
Nếu trả về lỗi → API key sai hoặc hết quota

## 📱 **Test trên thiết bị**

1. **Android Emulator**: Có thể cần cấu hình network
2. **iOS Simulator**: Thường hoạt động tốt
3. **Thiết bị thật**: Cần cấu hình network đúng

## 🆘 **Nếu vẫn không được**

1. **Kiểm tra Goong Dashboard** - quota, billing
2. **Thử API key khác** nếu có
3. **Kiểm tra network** - firewall, proxy
4. **Contact Goong Support** nếu cần

---

**💡 Tip**: Luôn restart Expo sau khi thay đổi environment variables!
