var config = require('./webpack.base.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

config.entry = [
    'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    path.resolve(__dirname, '../src/demo.js')
  ];

// https://github.com/webpack/webpack/issues/2393
// For in conjunction with webpack-dev-server --hot --inline:
config.output = {
    filename: '[name].js'
},

config.devtool = 'eval-source-map';
config.debug = true;

config.plugins = config.plugins.concat(
  new HtmlWebpackPlugin({
    title: 'Promise Queue',
    template: 'indexTemplate.html',
    filename: 'index.html',
    inject: true,
  })
);

module.exports = config;
