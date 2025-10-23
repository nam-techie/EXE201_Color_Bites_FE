// app.config.js

export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,

    userInterfaceStyle: 'automatic',

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
          image: './assets/images/icon.png',
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

    // ĐÂY LÀ PHẦN ĐÃ ĐƯỢC SỬA LỖI
    extra: {
      ...(config.expo.extra || {}), // Thêm '|| {}' để đảm bảo an toàn
      eas: {
        projectId: 'c04a32e5-bba5-4b4a-bb95-ca0c163cff97',
      },
    },
  },
});