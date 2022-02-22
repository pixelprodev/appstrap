const koa = require('koa')
const bodyParser = require('koa-better-body')
const Interceptor = require('../../core/Interceptor')

class KoaAdapter extends koa {
  constructor (options) {
    super()
    this.use(bodyParser())
    const { ingress, interactor } = new Interceptor(options)
    this.interactor = interactor
    this.use(ingress)
  }
}

exports = module.exports = KoaAdapter

const instance = new KoaAdapter({ configDir: '../../../.configs/withMultipleApis' })
instance.listen(4000)
