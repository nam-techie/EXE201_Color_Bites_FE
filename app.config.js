// app.config.js
export default ({ config }) => ({
  ...config, // Giữ lại toàn bộ cấu hình gốc (name, slug, version...)
  
  expo: {
    ...config.expo, // Quan trọng: Giữ lại các cấu hình hiện có trong mục "expo" của bạn
    
    // Cấu hình các plugin
    plugins: [
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN,
          RNMapboxMapsImpl: 'mapbox',
        },
      ],
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission: 'We need your location to show it on the map!',
        },
      ],
    ],

    // Cấu hình Android
    android: {
      package: 'com.phuongnam.mumii',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      permissions: [
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
      ],
    },

    // Quan trọng: Thêm khối "extra" này từ app.json vào đây
    extra: {
      ...(config.expo?.extra || {}), // Giữ lại các cấu hình "extra" khác nếu có
      eas: {
        projectId: 'c04a32e5-bba5-4b4a-bb95-ca0c163cff97',
      },
    },
  },
});
