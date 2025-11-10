# Mummi Admin Dashboard

Admin dashboard cho hệ thống Mummi - ứng dụng chia sẻ ẩm thực và trải nghiệm ăn uống.

## 🚀 Tính năng chính

### Phase 1 & 2 (Đã hoàn thành)
-  **Quản lý người dùng** - Xem, chặn/kích hoạt người dùng
-  **Quản lý bài viết** - CRUD bài viết, xem chi tiết
-  **Quản lý nhà hàng** - CRUD nhà hàng, đánh giá
-  **Quản lý giao dịch** - Theo dõi thanh toán, thống kê doanh thu
-  **Quản lý bình luận** - Kiểm duyệt, xóa bình luận
-  **Quản lý tags** - CRUD tags, thống kê sử dụng

### Phase 3 (Mới triển khai)
- 🎭 **Quản lý Moods** - CRUD moods, theo dõi sử dụng
- 🏆 **Quản lý Challenges** - Tạo thử thách, duyệt bài nộp
- 📊 **Thống kê & Analytics** - 6 trang thống kê chi tiết với biểu đồ

### Phase 4 (Tối ưu & Nâng cao)
- ⚡ **Performance Optimization** - Caching, debouncing, React.memo
- 📤 **Export Functionality** - Xuất CSV/PDF cho tất cả modules
- 🔍 **Advanced Search** - Tìm kiếm nâng cao, bộ lọc phức tạp
- 📦 **Bulk Actions** - Thao tác hàng loạt, xóa nhiều mục
- 🎨 **UI/UX Enhancements** - Skeleton loaders, error boundaries, toast notifications

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **UI Library**: Ant Design + Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Dependencies chính

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "antd": "^5.0.0",
  "axios": "^1.3.0",
  "recharts": "^2.10.0",
  "react-csv": "^2.2.2",
  "jspdf": "^2.5.1",
  "date-fns": "^3.0.0"
}
```

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd admin-web
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình environment
```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
VITE_API_BASE_URL=https://mumii-be.namtechie.id.vn
VITE_APP_NAME=Mummi Admin
```

### 4. Chạy development server
```bash
npm run dev
```

Truy cập: `http://localhost:5173`

### 5. Build production
```bash
npm run build
```

## 📁 Cấu trúc thư mục

```
admin-web/
├── src/
│   ├── components/
│   │   ├── common/           # Components dùng chung
│   │   │   ├── DataTable.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── AdvancedSearchBar.tsx
│   │   │   ├── BulkActions.tsx
│   │   │   └── DataTableWithBulkActions.tsx
│   │   ├── charts/           # Chart components
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   └── PieChart.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Posts/
│   │   ├── Restaurants/
│   │   ├── Comments/
│   │   ├── Tags/
│   │   ├── Transactions/
│   │   ├── Moods/              # Phase 3
│   │   ├── Challenges/        # Phase 3
│   │   └── Statistics/        # Phase 3
│   │       ├── index.tsx
│   │       ├── UserAnalytics.tsx
│   │       ├── PostAnalytics.tsx
│   │       ├── RestaurantAnalytics.tsx
│   │       ├── RevenueReports.tsx
│   │       └── EngagementAnalytics.tsx
│   ├── services/
│   │   ├── adminApi.ts
│   │   ├── postsApi.ts
│   │   ├── restaurantsApi.ts
│   │   ├── commentsApi.ts
│   │   ├── tagsApi.ts
│   │   ├── transactionsApi.ts
│   │   ├── moodsApi.ts        # Phase 3
│   │   ├── challengesApi.ts   # Phase 3
│   │   └── statisticsApi.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── post.ts
│   │   ├── restaurant.ts
│   │   ├── comment.ts
│   │   ├── tag.ts
│   │   ├── transaction.ts
│   │   ├── mood.ts            # Phase 3
│   │   └── challenge.ts       # Phase 3
│   ├── hooks/
│   │   ├── useDataTable.ts
│   │   ├── useConfirm.ts
│   │   └── useAutoRefresh.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   ├── cache.ts           # Phase 4
│   │   ├── debounce.ts        # Phase 4
│   │   └── export.ts          # Phase 4
│   └── App.tsx
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔧 API Integration

### Authentication
Tất cả API calls yêu cầu JWT token trong header:
```typescript
Authorization: Bearer <jwt_token>
```

### Base URL
```typescript
const API_BASE_URL = 'https://mumii-be.namtechie.id.vn'
```

### API Endpoints chính

#### Users
- `GET /api/admin/user` - Lấy danh sách users
- `PUT /api/admin/block-user/{userId}` - Chặn user
- `PUT /api/admin/active-user/{userId}` - Kích hoạt user

#### Posts
- `GET /api/admin/posts` - Lấy danh sách posts
- `GET /api/admin/posts/{postId}` - Chi tiết post
- `DELETE /api/admin/posts/{postId}` - Xóa post
- `PUT /api/admin/posts/{postId}/restore` - Khôi phục post

#### Restaurants
- `GET /api/admin/restaurants` - Lấy danh sách restaurants
- `GET /api/admin/restaurants/{restaurantId}` - Chi tiết restaurant
- `DELETE /api/admin/restaurants/{restaurantId}` - Xóa restaurant
- `PUT /api/admin/restaurants/{restaurantId}/restore` - Khôi phục restaurant

#### Transactions
- `GET /api/admin/transactions` - Lấy danh sách transactions
- `GET /api/admin/transactions/{transactionId}` - Chi tiết transaction
- `GET /api/admin/transactions/status/{status}` - Transactions theo status

#### Comments
- `GET /api/admin/comments` - Lấy danh sách comments
- `GET /api/admin/comments/{commentId}` - Chi tiết comment
- `DELETE /api/admin/comments/{commentId}` - Xóa comment
- `PUT /api/admin/comments/{commentId}/restore` - Khôi phục comment

#### Tags
- `GET /api/admin/tags` - Lấy danh sách tags
- `POST /api/admin/tags` - Tạo tag mới
- `PUT /api/admin/tags/{tagId}` - Cập nhật tag
- `DELETE /api/admin/tags/{tagId}` - Xóa tag

#### Moods (Phase 3)
- `GET /api/moods/list` - Lấy danh sách moods
- `POST /api/moods/create` - Tạo mood mới
- `PUT /api/moods/edit/{moodId}` - Cập nhật mood
- `DELETE /api/moods/delete/{moodId}` - Xóa mood

#### Challenges (Phase 3)
- `GET /api/challenges` - Lấy danh sách challenges
- `POST /api/challenges` - Tạo challenge mới
- `PUT /api/challenges/{challengeId}` - Cập nhật challenge
- `DELETE /api/challenges/{challengeId}` - Xóa challenge
- `PUT /api/challenges/{challengeId}/activate` - Kích hoạt challenge
- `PUT /api/challenges/{challengeId}/deactivate` - Vô hiệu hóa challenge

#### Statistics (Phase 3)
- `GET /api/admin/statistics` - Thống kê tổng quan
- `GET /api/admin/statistics/users` - Thống kê users
- `GET /api/admin/statistics/posts` - Thống kê posts
- `GET /api/admin/statistics/restaurants` - Thống kê restaurants
- `GET /api/admin/statistics/revenue` - Thống kê doanh thu
- `GET /api/admin/statistics/engagement` - Thống kê tương tác

## 🎨 UI Components

### DataTable
Component bảng dữ liệu với pagination, sorting, filtering:
```typescript
<DataTable
  data={data}
  columns={columns}
  actions={actions}
  loading={loading}
  pagination={pagination}
  rowKey="id"
/>
```

### StatCard
Component hiển thị thống kê:
```typescript
<StatCard
  title="Tổng người dùng"
  value="1,234"
  icon={<Users />}
  color="#1890ff"
  change={{ value: 12, type: 'increase', label: 'Tăng 12%' }}
/>
```

### Charts
Sử dụng Recharts cho biểu đồ:
```typescript
<LineChart
  data={data}
  dataKey="value"
  xAxisKey="month"
  lines={[{ dataKey: 'users', name: 'Users', color: '#1890ff' }]}
  height={300}
/>
```

## ⚡ Performance Optimizations

### Caching
- API response caching với TTL
- Cache invalidation strategies
- Memory cache management

### Debouncing
- Search input debouncing (300ms)
- API call throttling
- Scroll event optimization

### React Optimizations
- React.memo cho components
- useMemo cho expensive calculations
- useCallback cho event handlers
- Lazy loading cho routes

## 📤 Export Functionality

### CSV Export
```typescript
import { exportUsers, exportPosts } from '../utils/export'

// Export users to CSV
exportUsers(users)

// Export posts to CSV
exportPosts(posts)
```

### PDF Export
```typescript
import { generatePDF } from '../utils/export'

generatePDF({
  title: 'Báo cáo người dùng',
  data: tableData,
  headers: ['ID', 'Tên', 'Email'],
  filename: 'users-report'
})
```

## 🔍 Advanced Search

### AdvancedSearchBar
```typescript
<AdvancedSearchBar
  onSearch={handleSearch}
  onReset={handleReset}
  searchFields={[
    { key: 'name', label: 'Tên' },
    { key: 'email', label: 'Email' }
  ]}
  dateFields={[
    { key: 'createdAt', label: 'Ngày tạo' }
  ]}
  selectFields={[
    { key: 'status', label: 'Trạng thái', options: statusOptions }
  ]}
/>
```

## 📦 Bulk Actions

### DataTableWithBulkActions
```typescript
<DataTableWithBulkActions
  data={data}
  columns={columns}
  actions={actions}
  onBulkDelete={handleBulkDelete}
  onBulkExport={handleBulkExport}
  getItemName={(item) => item.name}
/>
```

## 🎨 UI/UX Enhancements

### Skeleton Loaders
```typescript
<TableSkeleton rows={5} />
<CardSkeleton count={4} />
<ChartSkeleton />
```

### Error Boundary
```typescript
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Toast Notifications
```typescript
const { showSuccess, showError } = useToast()

showSuccess('Thao tác thành công!')
showError('Đã xảy ra lỗi!')
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Component Tests
```bash
npm run test:components
```

### E2E Tests
```bash
npm run test:e2e
```

## 📚 Documentation

### API Documentation
- [API Endpoints](./docs/api-endpoints.md)
- [Authentication](./docs/authentication.md)
- [Error Handling](./docs/error-handling.md)

### Component Documentation
- [DataTable](./docs/components/DataTable.md)
- [Charts](./docs/components/Charts.md)
- [Forms](./docs/components/Forms.md)

### Deployment
- [Production Build](./docs/deployment.md)
- [Environment Variables](./docs/environment.md)
- [Performance Monitoring](./docs/performance.md)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
VITE_API_BASE_URL=https://your-api-url.com
VITE_APP_NAME=Mummi Admin
VITE_APP_VERSION=1.0.0
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@colorbites.com
- **Documentation**: [docs.colorbites.com](https://docs.colorbites.com)
- **Issues**: [GitHub Issues](https://github.com/colorbites/admin-dashboard/issues)

---

**Mummi Admin Dashboard** - Quản lý hệ thống ẩm thực một cách thông minh và hiệu quả! 🍽️✨