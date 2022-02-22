async function GET (context) {
  context.body = 'ok from root'
}

async function POST (context) {

}

module.exports = { GET, POST }
