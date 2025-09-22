# 🔧 Cấu hình Environment Variables

## Tạo file .env

Tạo file `.env` trong thư mục root của dự án với nội dung sau:

```env
# Backend API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080

# OpenRoute Service API Key (for map functionality) 
EXPO_PUBLIC_OPENROUTE_API_KEY=your_openroute_api_key_here

# Environment
EXPO_PUBLIC_ENV=development
```

## Cấu hình chi tiết:

### 1. **EXPO_PUBLIC_API_BASE_URL**
- **Development**: `http://localhost:8080` (nếu backend chạy local)
- **Production**: URL của server production
- **Emulator Android**: `http://10.0.2.2:8080` (nếu backend chạy trên máy host)
- **Physical Device**: IP address của máy (ví dụ: `http://192.168.1.100:8080`)

### 2. **EXPO_PUBLIC_OPENROUTE_API_KEY**
- Lấy free API key tại: https://openrouteservice.org/
- Hoặc sử dụng key có sẵn trong constants/index.ts

## Test kết nối API:

1. **Khởi động backend server**
2. **Kiểm tra URL trong browser**: `http://localhost:8080/api/posts/list`
3. **Chạy app và test tạo post**

## Lưu ý:
- File `.env` không được commit lên git
- Prefix `EXPO_PUBLIC_` là bắt buộc cho Expo
- Restart app sau khi thay đổi env variables
