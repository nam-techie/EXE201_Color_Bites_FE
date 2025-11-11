# Pattern để Apply Responsive cho Files Còn Lại

## 1. Import Statement

### Thêm vào đầu file (sau 'use client' nếu có):
```typescript
import { scaleModerate, scaleFont, scaleHeight, scaleWidth } from '@/utils/responsive'
```

## 2. Replace Patterns trong Styles

### Font Sizes:
```typescript
// Before
fontSize: 16
fontSize: 14
fontSize: 12
fontSize: 18
fontSize: 20
fontSize: 24

// After
fontSize: scaleFont(16)
fontSize: scaleFont(14)
fontSize: scaleFont(12)
fontSize: scaleFont(18)
fontSize: scaleFont(20)
fontSize: scaleFont(24)
```

### Padding & Margin:
```typescript
// Before  
padding: 16
paddingHorizontal: 16
paddingVertical: 12
margin: 8
marginTop: 20
marginBottom: 16

// After
padding: scaleModerate(16)
paddingHorizontal: scaleModerate(16)
paddingVertical: scaleModerate(12)
margin: scaleModerate(8)
marginTop: scaleModerate(20)
marginBottom: scaleModerate(16)
```

### Width & Height (kích thước cố định):
```typescript
// Before
width: 48
height: 48
borderRadius: 24

// After
width: scaleModerate(48)
height: scaleModerate(48)
borderRadius: scaleModerate(24)
```

### Height (cho vertical spacing lớn):
```typescript
// Before
height: 320 // image height
bottom: 200  // position

// After
height: scaleHeight(320)
bottom: scaleHeight(200)
```

### Width (cho horizontal sizing lớn):
```typescript
// Before
width: 360 // max width
left: 100

// After
width: scaleWidth(360)
left: scaleWidth(100)
```

## 3. Dimensions.get('window') Replacement

### Before:
```typescript
import { Dimensions } from 'react-native'
const { width } = Dimensions.get('window')
```

### After:
```typescript
import { dimensions } from '@/utils/responsive'
const { screenWidth: width } = dimensions
```

## 4. Tab Bar Bottom Padding

Cho các màn hình có ScrollView, thêm paddingBottom để tránh floating tab bar:

```typescript
scrollContent: {
  paddingBottom: scaleHeight(120), // Compensate for floating tab bar
}
```

## 5. Files Cần Apply (Priority Order)

### Tab Screens (còn lại):
- [ ] app/(tabs)/explore.tsx
- [ ] app/(tabs)/create.tsx  
- [ ] app/(tabs)/profile.tsx (tiếp tục)

### Auth Screens (còn lại):
- [ ] app/auth/login.tsx
- [ ] app/auth/signup-form.tsx
- [ ] app/auth/forgot-password.tsx
- [ ] app/auth/verify-otp.tsx (special attention: OTP input boxes)
- [ ] app/auth/reset-password.tsx
- [ ] app/auth/new-password.tsx
- [ ] app/auth/privacy-policy.tsx
- [ ] app/auth/terms-of-service.tsx

### Common Components:
- [ ] components/common/FilterButtons.tsx
- [ ] components/common/Button.tsx
- [ ] components/common/Input.tsx
- [ ] components/common/LoadingSpinner.tsx
- [ ] components/common/CommentModal.tsx
- [ ] components/common/ImageGallery.tsx
- [ ] components/common/RestaurantDetailModal.tsx
- [ ] components/common/MapControls.tsx

### Map Components:
- [ ] components/map/CustomMapMarker.tsx
- [ ] components/map/LocationCard.tsx
- [ ] components/map/LocationListItem.tsx
- [ ] components/map/RouteAlternativesPanel.tsx
- [ ] components/map/RoutePlanningPanel.tsx
- [ ] components/map/RouteProfileSelector.tsx
- [ ] components/map/MarkerLegend.tsx

### Create Post Components:
- [ ] components/create-post/FormField.tsx
- [ ] components/create-post/HashtagSelector.tsx
- [ ] components/create-post/ImageUploader.tsx
- [ ] components/create-post/MoodSelector.tsx
- [ ] components/create-post/PrivacyToggle.tsx

## 6. Quick Regex Patterns (VSCode Find & Replace)

### Find all hardcoded font sizes:
```
fontSize:\s*(\d+)
```
Replace with:
```
fontSize: scaleFont($1)
```

### Find all padding/margin:
```
(padding|margin)(Horizontal|Vertical|Top|Bottom|Left|Right)?:\s*(\d+)
```
Replace with:
```
$1$2: scaleModerate($3)
```

### Find width/height in positions:
```
(width|height):\s*(\d+)
```
Replace with:
```
$1: scaleModerate($2)
```

### Find bottom/top positions:
```
(bottom|top):\s*(\d+)
```
Replace with:
```
$1: scaleHeight($2)
```

## 7. Testing Checklist

After applying responsive:

1. Test app startup - không crash
2. Navigate to each screen - layout không vỡ
3. Check floating tab bar - không che content
4. Test rotation (if applicable)
5. Check text readability
6. Verify touch targets (buttons, inputs)

## 8. Common Issues & Fixes

### Issue: Text quá nhỏ trên màn hình nhỏ
**Fix:** Adjust scale factor trong scaleFont():
```typescript
fontSize: scaleFont(16, 0.3) // Less scaling
```

### Issue: Padding quá lớn/nhỏ
**Fix:** Adjust scaleModerate factor hoặc dùng fixed value:
```typescript
padding: scaleModerate(16, 0.3) // Less scaling
// OR
padding: 12 // Fixed, no scaling
```

### Issue: Tab bar che buttons
**Fix:** Increase bottom position:
```typescript
bottom: scaleHeight(180) // Tăng thêm 60-80
```

---

**Files Đã Completed:**
✅ utils/responsive.ts  
✅ hooks/useResponsive.ts  
✅ hooks/index.ts  
✅ styles/theme.ts  
✅ app/(tabs)/_layout.tsx  
✅ app/(tabs)/map.tsx  
✅ app/(tabs)/index.tsx (Home)  
✅ components/common/SearchBar.tsx  
✅ components/map/MapSideMenu.tsx  
✅ app/auth/welcome.tsx

