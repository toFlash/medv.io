const webpack = require('webpack')
const {join} = require('path')

module.exports = {
  entry: {
    'index': './app/scripts/index.js',
  },
  output: {
    path: join(__dirname, '.tmp/scripts'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-maps',
  stats: {
    colors: true
  }
}
