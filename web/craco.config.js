const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const webpack = require('webpack');

const packages = [];
packages.push(path.join(__dirname, "../packages/pools-ts"));
packages.push(path.join(__dirname, "../packages/note-wallet"));

module.exports = {
  webpack: {
    configure: (webpackConfig) => {

      webpackConfig.resolve = Object.assign(webpackConfig.resolve, {
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
          path: require.resolve('path-browserify'),
          os: require.resolve('os-browserify/browser'),
          zlib: require.resolve('browserify-zlib'),
          assert: require.resolve('assert/'),
        },
      })

      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      const { isFound, match } = getLoader(webpackConfig, loaderByName("babel-loader"));
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];

        match.loader.include = include.concat(packages);
      }

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ]

      webpackConfig.optimization = Object.assign(
        webpackConfig.optimization,
        process.env.NODE_ENV === 'production'
          ? {
            splitChunks: {
              maxSize: 5 * 1024 * 1024,
              chunks: 'all',
            },
          }
          : {}
      )

      webpackConfig.ignoreWarnings = [/Failed to parse source map/]

      return webpackConfig;
    },
  },
};
