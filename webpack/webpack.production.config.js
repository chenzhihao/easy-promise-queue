var webpack = require('webpack');
var config = require('./webpack.base.config.js');
var path = require('path');

config.entry = {
  'PromiseQueue': [
    path.resolve(__dirname, '../src/PromiseQueue.js')
  ]
};

config.output = Object.assign({}, config.output, {
  library: '[name]',
  libraryTarget: 'umd'
});

// better to open source map
config.devtool = 'source-map';

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
]);

delete config.output.publicPath;

module.exports = config;
