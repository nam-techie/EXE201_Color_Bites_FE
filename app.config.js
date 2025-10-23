// app.config.js

export default ({ config }) => ({
  // Giữ lại các cấu hình gốc như name, slug, version, owner...
  ...config,

  // Tất cả cấu hình dành riêng cho Expo phải nằm trong đối tượng "expo" này
  expo: {
    // Giữ lại các cấu hình hiện có trong "expo" của bạn
    ...config.expo,

    // SỬA Ở ĐÂY: Đảm bảo mảng "plugins" nằm bên trong "expo"
    plugins: [
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN,
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

    // Đảm bảo "extra" và "projectId" cũng nằm trong "expo"
    extra: {
      ...config.expo.extra,
      eas: {
        projectId: 'c04a32e5-bba5-4b4a-bb95-ca0c163cff97',
      },
    },
  },
});