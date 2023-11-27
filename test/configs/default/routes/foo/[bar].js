module.exports.GET = ({ req }) => {
  console.log(req.path)
  return {
    parameter: req.params.bar
  }
}
