module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'src/**/*.js'},
      {pattern: '_test/**/*.js'},
      {pattern: 'src/**/*.spec.js', ignore: true}
    ],
    tests: [
      {pattern: 'src/**/*.spec.js'}
    ],
    testFramework: 'jest',
    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      'src/**/*.js': wallaby.compilers.babel()
    }
  }
}
