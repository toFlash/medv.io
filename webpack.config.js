var webpack = require('webpack');

module.exports = {
  entry: './app/js/index.js',
  output: {
    path: './build',
    filename: 'app.js'
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
  devtool: 'inline-source-maps',
  stats: {
    colors: true
  }
};
