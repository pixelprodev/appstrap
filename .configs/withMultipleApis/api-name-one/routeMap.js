
module.exports = (handlers) => [
  { path: '/variants', ...handlers.variants.root },
  { path: '/variants/noParameter', ...handlers.variants.noParameter },
  { path: '/variants/hasParameter/:paramId', ...handlers.variants.hasParameter }
]