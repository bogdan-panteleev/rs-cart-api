const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/main.ts',
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [/test/, /\.spec\.ts$/, /\.e2e-spec\.ts$/],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.json', '.js'],
  },
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/platform-express',
          'cache-manager',
          'class-validator',
          'class-transformer',
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
          'pg-native',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource);
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    library: {
      name: 'handler',
      type: 'umd',
    },
  },
  externals: [],
  optimization: {
    minimize: false,
  },
};
