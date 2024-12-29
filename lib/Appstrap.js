const express = require('express')
const bodyParser = require('body-parser')
const Config = require('./Config')
const Interactor = require('./Interactor')
const chokidar = require('chokidar')
const Interceptor = require('./Interceptor')

class Appstrap extends express {
  constructor ({ watch = false, ...opts } = {}) {
    super()
    this.use(bodyParser.json({ limit: '10mb' }))

    // disable cached responses
    this.set('etag', false)
    this.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next() })

    this.config = new Config(opts)
    this.interactor = new Interactor(this.config)
    this.interceptor = new Interceptor(this.config)
    this.use(this.interactor.router)
    this.use((req, res, next) => this.interceptor.intercept({ req, res, next }))

    if (watch) {
      this.fileWatcher = chokidar.watch(opts.repository, { ignoreInitial: true })
      this.fileWatcher.on('all', (eventType, filePath) => {
        if (filePath.includes('_')) { // handle dependency files a lil different.
          this.config = new Config(opts)
        } else {
          this.config.dispatch({
            type: `FILE_${eventType.toUpperCase()}`,
            filePath,
            routePrefix: this.config.routePrefix
          })
        }
      })
    }
  }
}

module.exports = Appstrap
