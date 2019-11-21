const express = require('express')

exports = module.exports = function strap (opts) {
  return new App(opts)
}

class App extends express {
  constructor (opts) {
    super(opts)
    this.opts = opts
  }
}
