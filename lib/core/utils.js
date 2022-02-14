const path = require('path')
const glob = require('glob')
const inflate = require('flat').unflatten

function buildDirTreeWithData (directory, filePattern = '**/*.js') {
  const fileList = glob.sync(`${directory}${path.sep}${filePattern}`, { nodir: true })
  const files = fileList.reduce((obj, file) => {
    const convertedPath = file
      .replace(`${directory}${path.sep}`, '') // remove parent dir
      .replace(/-([a-z])/g, (g) => g[1].toUpperCase()) // dashes to camel case
      .replace('.js', '') // strip file ext
    obj[convertedPath] = require(file)
    return obj
  }, {})
  return inflate(files, { delimiter: path.sep })
}

exports = module.exports = {
  buildDirTreeWithData
}

console.log(buildDirTreeWithData(path.resolve('.appstrap'), '**/routes.js'))
