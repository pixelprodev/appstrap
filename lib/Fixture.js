const { loadFile } = require('./_helpers')
const joi = require('joi')

class Fixture {
  constructor (filePath) {
    this.name = Fixture.getNameFromPath(filePath)
    const metadata = loadFile(filePath, this.validate)
    Object.entries(metadata).forEach(([name, value]) => this[name] = value)
  }

  static getNameFromPath (filePath) {
    return filePath.replace(/.*fixtures\//, '').replace('.js', '')
  }

  validate (filePath, fileData) {
    const fixtureSchema = joi.object({
      handlers: joi.array()
        .items(joi.object({
          operationName: joi.string(),
          mode: joi.string().valid('merge', 'mergeDeep', 'replace').required(),
          path: joi.string(),
          method: joi.string().uppercase(),
          handler: joi.function(),
          payload: joi.object()
        }).or('payload', 'handler'))
    })
    const validationResult = fixtureSchema.validate(fileData)
    if (validationResult.error) {
      throw new Error(validationResult.error.message)
    }
    return true
  }
}

module.exports = Fixture
