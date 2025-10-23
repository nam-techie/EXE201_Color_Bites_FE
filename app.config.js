// app.config.js
export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo, 
    plugins: [
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN,
          RNMapboxMapsImpl: 'mapbox',
        },
      ],
      // Các plugin khác của bạn
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
  },
});
