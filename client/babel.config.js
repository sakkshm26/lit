module.exports = api => {
  const babelEnv = api.env();
  const plugins = [];
  //change to 'production' to check if this is working in 'development' mode
  if (babelEnv !== 'development') {
    plugins.push(['transform-remove-console', {exclude: ['error', 'warn']}]);
  }
  plugins.push(['react-native-paper/babel']);
  plugins.push(['react-native-reanimated/plugin']);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  };
};
