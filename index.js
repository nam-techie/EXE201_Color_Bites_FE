// index.js (ROOT)

// 1) Gesture Handler & Reanimated phải đứng TRÊN HẾT
import 'react-native-gesture-handler';
import 'react-native-reanimated';

// 2) (HOTFIX) nếu plugin chưa kịp tiêm config, tự tạo biến để không crash
//   Reanimated sẽ đọc config này khi khởi động.
global.__reanimatedLoggerConfig ??= {
  // tắt logger để tránh noise ở prod; bạn có thể bật theo nhu cầu
  // enableLogger: false,  // các field Reanimated sẽ tự nhận, không cần đầy đủ
};

// 3) Gọi router entry SAU khi 2 side-effects trên đã chạy
import 'expo-router/entry';
