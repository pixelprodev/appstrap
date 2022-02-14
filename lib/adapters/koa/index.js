const koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-better-body')

class KoaAdapter extends koa {
  constructor (props) {
    super(props)
    this.use(bodyParser())
    this.router = new Router()
    this.use(this.router.routes())
  }
}

exports = module.exports = KoaAdapter
