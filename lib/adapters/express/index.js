const express = require('express')
const Interceptor = require('../../core/Interceptor')

class ExpressAdapter extends express {
  constructor (options) {
    super()
    this.use(express.json())
    const { ingress, interactor } = new Interceptor(options)
    this.interactor = interactor
    this.all('*', async (req, res, next) => {
      try {
        const response = await ingress({ ...req }, next)
        response
          ? res.status(response.statusCode || 200).send(response.body)
          : res.status(404).send()
      } catch (e) {
        res.status(500).send(e.message)
      }
    })
  }
}

exports = module.exports = ExpressAdapter
