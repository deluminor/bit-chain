module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // expo-router/babel removed: merged into babel-preset-expo since SDK 50
  };
};
