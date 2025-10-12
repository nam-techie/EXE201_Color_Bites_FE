# UI Visual Description - Google Maps Style Map Screen

## 🎨 Mô tả giao diện

### Layout tổng thể

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌─────────────────────────────────────┐   │ ← Search Bar (top: 48px)
│  │ ☰  Tìm kiếm ở đây         🎤  👤 │   │   Height: 56px, Pill shape
│  └─────────────────────────────────────┘   │   
│                                             │
│  ┌───┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ →      │ ← Filter Buttons (top: 112px)
│  │🏠 │ │🍜  │ │🍕  │ │☕  │ │🍔  │        │   Scroll horizontal
│  └───┘ └────┘ └────┘ └────┘ └────┘        │
│                                             │
│         🗺️  OpenStreetMap View             │
│              (with markers)                 │
│                                             │
│              📍   📍                        │
│         📍        📍   📍                   │
│                                             │
│                                        ⦿   │ ← My Location button
│                                             │
│                                        ▦   │ ← Layers button
│                                             │
│                                        🗺️  │ ← Route Planning button
│                                             │
└─────────────────────────────────────────────┘
```

### Side Menu (khi mở)

```
┌──────────────────┐                          │
│                  │                          │
│  🗺️ Color Bites  │       ✕                 │ ← Menu Header
│                  │                          │
├──────────────────┤                          │
│                  │                          │
│  📌  Địa điểm đã lưu          →           │
│      Xem các địa điểm bạn đã lưu          │
│                  │                          │
│  🍴  Quán đã tạo               →           │
│      Quản lý quán của bạn                  │
│                  │                          │
│  ⏱️  Lịch sử                   →           │
│      Xem lịch sử tìm kiếm                  │
│                  │                          │
│                  │                          │
│                  │                          │
├──────────────────┤                          │
│ Version 1.0.0    │                          │
│ Made with ❤️     │                          │
└──────────────────┘                          │
    320px width
```

## 🎨 Chi tiết từng thành phần

### 1. Search Bar

**Vị trí**: Top 48px, Left/Right 16px  
**Kích thước**: Height 56px, Full width (minus 32px margins)  
**Style**:
- Background: White (#FFFFFF)
- Border radius: 28px (pill shape)
- Shadow: elevation 5, shadowOpacity 0.2
- Padding: 16px horizontal

**Thành phần bên trong (từ trái qua phải)**:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ☰   [Tìm kiếm ở đây________________]   🎤   👤  │
│  ↑            ↑                          ↑    ↑   │
│  │            │                          │    │   │
│  Menu      Search input              Mic  Avatar │
│ (24px)      (flex: 1)              (20px) (32px) │
│                                                     │
└─────────────────────────────────────────────────────┘
     12px   8px                      12px  12px  4px
   spacing spacing                spacing spacing spacing
```

**Icons**:
- Hamburger (☰): Ionicons "menu", size 24, color #5F6368
- Microphone (🎤): Ionicons "mic", size 20, color #5F6368
- Avatar (👤): Circle 32x32, border-radius 16px

**Avatar states**:
1. **Có ảnh**: Hiển thị ảnh từ UserService/AuthProvider
2. **Không có ảnh**: Placeholder với icon person, background #FFF7ED, color #F97316

### 2. Filter Buttons

**Vị trí**: Top 112px (48 + 56 + 8)  
**Style**: Scroll horizontal

**Mỗi button**:
- Height: ~36px (padding 8px vertical)
- Padding: 16px horizontal
- Border-radius: 20px
- Margin-right: 12px

**States**:

Selected (active):
```
┌──────────────┐
│ 🏠 Tất cả   │  Background: #3B82F6
└──────────────┘  Text: White, Icon: White
```

Unselected:
```
┌──────────────┐
│ 🍜 Việt Nam │  Background: White
└──────────────┘  Text: #374151, Icon: #3B82F6
                  Shadow: elevation 5
```

### 3. Side Menu

**Kích thước**: 320px width, Full height  
**Animation**: Slide từ trái (-320px → 0px)  
**Background**: White (#FFFFFF)  
**Shadow**: elevation 10, shadowOpacity 0.25

**Header** (paddingTop: 60px):
```
┌────────────────────────────────────┐
│  ┌────┐                        ┌─┐ │
│  │ 🗺️ │  Color Bites          │✕│ │
│  └────┘                        └─┘ │
│  48x48                        36x36 │
│  Orange bg                Close btn │
└────────────────────────────────────┘
```

**Menu Items**:

Each item (height: ~80px):
```
┌────────────────────────────────────┐
│  ┌────┐                            │
│  │ 📌 │  Địa điểm đã lưu        → │
│  └────┘  Xem các địa điểm...       │
│  48x48   (subtitle text)           │
│  Colored                            │
└────────────────────────────────────┘
```

**Icon colors**:
- Saved Places (📌): #F59E0B (Amber)
- My Places (🍴): #EF4444 (Red)
- History (⏱️): #3B82F6 (Blue)

**Icon backgrounds**:
- Semi-transparent của màu icon (opacity 15%)

### 4. Map Controls (bên phải)

**My Location Button**:
- Position: bottom 200px, right 16px
- Size: 48x48
- Border-radius: 24px (circle)
- Background: White
- Icon: Ionicons "locate", size 24, color #5F6368
- Shadow: elevation 5

**Layers Button**:
- Position: bottom 140px, right 16px
- Size: 48x48
- Style: Giống My Location button
- Icon: Ionicons "layers"

**Route Planning Button**:
- Position: bottom 260px, right 16px
- Size: 48x48
- Background: #3B82F6 (blue) hoặc #FEE2E2 (red khi active)
- Icon: "map" hoặc "close"

## 🎨 Color Palette

**Primary Colors**:
- Primary Orange: `#F97316`
- Primary Blue: `#3B82F6`

**Background Colors**:
- White: `#FFFFFF`
- Light Orange: `#FFF7ED`
- Light Gray: `#F3F4F6`
- Light Red: `#FEE2E2`

**Text Colors**:
- Dark: `#111827`
- Medium: `#374151`
- Gray: `#6B7280`, `#5F6368`
- Light Gray: `#9CA3AF`

**Accent Colors**:
- Amber: `#F59E0B`
- Red: `#EF4444`, `#DC2626`
- Blue: `#3B82F6`
- Green: `#10B981`

## 📐 Spacing System

**Base unit**: 8px

- Extra small: 4px
- Small: 8px
- Medium: 12px
- Large: 16px
- Extra large: 20px
- XXL: 24px

**Component spacing**:
- Search bar top: 48px (6 units)
- Filter buttons top: 112px (14 units)
- Screen padding: 16px (2 units)
- Search bar height: 56px (7 units)

## 🔤 Typography

**Search bar**:
- Placeholder: 16px, color #9CA3AF
- Input text: 16px, color #111827

**Menu**:
- Title: 20px, bold (700), color #111827
- Item title: 16px, semibold (600), color #111827
- Item subtitle: 13px, regular (400), color #6B7280
- Footer: 12px, regular, color #9CA3AF

**Filter buttons**:
- Text: 14px, medium (500)
- Selected: White
- Unselected: #374151

## 📱 Responsive Behavior

**Small screens** (< 360px):
- Search bar padding giảm xuống 12px
- Avatar size giảm xuống 28px
- Filter button padding giảm xuống 12px

**Large screens** (> 600px):
- Search bar max-width: 600px, center aligned
- Side menu width có thể tăng lên 360px

---

**Created**: 10/10/2025  
**Design reference**: Google Maps mobile app  
**Platform**: React Native (Expo)

