# 🗺️ Hướng Dẫn Sử Dụng UI Mới - Map Screen

## ✨ Tính Năng Mới

### 1. 🔍 Ô Tìm Kiếm Thông Minh (Google Places Autocomplete)
- **Vị trí:** Phía trên cùng của map
- **Chức năng:**
  - Gõ địa chỉ → Hiện gợi ý tự động
  - Chọn địa điểm → Map zoom đến và chỉ đường
  - Icon micro (voice search) - để dành cho tương lai
  - Icon menu (hamburger) - để dành cho tương lai
  - Icon avatar - để dành cho tương lai

### 2. 🎯 Nút Quick Action (Dưới search bar)
Các nút tròn nhanh:
- 🏠 **Nhà riêng** - Tìm điểm quan tâm gần
- 🍽️ **Nhà hàng** - Tìm nhà hàng gần
- 🏨 **Khách sạn** - Tìm khách sạn gần
- ⛽ **Xăng dầu** - Tìm trạm xăng gần
- ☕ **Cà phê** - Tìm quán cà phê gần
- 🛒 **Mua sắm** - Tìm trung tâm mua sắm
- 🏦 **Ngân hàng** - Tìm ngân hàng gần
- 🏥 **Bệnh viện** - Tìm bệnh viện gần

### 3. 📍 Nút Vị Trí Hiện Tại
- **Vị trí:** Góc phải, phía dưới
- **Icon:** Mũi tên định vị (locate)
- **Chức năng:** Quay về vị trí hiện tại của bạn

### 4. 🗺️ Nút Layers
- **Vị trí:** Góc phải, dưới nút location
- **Icon:** Layers
- **Chức năng:** Chọn loại bản đồ (satellite, terrain, traffic)
- **Trạng thái:** Đang để dành, chưa implement

## 🎨 Thay Đổi Giao Diện

### Đã Xóa:
- ❌ FilterButtons cũ (Tất cả, Việt Nam, Chay, Pizza, etc.)
- ❌ SearchBar cũ (tìm kiếm nhà hàng)
- ❌ Counter "X nhà hàng được tìm thấy"

### Đã Thêm:
- ✅ Google Places Search Bar (autocomplete thông minh)
- ✅ Quick Action Buttons (8 nút nhanh)
- ✅ My Location button (style Google Maps)
- ✅ Layers button (placeholder)

## 🔧 Cách Sử Dụng

### Tìm Kiếm Địa Điểm:
1. Nhấn vào ô "Tìm kiếm ở đây"
2. Gõ địa chỉ (vd: "Bitexco", "Vincom Center", "Bệnh viện FV")
3. Chọn một kết quả từ danh sách gợi ý
4. Map tự động zoom đến địa điểm
5. Hiển thị marker xanh tại địa điểm
6. Tự động chỉ đường từ vị trí hiện tại (nếu có)

### Quick Action:
1. Nhấn vào một trong 8 nút (vd: "Nhà hàng")
2. Hệ thống tìm địa điểm gần nhất
3. Map zoom đến địa điểm đầu tiên
4. Hiển thị chỉ đường

### Quay Về Vị Trí Hiện Tại:
1. Nhấn nút "My Location" (icon locate)
2. Map zoom về vị trí của bạn

## 📦 Files Mới

### Components:
1. `components/common/GooglePlacesSearchBar.tsx` - Search bar với autocomplete
2. `components/common/QuickActionButtons.tsx` - 8 nút quick action

### Services:
3. `services/GooglePlacesAutocomplete.ts` - Service gọi Google Places API

### Updated:
4. `app/(tabs)/map.tsx` - Map screen với UI mới

## 🔑 Google APIs Sử Dụng

### 1. Places Autocomplete API
- Gợi ý địa điểm khi gõ
- Cost: ~$2.83 / 1000 sessions

### 2. Places Details API
- Lấy tọa độ, địa chỉ chi tiết
- Cost: $17 / 1000 requests

### 3. Places Nearby Search API
- Tìm địa điểm gần theo loại
- Cost: $32 / 1000 requests

### 4. Directions API
- Chỉ đường từ A đến B
- Cost: $5 / 1000 requests (basic)

**💰 Free Credit:** Google tặng $200/tháng → Đủ để dev/test

## ⚙️ Cấu Hình

API key đã được setup trong `.env`:
```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Map provider trong `constants/index.ts`:
```typescript
export const MAP_PROVIDER: 'google' | 'openstreetmap' = 'google'
```

## 🧪 Testing

```bash
# Start app
npx expo start

# Scan QR code hoặc press:
# - 'a' để mở Android
# - 'i' để mở iOS
# - 'w' để mở web
```

### Test Steps:
1. ✅ Mở Map tab
2. ✅ Nhấn search bar → Gõ "Bitexco"
3. ✅ Chọn kết quả đầu tiên
4. ✅ Kiểm tra map zoom đến địa điểm
5. ✅ Kiểm tra hiển thị đường đi (polyline xanh)
6. ✅ Nhấn "Nhà hàng" quick action
7. ✅ Kiểm tra tìm nhà hàng gần
8. ✅ Nhấn "My Location"
9. ✅ Kiểm tra quay về vị trí hiện tại

## ⚠️ Lưu Ý

1. **Autocomplete có debounce 500ms** - Tránh spam API
2. **Voice search** - Chỉ là UI, chưa implement
3. **Menu icon** - Chỉ là UI, chưa implement
4. **Layers button** - Placeholder, chưa implement
5. **Cần enable Location permission** - Để hiển thị vị trí hiện tại

## 🐛 Troubleshooting

### Không hiển thị gợi ý khi search:
- Kiểm tra API key có đúng không
- Kiểm tra Places API đã enable chưa
- Xem console logs để debug

### Không chỉ đường được:
- Kiểm tra Directions API đã enable chưa
- Kiểm tra có quyền Location không
- Xem console logs

### App crash khi nhấn Quick Action:
- Kiểm tra Places Nearby API đã enable chưa
- Kiểm tra có location permission không

## 📞 Support

Nếu gặp vấn đề:
1. Check console logs
2. Check Google Cloud Console → APIs & Services → Enabled APIs
3. Check API key restrictions
4. Check billing account (nếu vượt free tier)

## 🎯 Style Guide

UI này được thiết kế theo **Google Maps Material Design**:
- White background buttons với shadow
- Rounded corners (24px radius)
- Icons màu #5F6368 (gray)
- Selected/Active màu #4285F4 (blue)
- Clean, minimal, modern

Enjoy coding! 🚀

