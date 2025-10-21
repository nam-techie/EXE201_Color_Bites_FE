module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // Quan trọng: Plugin này phải luôn ở cuối cùng
    ],
  };
};