'use strict';

var webpack = require('webpack');

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin()
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = {
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }]
  },
  output: {
    library: 'icedam',
    libraryTarget: 'umd'
  },
  plugins: plugins,
  resolve: {
    extensions: ['', '.js']
  }
};
