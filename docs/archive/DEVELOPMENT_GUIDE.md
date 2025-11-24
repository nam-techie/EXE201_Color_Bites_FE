# 🚀 Hướng dẫn chạy dự án MUMII

## 📱 Phương pháp 1: Sử dụng Expo Go (Khuyến nghị cho beginners)

### Bước 1: Cài đặt Expo Go trên điện thoại

- **Android**: [Google Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### Bước 2: Chạy development server

```bash
# Mở terminal trong thư mục dự án và chạy:
npx expo start

# Hoặc:
npm start
```

### Bước 3: Kết nối điện thoại

1. **Đảm bảo điện thoại và máy tính cùng WiFi**
2. **Android**: Mở Expo Go → Tap "Scan QR Code" → Quét QR code trong terminal
3. **iOS**: Mở Camera → Quét QR code → Tap notification để mở trong Expo Go

### Bước 4: Phát triển

- Thay đổi code trong VS Code/Cursor
- App sẽ tự động reload trên điện thoại (Fast Refresh)
- Shake điện thoại để mở Developer Menu

---

## 💻 Phương pháp 2: Preview trong VS Code/Cursor

### Bước 1: Cài đặt Extensions (đã setup sẵn)

VS Code/Cursor sẽ tự động suggest các extensions cần thiết:

**Core Extensions:**

- `React Native Tools` - Debug và preview
- `Expo Tools` - Expo integration
- `ES7+ React/Redux/React-Native snippets` - Code snippets
- `Prettier` - Code formatting
- `ESLint` - Code linting

### Bước 2: Chạy Web Preview

```bash
# Chạy trên web browser (preview nhanh)
npx expo start --web

# Hoặc:
npm run web
```

### Bước 3: Sử dụng React Native Tools

1. **Ctrl+Shift+P** → "React Native: Start Packager"
2. **Ctrl+Shift+P** → "React Native: Run Android" (nếu có Android emulator)
3. **Ctrl+Shift+P** → "React Native: Run iOS" (nếu có iOS simulator - chỉ macOS)

---

## 🔧 Setup Android Emulator (Optional)

### Cài đặt Android Studio:

1. Tải [Android Studio](https://developer.android.com/studio)
2. Cài đặt và setup AVD (Android Virtual Device)
3. Chạy emulator
4. Trong terminal: `npx expo start --android`

---

## 🍎 Setup iOS Simulator (chỉ macOS)

### Cài đặt Xcode:

1. Tải Xcode từ App Store
2. Cài đặt iOS Simulator
3. Trong terminal: `npx expo start --ios`

---

## ⚡ Quick Commands

| Command                    | Mô tả                        |
| -------------------------- | ---------------------------- |
| `npx expo start`           | Khởi chạy development server |
| `npx expo start --web`     | Chạy trên web browser        |
| `npx expo start --android` | Chạy trên Android emulator   |
| `npx expo start --ios`     | Chạy trên iOS simulator      |
| `npx expo start --clear`   | Clear cache và restart       |
| `npm run lint`             | Kiểm tra code quality        |

---

## 🐛 Troubleshooting

### Vấn đề thường gặp:

**1. QR Code không quét được:**

- Đảm bảo cùng WiFi
- Thử restart Expo server: `Ctrl+C` → `npx expo start`

**2. "Network response timed out":**

- Kiểm tra firewall/antivirus
- Thử tunnel mode: `npx expo start --tunnel`

**3. "Module not found":**

```bash
rm -rf node_modules
npm install
npx expo start --clear
```

**4. Port đã được sử dụng:**

```bash
npx expo start --port 8082
```

---

## 📱 Developer Menu Commands

Khi app đang chạy trên điện thoại, shake để mở menu:

- **Reload**: Reload app
- **Debug**: Mở Chrome DevTools
- **Performance Monitor**: Xem performance
- **Inspector**: Inspect elements
- **Fast Refresh**: Toggle auto-reload

---

## 🎯 Tips cho Development

1. **Sử dụng Fast Refresh**: Code changes sẽ tự động reflect
2. **Console.log**: Xem logs trong terminal hoặc Expo Go
3. **Hot Keys trong terminal**:
   - `r` - Reload app
   - `m` - Toggle menu
   - `d` - Open developer tools
   - `w` - Open in web browser

---

**Happy Coding! 🚀**
