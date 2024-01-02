const { loadFile, defaultModifiers } = require('./_helpers')

class GqlOperation {
  constructor (filePath) {
    this.operationName = GqlOperation.getOperationNameFromFile(filePath)
    const metadata = loadFile(filePath)
    const metadataAndModifiers = { ...defaultModifiers, ...metadata }
    Object.entries(metadataAndModifiers).forEach(([name, value]) => this[name] = value)
  }

  static getOperationNameFromFile (filePath) {
    return filePath.replace(/.*gql\//, '').replace('.js', '')
  }
}

module.exports = GqlOperation
