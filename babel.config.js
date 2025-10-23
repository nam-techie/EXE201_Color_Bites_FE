module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'expo-router/babel',
      'react-native-worklets-core/plugin',    // Thêm worklets plugin
      'react-native-reanimated/plugin',        // Phải để cuối cùng
    ],
  };
};
