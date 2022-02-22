function GET (context) {
  context.statusCode = 201
  context.body = 'created from noParameter route call'
}

module.exports = { GET }
