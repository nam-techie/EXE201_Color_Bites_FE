# Color Bites Admin Web

Trang web quản trị cho ứng dụng Color Bites, được xây dựng với React + TypeScript + Tailwind CSS.

## 🚀 Tính năng

### ✅ Đã hoàn thành:
- ✅ Dashboard với giao diện giống CoreUI
- ✅ Quản lý người dùng (User Management)
- ✅ Xem danh sách tất cả người dùng
- ✅ Chặn/Kích hoạt người dùng
- ✅ Tìm kiếm và lọc người dùng
- ✅ Authentication với JWT
- ✅ Protected Routes
- ✅ Responsive design

### 🔄 API Integration:
- `GET /api/admin/user` - Lấy danh sách tất cả người dùng
- `PUT /api/admin/block-user/{id}` - Chặn người dùng
- `PUT /api/admin/active-user/{id}` - Kích hoạt người dùng

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router Dom** - Routing
- **Axios** - HTTP Client
- **Lucide React** - Icons

## 📦 Cài đặt và chạy

### Yêu cầu hệ thống:
- Node.js >= 18
- npm hoặc yarn

### Các bước cài đặt:

1. **Cài đặt dependencies:**
   ```bash
   cd admin-web
   npm install
   ```

2. **Khởi chạy development server:**
   ```bash
   npm run dev
   ```

3. **Truy cập ứng dụng:**
   - Mở browser và truy cập: http://localhost:5173
   - Trang login: http://localhost:5173/login

## 🔐 Authentication

### Demo Login:
- Nhập bất kỳ username và password nào để truy cập (demo mode)
- Trong production, cần tích hợp với API login thực tế

### Token Management:
- JWT token được lưu trong localStorage
- Auto redirect đến login khi token hết hạn
- Logout sẽ xóa token và redirect về login

## 📱 Responsive Design

Giao diện được thiết kế responsive, hoạt động tốt trên:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🎨 Giao diện

### Dashboard:
- 4 cards thống kê chính (Users, Income, Conversion Rate, Sessions)
- Biểu đồ traffic (placeholder)
- Layout giống CoreUI template

### User Management:
- Bảng danh sách người dùng với đầy đủ thông tin
- Search và filter theo trạng thái
- Actions: View, Block/Activate user
- Hiển thị avatar, role, ngày tạo, cập nhật

### Sidebar Navigation:
- Dashboard
- Users  
- Settings (placeholder)
- Logout functionality

## 🔧 Cấu hình

### API Base URL:
```typescript
// src/services/adminApi.ts
const API_BASE_URL = 'http://192.168.1.106:8080'
```

### Port Configuration:
```typescript
// vite.config.ts
server: {
  port: 3001,
  host: true
}
```

## 📝 Scripts

| Script | Mô tả |
|--------|--------|
| `npm run dev` | Khởi chạy development server |
| `npm run build` | Build production |
| `npm run preview` | Preview production build |
| `npm run lint` | Chạy ESLint |

## 🚦 API Status

### Backend Requirements:
Đảm bảo backend đang chạy trên `http://192.168.1.106:8080` và có các endpoints:

- `GET /api/admin/user` - Trả về `ApiResponse<ListAccountResponse[]>`
- `PUT /api/admin/block-user/{id}` - Trả về `ApiResponse<void>`
- `PUT /api/admin/active-user/{id}` - Trả về `ApiResponse<void>`

### Response Format:
```typescript
interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

interface ListAccountResponse {
  id: string
  username: string
  isActive: boolean
  role: string
  avatarUrl: string
  created: string // LocalDateTime
  updated: string // LocalDateTime
}
```

## 📋 TODO (Tương lai)

- [ ] Implement real admin login API
- [ ] Add user detail modal
- [ ] Add bulk actions for users
- [ ] Add pagination for large user lists
- [ ] Add user statistics charts
- [ ] Add admin role management
- [ ] Add system settings page
- [ ] Add audit logs
- [ ] Add export user data functionality

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use:**
   ```bash
   # Change port in vite.config.ts or kill existing process
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

2. **API connection failed:**
   - Kiểm tra backend đang chạy
   - Kiểm tra API_BASE_URL trong adminApi.ts
   - Kiểm tra CORS settings

3. **Build errors:**
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

## 👥 Development Team

**EXE201 - Color Bites Development Team**

---

**Happy Coding! 🚀**
