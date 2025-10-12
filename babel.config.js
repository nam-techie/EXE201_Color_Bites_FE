module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }], 
      'nativewind/babel'
    ],
    plugins: [
      'expo-router/babel',           // Cần cho expo-router
      'react-native-worklets/plugin', // Bắt buộc cho reanimated v3+
      'react-native-reanimated/plugin' // Để cuối cùng
    ]
  }
}