module.exports = {
  handlers: [
    {
      operationName: 'DetermineVariant',
      mode: 'merge',
      handler: (req, payload) => {
        return payload
      }
    }
  ]
}
