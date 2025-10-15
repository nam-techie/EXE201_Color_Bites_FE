module.exports = function (api) {
  api.cache(true);
  return {
    presets: [require.resolve('babel-preset-expo')],
    plugins: [
      'expo-router/babel',
      'nativewind/babel',
      'react-native-worklets/plugin',
    ],
  };
};