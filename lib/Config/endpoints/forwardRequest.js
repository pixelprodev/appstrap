const axios = require('axios')

async function forwardRequest (context, destination, applyFixtures) {
  const options = {
    responseType: 'stream',
    method: context.req.method.toLowerCase(),
    url: destination,
    headers: context.req.headers,
    useCredentials: true
  }
  if (context.req.body) {
    options.data = context.req.body
  }
  try {
    const { status, headers, data } = await axios(options)
    let chunks = ''

    data.on('data', (chunk) => (chunks += chunk))
    data.on('end', () => {
      context.res.status(status)
      context.res.set(headers)
      const data = JSON.parse(chunks.toString())
      const updatedData = applyFixtures(context.req, data)
      context.res.write(JSON.stringify(updatedData))
      context.res.end()
    })
  } catch (e) {
    console.error(e)
    return {}
  }
}

module.exports = exports = { forwardRequest }
