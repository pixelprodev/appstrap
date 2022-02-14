const express = require('express')
const { Config, Interactor } = require('../../core')

class ExpressAdapter extends express {
  constructor (options, plugins) {
    super()
    this.use(express.json())
    const config = new Config(options)
    this.interactor = new Interactor(config)
    this.use(buildRoutes(config))
  }
}

function buildRoutes (config) {
  const router = express.Router()

  return (req, res, next) => router(req, res, next)
}

async function executeRoute (req, res, next) {

}

exports = module.exports = ExpressAdapter
