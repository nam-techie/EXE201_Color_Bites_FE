# 🔐 Environment Variables Setup

## 📋 Các biến môi trường cần thiết

### 1. OpenRouteService API Key

**Mục đích**: Sử dụng cho tính năng chỉ đường và tính toán lộ trình

**Cách lấy API key:**
1. Truy cập: https://openrouteservice.org/dev/#/signup
2. Đăng ký tài khoản miễn phí
3. Copy API key từ dashboard

**Cách setup:**
1. Tạo file `.env` trong thư mục gốc của dự án
2. Thêm dòng sau vào file `.env`:
```bash
EXPO_PUBLIC_OPENROUTE_API_KEY=your_api_key_here
```

**Ví dụ:**
```bash
EXPO_PUBLIC_OPENROUTE_API_KEY=your_api_key_here
```

### 2. Backend API Base URL (Optional)

**Mục đích**: URL của backend API

**Cách setup:**
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 🚀 Cách sử dụng

1. **Tạo file .env:**
   ```bash
   touch .env
   ```

2. **Thêm các biến môi trường vào .env:**
   ```bash
   EXPO_PUBLIC_OPENROUTE_API_KEY=your_api_key_here
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

3. **Restart development server:**
   ```bash
   npx expo start --clear
   ```

## ⚠️ Lưu ý bảo mật

- ✅ File `.env` đã được thêm vào `.gitignore`
- ✅ Không commit API key lên Git
- ✅ Chia sẻ API key qua kênh bảo mật khác
- ✅ Sử dụng API key riêng cho production

## 🔧 Troubleshooting

**Lỗi "OpenRouteService API key not configured":**
- Kiểm tra file `.env` có tồn tại không
- Kiểm tra tên biến có đúng `EXPO_PUBLIC_OPENROUTE_API_KEY` không
- Restart development server sau khi thêm biến môi trường

**Lỗi "Invalid API key":**
- Kiểm tra API key có đúng không
- Kiểm tra API key có hết hạn không
- Tạo API key mới nếu cần