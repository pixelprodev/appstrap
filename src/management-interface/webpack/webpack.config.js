const path = require('path')

const baseDir = path.resolve(__dirname, '..')

module.exports = {
  context: path.join(baseDir, 'src'),
  entry: ['babel-polyfill', './Initializer.jsx'],
  output: {
    path: path.join(baseDir, 'dist'),
    filename: 'management-interface.js'
  },
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  module: {
    rules: [
      {
        test: /(\.js[x]?$)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: ['last 2 versions', 'safari >= 8']
                }
              }],
              'react'],
            plugins: [
              'transform-object-rest-spread',
              'transform-decorators-legacy',
              'emotion'
            ]
          }
        }
      }
    ]
  }
}
