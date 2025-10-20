# Goong Integration (WebView + REST)

## Thứ tự tạo key
- 1) Tạo Map Key (Maptiles/Map) để nạp Web SDK và style Goong.
- 2) Tạo API Key (REST) để gọi Autocomplete / Place Detail / Directions.

## Cấu hình môi trường (app.config.ts > expo.extra)
- EXPO_PUBLIC_GOONG_API_URL: https://rsapi.goong.io/
- EXPO_PUBLIC_GOONG_API_KEY: <API KEY REST>
- EXPO_PUBLIC_GOONG_MAP_KEY: <MAP KEY WEB>
- EXPO_PUBLIC_GOONG_MAP_STYLE_URL: https://tiles.goong.io/assets/goong_map_web.json
- EXPO_PUBLIC_USE_GOONG_WEBVIEW: true

## Cài đặt
- npx expo install react-native-webview

## Sử dụng
- Màn hình `app/(tabs)/map.tsx` render `MapGoongWebView`.
- Autocomplete: nhập text trong SearchBar → chọn gợi ý → app gọi Place Detail và flyTo.
- Directions: gọi `MapProvider.getDirections(...)` (đã route sang Goong khi có key).

## Lưu ý
- WebView không hỗ trợ overlay RN chồng lên bản đồ như native map.
- Quyền vị trí đã cấu hình qua `expo-location`.
- Billing: theo dõi quota trong dashboard Goong.

## Tham chiếu
- https://help.goong.io/kb/app/android/tich-hop-mapbox-tren-nen-ban-do-goong-trong-adndroid/
