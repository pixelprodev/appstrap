
module.exports = (handlers) => [
  { path: '/claims', ...handlers.claims.root }
]