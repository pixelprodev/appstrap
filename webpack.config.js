const path = require('path')
const webpack = require('webpack')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')

module.exports = {
  entry: ['babel-polyfill', './interface/src/Frame.jsx'],
  output: {
    path: path.resolve(__dirname, 'interface/dist'),
    filename: 'interface.js'
  },
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  module: {
    loaders: [
      { test: /(\.js[x]?$)/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new WebpackBuildNotifierPlugin({
      title: 'Ply',
      suppressSuccess: false
    })
  ]
}
