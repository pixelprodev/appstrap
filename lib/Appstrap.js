const express = require('express')
const bodyParser = require('body-parser')
const Config = require('./Config')
const intercept = require('./intercept')
const Interactor = require('./Interactor')
const chokidar = require('chokidar')

class Appstrap extends express {
  constructor (opts = {}) {
    super()
    this.use(bodyParser.json())

    // disable cached responses
    this.set('etag', false)
    this.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next() })

    this.config = new Config(opts)
    this.interactor = new Interactor(this.config)
    this.use(this.interactor.router)
    this.use((req, res, next) => intercept({ req, res, next }, this.config))
    this.config.load()

    if (opts.watch) {
      this.fileWatcher = chokidar.watch(opts.repository, { ignoreInitial: true })
      this.fileWatcher.on('all', this.config.update)
    }
  }
}

module.exports = Appstrap
