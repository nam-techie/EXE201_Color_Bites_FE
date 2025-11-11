# Google Maps UI Style Implementation

## Tổng quan

UI của Map screen đã được redesign theo phong cách Google Maps với các cải tiến sau:

### 🎨 Các thành phần chính

1. **Search Bar (Thanh tìm kiếm)** - Google Maps Style
   - Hình dạng pill (bo tròn hoàn toàn) với height 56px
   - Icon hamburger menu (3 gạch ngang) bên trái
   - TextInput ở giữa với placeholder "Tìm kiếm ở đây"
   - Icon microphone (chỉ UI, chưa có chức năng)
   - Avatar người dùng bên phải (có thể nhấn để vào Profile)

2. **Filter Buttons (Nút lọc)**
   - Các nút filter nằm ngang phía dưới search bar
   - Scroll ngang để xem thêm categories
   - Style đẹp với icon + text

3. **Side Menu (Menu bên trái)**
   - Slide từ trái sang phải khi nhấn icon hamburger
   - 3 mục chính:
     - 📌 Địa điểm đã lưu
     - 🍴 Quán đã tạo
     - ⏱️ Lịch sử
   - Width: 320px với animation mượt mà

### 📂 Files đã tạo/chỉnh sửa

#### Files mới:
- `components/map/MapSideMenu.tsx` - Side menu hamburger component

#### Files đã chỉnh sửa:
- `components/common/SearchBar.tsx` - Redesign theo Google Maps style
- `app/(tabs)/map.tsx` - Tích hợp SearchBar và MapSideMenu mới

### 🎯 Chức năng

#### SearchBar
```tsx
<RestaurantSearchBar
  searchQuery={searchQuery}
  onSearchChange={handleSearchChange}
  onClearSearch={handleClearSearch}
  onMenuPress={handleMenuPress}        // Mở side menu
  onAvatarPress={handleAvatarPress}    // Navigate đến Profile
  onMicPress={handleMicPress}          // UI only (placeholder)
  avatarUrl={userAvatar}               // Avatar từ UserService API
/>
```

**Avatar Source Priority:**
1. `UserService.getUserInformation()` → `avatarUrl`
2. Fallback: `user.avatar` từ AuthProvider
3. Default: Generated avatar từ `getDefaultAvatar()`

#### MapSideMenu
```tsx
<MapSideMenu
  visible={menuVisible}
  onClose={() => setMenuVisible(false)}
  onNavigateToSavedPlaces={() => {...}}
  onNavigateToMyPlaces={() => {...}}
  onNavigateToHistory={() => {...}}
/>
```

#### FilterButtons
```tsx
<FilterButtons
  selectedFilter={selectedFilter}
  onFilterChange={handleFilterChange}
/>
```

### 🎨 Styling Guidelines

#### Search Bar
- **Border-radius**: 28px (pill shape)
- **Height**: 56px
- **Background**: #FFFFFF
- **Shadow**: elevation 5, shadowOpacity 0.2
- **Padding**: 16px horizontal
- **Position**: top 48px, left/right 16px

#### Filter Buttons
- **Position**: top 112px (48 + 56 + 8)
- **Border-radius**: 20px
- **Selected**: Background #3b82f6, text white
- **Unselected**: Background white, shadow

#### Side Menu
- **Width**: 320px
- **Background**: #FFFFFF
- **Animation**: Spring animation (tension: 65, friction: 11)
- **Shadow**: elevation 10, shadowOpacity 0.25

### 🔧 Cách sử dụng

1. **Tìm kiếm**: Gõ vào search bar để tìm nhà hàng/địa điểm (TODO: Implement backend search)

2. **Lọc**: Nhấn vào các nút filter để lọc theo loại nhà hàng

3. **Menu**: Nhấn icon hamburger để mở menu sidebar với các tùy chọn

4. **Avatar**: Nhấn vào avatar để đến trang Profile

5. **Microphone**: UI placeholder, chưa có chức năng voice search

### 📝 TODO - Tích hợp Backend

1. **Search API**
   ```typescript
   const handleSearchChange = async (query: string) => {
     setSearchQuery(query)
     // TODO: Call backend search API
     // - Search cả restaurants và places
     // - Hiển thị suggestions dropdown
   }
   ```

2. **Filter Logic**
   ```typescript
   const handleFilterChange = (filter: string) => {
     setSelectedFilter(filter)
     // TODO: Filter restaurants by category
   }
   ```

3. **Menu Features**
   - Saved Places: Lưu các địa điểm yêu thích
   - My Places: Quản lý quán của người dùng
   - History: Lịch sử tìm kiếm và ghé thăm

### 🎯 UI/UX Features

✅ **Đã hoàn thành:**
- Google Maps style search bar
- Hamburger side menu với animation
- Avatar integration từ UserService
- Filter buttons với icon
- Responsive và mượt mà

⏳ **Sắp tới:**
- Backend search integration
- Voice search functionality
- Saved places feature
- My places management
- Search history

### 🚀 Performance

- Avatar được load async với fallback
- Menu animation sử dụng native driver
- Filter buttons scroll ngang smooth
- Search debouncing (when implemented)

### 📱 Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web (Expo)

### 🎨 Design System

Colors:
- Primary: #F97316 (Orange)
- Blue: #3B82F6
- Gray: #5F6368, #9CA3AF
- White: #FFFFFF
- Background: #FFF7ED (Light Orange)

Typography:
- Search placeholder: 16px
- Menu title: 20px bold
- Menu item: 16px semibold
- Menu subtitle: 13px

Spacing:
- Base unit: 8px
- Search bar top: 48px
- Filter buttons top: 112px
- Icon sizes: 20-24px
- Avatar: 32px

---

**Created:** October 10, 2025
**Version:** 1.0.0
**Map Provider:** OpenStreetMap (Overpass API)

