module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',       // phải đứng đầu
      'nativewind/babel',
      'react-native-reanimated/plugin', // phải đứng cuối
    ],
  };
};