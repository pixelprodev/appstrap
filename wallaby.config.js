module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'interface/src/**/*.js'},
      {pattern: 'interface/src/**/*.spec.js', ignore: true},
      {pattern: 'lib/*.js'}
    ],

    tests: [
      {pattern: 'interface/src/**/*.spec.js'},
      {pattern: 'lib/**/*.spec.js'}
    ],

    testFramework: 'jest',

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      'interface/src/**/*.js': wallaby.compilers.babel()
    }
  }
}
