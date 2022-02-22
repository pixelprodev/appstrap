function GET (context) {
  console.log(context.params)
  context.body = 'created from hasParameter route call'
}

module.exports = { GET }