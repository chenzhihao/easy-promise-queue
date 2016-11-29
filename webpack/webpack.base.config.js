var path = require('path');
var webpack = require('webpack');
var config = {
  entry: {
    'index': [
      path.resolve(__dirname, '../src/index.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js?[chunkhash]'
  },
  externals: [],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        cacheDirectory: '',
        exclude: /(node_modules|dist)/,
        loaders: ['babel']
      }
    ]
  },
  plugins: [new webpack.DefinePlugin({
    'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })],
};

module.exports = config;
