module.exports = {
  entry: ['babel-polyfill', './src/management-interface/src/Frame.js'],
  output: {
    filename: 'management-interface.js'
  },
  resolve: {
    extensions: [ '.js' ]
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
            plugins: ['transform-object-rest-spread']
          }
        }
      }
    ]
  }
}
