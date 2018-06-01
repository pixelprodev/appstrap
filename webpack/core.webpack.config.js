const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  context: __dirname,
  entry: {
    cli: '../src/cli.js',
    Appstrap: '../src/Appstrap.js'
  },
  devtool: 'source-map',
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  externals: [
    nodeExternals(),
    {
      'webpack-dynamic-require': '../webpack-dynamic-require.js'
    }
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [ '.js' ]
  },
  module: {
    rules: [
      {
        test: /(\.js$)/,
        use: [
          {
            loader: 'shebang-loader'
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [['env', {targets: {node: 6}}]],
              plugins: ['transform-object-rest-spread', 'transform-class-properties']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true}),
    new webpack.DefinePlugin({__TEST__: false})
  ]
}
