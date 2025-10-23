export default {
  expo: {
    name: 'mumi',
    slug: 'mumi',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'mumii',
    userInterfaceStyle: 'automatic',
    owner: 'pwnam',

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

    web: {
      favicon: './assets/images/icon.png',
    },

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

    extra: {
      // Định nghĩa projectId trực tiếp ở đây
      eas: {
        projectId: 'c04a32e5-bba5-4b4a-bb95-ca0c163cff97',
      },
    },
  },
};