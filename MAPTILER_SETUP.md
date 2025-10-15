# MapTiler Setup Guide

## 🚀 Cách lấy API Key MapTiler

### Bước 1: Đăng ký tài khoản
1. Truy cập: https://cloud.maptiler.com/
2. Click "Sign up" để tạo tài khoản miễn phí
3. Xác thực email

### Bước 2: Lấy API Key
1. Đăng nhập vào MapTiler Cloud
2. Vào tab **"API Keys"** (bên trái)
3. Copy API key (dạng: `abc123def456...`)

### Bước 3: Cấu hình trong app
1. Tạo file `.env` trong root project (cùng cấp với `package.json`)
2. Thêm dòng:
```
EXPO_PUBLIC_MAPTILER_KEY=your_actual_key_here
```

### Bước 4: Restart app
```bash
npx expo start --clear
```

## 🗺️ 5 Map Styles có sẵn

App đã tích hợp 5 map styles từ MapTiler:

1. **Đường phố** (Streets) - Mặc định, giống Google Maps
2. **Sáng** (Bright) - Tông sáng, dễ nhìn
3. **Ngoài trời** (Outdoor) - Xanh lá, phù hợp du lịch/F&B
4. **Vệ tinh** (Satellite) - Ảnh thực từ vệ tinh
5. **Cơ bản** (Basic) - Tối giản, nhanh tải

## 🎯 Cách sử dụng

1. Mở app → vào tab **Map**
2. Click nút **Layers** (góc dưới bên phải)
3. Chọn loại bản đồ muốn dùng
4. Lựa chọn sẽ được lưu tự động

## 💡 Lưu ý

- **Free tier**: 100,000 requests/tháng
- **1 key dùng cho tất cả 5 styles**
- **Lựa chọn được lưu** và giữ nguyên khi mở lại app
- **Không cần Mapbox token** - MapTiler hoàn toàn miễn phí

## 🔧 Troubleshooting

### Map vẫn trắng?
- Kiểm tra API key có đúng không
- Đảm bảo file `.env` ở đúng vị trí
- Restart app với `--clear` flag

### Lỗi network?
- Kiểm tra kết nối internet
- Thử style khác (Basic thường ổn định nhất)

## 📱 Kết quả

✅ Map hiển thị đẹp với MapTiler tiles  
✅ 5 styles khác nhau để chọn  
✅ UI chọn layer đẹp, dễ dùng  
✅ Lưu preference tự động  
✅ Hoàn toàn miễn phí
