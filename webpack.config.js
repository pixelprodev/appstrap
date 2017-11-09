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
      {
        test: /(\.js[x]?$)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["es2015", "es2017", "react"],
            plugins: ["transform-object-rest-spread", "glamorous-displayname"]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new WebpackBuildNotifierPlugin({
      title: 'Appstrap-Interface',
      suppressSuccess: false
    })
  ]
}
