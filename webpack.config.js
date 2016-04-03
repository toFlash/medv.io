var webpack = require('webpack');

module.exports = {
  entry: {
    'app': './app/js/index.js',
    'ultra-tiny-compiler': './app/js/example/ultra-tiny-compiler/index.js'
  },
  output: {
    path: './build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.monk$/,
        loader: 'monkberry-loader',
        query: {
          globals: ['window']
        }
      }
    ]
  },
  devtool: 'source-maps',
  stats: {
    colors: true
  }
};
