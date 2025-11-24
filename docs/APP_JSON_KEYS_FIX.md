# 🔧 SỬA LỖI GOONG API KEYS - ĐỌC TỪ APP.JSON

> **Hướng dẫn sửa lỗi Goong API keys đọc từ app.json thay vì .env**  
> Cập nhật: 25/01/2025

---

## 🎯 VẤN ĐỀ ĐÃ ĐƯỢC GIẢI QUYẾT

Dự án Color Bites **KHÔNG sử dụng file .env** mà sử dụng cơ chế cũ của Expo: lưu API keys trực tiếp trong `app.json` → `expo.extra`.

### ✅ Những gì đã được sửa:

1. **GoongMapStyles.ts** - Đọc key từ `Constants.expoConfig.extra`
2. **MapProvider.ts** - Sử dụng constants thay vì `process.env`
3. **constants/index.ts** - Đã có sẵn logic đọc từ cả `.env` và `app.json`
4. **Debug logs** - Thêm logs chi tiết để kiểm tra

---

## 🚀 CÁCH TEST APP

### Bước 1: Khởi động lại server
```bash
# Clear cache và restart
npx expo start -c
```

### Bước 2: Chạy app với Dev Client
```bash
# Prebuild (bắt buộc)
npx expo prebuild

# Run trên Android
npx expo run:android
```

### Bước 3: Kiểm tra Console Logs
Khi app khởi động, console phải hiển thị:

```
✅ [CONSTANTS DEBUG] extraGoongApi from app.json: true
✅ [CONSTANTS DEBUG] extraGoongTiles from app.json: true
✅ [CONSTANTS DEBUG] Final GOONG_API_KEY: configured
✅ [CONSTANTS DEBUG] Final GOONG_MAPTILES_KEY: configured
✅ [GoongMapStyles] Đọc MapTiles Key từ app.json: ✅ CÓ KEY: ...lnk
✅ [GoongMapStyles] Key cuối cùng được sử dụng: ✅ IUVEYS4R...
✅ [MapProvider] Using Goong Maps + Goong Direction API
✅ [MapProvider] Provider: Goong Maps
✅ [MapProvider] Status: ✅ Configured
```

### Bước 4: Test Map Functionality
1. **Mở tab Map** - Bản đồ phải hiển thị chi tiết
2. **Test search** - Tìm kiếm địa điểm phải hoạt động
3. **Test directions** - Chỉ đường phải hoạt động
4. **Test nearby restaurants** - Load nhà hàng gần vị trí

---

## 🔍 DEBUGGING

### Nếu vẫn thấy lỗi "API key not configured":

1. **Kiểm tra app.json**:
```bash
node scripts/testAppJsonKeys.js
```

2. **Kiểm tra console logs** - Tìm dòng:
```
❌ KHÔNG TÌM THẤY KEY TRONG app.json
```

3. **Restart hoàn toàn**:
```bash
# Stop server
# Clear cache
npx expo start -c

# Rebuild
npx expo prebuild
npx expo run:android
```

### Nếu map vẫn không hiển thị:

1. **Kiểm tra network** - Đảm bảo có internet
2. **Kiểm tra Goong keys** - Có thể key bị hết hạn
3. **Test với key mới** - Tạo key mới tại https://account.goong.io/

---

## 📊 KIỂM TRA CẤU HÌNH

### Script test tự động:
```bash
node scripts/testAppJsonKeys.js
```

Output mong đợi:
```
🎉 [TEST] THÀNH CÔNG! Tất cả keys đã được cấu hình trong app.json
```

### Kiểm tra thủ công:
1. Mở `app.json`
2. Tìm section `"extra"`
3. Kiểm tra có `GOONG_API_KEY` và `GOONG_MAPTILES_KEY`

---

## 🎉 KẾT QUẢ MONG ĐỢI

Sau khi sửa xong:
- ✅ Map hiển thị chi tiết với Goong style
- ✅ Search địa điểm hoạt động
- ✅ Chỉ đường hoạt động  
- ✅ Load nhà hàng gần vị trí
- ✅ Console logs hiển thị "✅ Configured"

---

## 🔗 TÀI LIỆU LIÊN QUAN

- [Goong Setup Guide](./GOONG_SETUP.md)
- [Tóm tắt dự án](./TOM_TAT_DU_AN.md)
- [Google Maps UI Implementation](./GOOGLE_MAPS_UI_IMPLEMENTATION.md)

---

**Status**: ✅ **HOÀN THÀNH**  
**Last Updated**: 25/01/2025  
**Fix Applied**: App.json keys reading
