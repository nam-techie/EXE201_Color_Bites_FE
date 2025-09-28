# 🍎 MUMII - Frontend Application

![MUMII Logo](./assets/images/icon.png)

**MUMII** là một ứng dụng di động được phát triển bằng React Native và Expo, tập trung vào trải nghiệm người dùng với giao diện hiện đại và hỗ trợ đa nền tảng.

## 📱 Tổng quan dự án

- **Tên dự án**: MUMII (mumii)
- **Phiên bản**: 1.0.0
- **Framework**: Expo SDK 53 với React Native 0.79.5
- **Ngôn ngữ**: TypeScript
- **Kiến trúc**: File-based routing với Expo Router
- **Hỗ trợ nền tảng**: iOS, Android, Web

## 🏗️ Kiến trúc dự án

```
EXE201_MUMII_FE/
├── app/                          # Thư mục chính chứa các màn hình (File-based routing)
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx          # Layout cho tab navigation
│   │   ├── index.tsx            # Màn hình Home (Tab đầu tiên)
│   │   └── explore.tsx          # Màn hình Explore (Tab thứ hai)
│   ├── _layout.tsx              # Root layout của ứng dụng
│   └── +not-found.tsx           # Màn hình 404
├── assets/                       # Tài nguyên tĩnh
│   ├── fonts/                   # Font chữ tùy chỉnh
│   │   └── SpaceMono-Regular.ttf
│   └── images/                  # Hình ảnh và icons
│       ├── icon.png             # App icon
│       ├── adaptive-icon.png    # Android adaptive icon
│       ├── splash-icon.png      # Splash screen icon
│       ├── favicon.png          # Web favicon
│       └── react-logo*.png      # Demo images
├── components/                   # Components tái sử dụng
│   ├── ui/                      # UI components cơ bản
│   │   ├── IconSymbol.tsx       # Icon component
│   │   └── TabBarBackground.tsx # Tab bar background
│   ├── Collapsible.tsx          # Collapsible component
│   ├── ExternalLink.tsx         # External link component
│   ├── HelloWave.tsx            # Animated wave component
│   ├── HapticTab.tsx            # Haptic feedback tab
│   ├── ParallaxScrollView.tsx   # Parallax scroll view
│   ├── ThemedText.tsx           # Themed text component
│   └── ThemedView.tsx           # Themed view component
├── constants/                    # Hằng số và cấu hình
│   └── Colors.ts                # Color scheme definitions
├── hooks/                        # Custom React hooks
│   ├── useColorScheme.ts        # Color scheme hook
│   ├── useColorScheme.web.ts    # Web-specific color scheme
│   └── useThemeColor.ts         # Theme color hook
├── scripts/                      # Build scripts
│   └── reset-project.js         # Project reset script
├── app.json                     # Expo configuration
├── package.json                 # Dependencies và scripts
├── tsconfig.json               # TypeScript configuration
└── eslint.config.js            # ESLint configuration
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 hoặc **yarn**: >= 1.22.0
- **Expo CLI**: Cài đặt global `npm install -g @expo/cli`

### Các bước cài đặt

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd EXE201_MUMII_FE
   ```

2. **Cài đặt dependencies**

   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Setup Environment Variables**

   Tạo file `.env` trong thư mục gốc:
   ```bash
   touch .env
   ```

   Thêm các biến môi trường cần thiết:
   ```bash
   # OpenRouteService API Key (bắt buộc cho tính năng map)
   EXPO_PUBLIC_OPENROUTE_API_KEY=your_api_key_here
   
   # Backend API URL (optional)
   EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

   📋 **Hướng dẫn chi tiết**: Xem file [ENV_SETUP.md](./ENV_SETUP.md)

4. **Khởi chạy development server**
   ```bash
   npm start
   # hoặc
   npx expo start
   ```

### Chạy trên các nền tảng cụ thể

```bash
# Android
npm run android
# hoặc
npx expo start --android

# iOS
npm run ios
# hoặc
npx expo start --ios

# Web
npm run web
# hoặc
npx expo start --web
```

## 📋 Scripts có sẵn

| Script                  | Mô tả                                      |
| ----------------------- | ------------------------------------------ |
| `npm start`             | Khởi chạy Expo development server          |
| `npm run android`       | Chạy ứng dụng trên Android emulator/device |
| `npm run ios`           | Chạy ứng dụng trên iOS simulator/device    |
| `npm run web`           | Chạy ứng dụng trên web browser             |
| `npm run lint`          | Chạy ESLint để kiểm tra code quality       |
| `npm run reset-project` | Reset dự án về trạng thái ban đầu          |

## 🛠️ Công nghệ sử dụng

### Core Technologies

- **React**: 19.0.0 - Library UI chính
- **React Native**: 0.79.5 - Framework mobile
- **Expo**: ~53.0.20 - Development platform
- **TypeScript**: ~5.8.3 - Type safety

### Navigation & Routing

- **Expo Router**: ~5.1.4 - File-based routing
- **React Navigation**: ^7.1.6 - Navigation library

### UI & Animation

- **React Native Reanimated**: ~3.17.4 - Animations
- **React Native Gesture Handler**: ~2.24.0 - Gesture handling
- **Expo Vector Icons**: ^14.1.0 - Icon library

### Development Tools

- **ESLint**: ^9.25.0 - Code linting
- **Babel**: ^7.25.2 - JavaScript compiler

## 🎨 Tính năng chính

### 1. **Tab Navigation**

- 2 tab chính: Home và Explore
- Haptic feedback khi chuyển tab
- Custom tab bar background với blur effect (iOS)

### 2. **Theme System**

- Hỗ trợ Dark/Light mode tự động
- Themed components (ThemedText, ThemedView)
- Color scheme detection

### 3. **Responsive Design**

- Hỗ trợ đa nền tảng: iOS, Android, Web
- Adaptive icons cho Android
- Edge-to-edge design

### 4. **Animations**

- Parallax scroll view
- Animated wave component
- Smooth transitions

### 5. **Typography**

- Custom font: SpaceMono
- Responsive text sizing
- Themed text components

## 🔧 Cấu hình

### Expo Configuration (app.json)

```json
{
   "expo": {
      "name": "mumii",
      "slug": "mumii",
      "version": "1.0.0",
      "orientation": "portrait",
      "scheme": "mumii",
      "newArchEnabled": true
   }
}
```

### TypeScript Configuration

- Strict mode enabled
- Path mapping: `@/*` → `./*`
- Expo TypeScript base configuration

## 📱 Cấu trúc màn hình

### Home Screen (`app/(tabs)/index.tsx`)

- Parallax scroll view với React logo
- Welcome message với animated wave
- Step-by-step development guide

### Explore Screen (`app/(tabs)/explore.tsx`)

- Collapsible sections với thông tin về:
   - File-based routing
   - Multi-platform support
   - Images handling
   - Custom fonts
   - Theme system
   - Animations

## 🎯 Development Workflow

### 1. **Khởi tạo dự án mới**

```bash
npm run reset-project
```

Lệnh này sẽ di chuyển code mẫu hiện tại vào thư mục `app-example` và tạo thư mục `app` trống để bắt đầu phát triển.

### 2. **Code Quality**

```bash
npm run lint
```

Chạy ESLint để kiểm tra và đảm bảo code quality.

### 3. **Development Build**

- Sử dụng Expo development build để test trên thiết bị thật
- Hỗ trợ hot reload và fast refresh

## 🌐 Deployment

### Web Deployment

```bash
npm run web
```

Ứng dụng sẽ được build thành static files sẵn sàng deploy.

### Mobile App Build

```bash
# Build cho production
npx expo build:android
npx expo build:ios
```

## 🔍 Troubleshooting

### Các vấn đề thường gặp:

1. **Metro bundler cache issues**

   ```bash
   npx expo start --clear
   ```

2. **Node modules issues**

   ```bash
   rm -rf node_modules
   npm install
   ```

3. **iOS simulator không khởi động**
   ```bash
   npx expo start --ios --simulator
   ```

4. **Environment variables không hoạt động**
   - Kiểm tra file `.env` có tồn tại không
   - Restart development server: `npx expo start --clear`
   - Xem hướng dẫn chi tiết trong [ENV_SETUP.md](./ENV_SETUP.md)

## 📚 Tài liệu tham khảo

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Navigation Documentation](https://reactnavigation.org/)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này là private và thuộc về team phát triển EXE201_MUMII.

## 👥 Team

**EXE201 - MUMII Development Team**

---

**Happy Coding! 🚀**

_Để biết thêm thông tin chi tiết, vui lòng liên hệ team phát triển._