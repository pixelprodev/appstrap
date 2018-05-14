import readline from 'readline'
import path from 'path'
import fs from 'fs-extra'

const prompts = {
  isSinglePageApp: `\rAre you strapping a single page app? [y/n]:  `,
  bundlePath: `  Please provide the path to your bundle file [relative to current dir]:  `,
  bundleHost: `  Please specify the html container your bundle expects [i.e. #container or .host]:  `
}

class ConfigGenerator {
  static async generate () {
    const {stdin, stdout} = process
    console.log('=================================================')
    console.log('         Appstrap config file generator          ')
    this.rl = readline.createInterface({ input: stdin, output: stdout })

    const spaPromptAnswer = await this.promptUser(prompts.isSinglePageApp)
    const isSinglePageApp = spaPromptAnswer.toLowerCase() === 'y'
    let bundle = {}

    if (isSinglePageApp) {
      bundle.path = await this.promptUser(prompts.bundlePath)
      bundle.host = await this.promptUser(prompts.bundleHost)
    }

    const configContents = this.generateConfigContents(bundle)
    await this.writeConfigFile(configContents)
    this.showGenerationSummary()

    this.rl.close()
  }

  static promptUser (question) {
    return new Promise(resolve => {
      this.rl.question(question, answer => resolve(answer))
    })
  }

  static generateConfigContents (bundle = {}) {
    const isSinglePageApp = Object.keys(bundle).length > 0
    if (isSinglePageApp) {
      const splitFileName = bundle.path.split(path.sep)
      bundle.fileName = splitFileName.pop()
      bundle.directory = splitFileName.join(path.sep)
    }
    let bundleMarkup = isSinglePageApp
      ? (`\n  bundle: {path: '${bundle.path}', host: '${bundle.host}'},`)
      : ''

    let assetsMarkup = isSinglePageApp
      ? (`\n  assets: [{ webPath: '/${bundle.fileName}', fsDir: '${bundle.directory}' }]`)
      : '\n  assets: []'
    let endpointsMarkup = `\n  endpoints: []\n`
    return (`module.exports = {${bundleMarkup}${assetsMarkup}, ${endpointsMarkup}}`)
  }

  static async writeConfigFile (configContents) {
    const filePath = path.resolve(process.cwd(), './.appstrap/config.js')
    await fs.ensureFile(filePath)
    await fs.ensureDir(path.resolve(process.cwd(), './.appstrap/config/presets'))
    await fs.writeFile(path.resolve(process.cwd(), './.appstrap/config.js'), configContents)
  }

  static showGenerationSummary () {
    console.log('=================================================')
    console.log('         Config generated successfully!          ')
    console.log('=================================================')
    console.log(`Root Directory : ${process.cwd()}`)
    console.log('   |- .appstrap')
    console.log('      |- presets/')
    console.log('      |- config.js')
    console.log('')
    console.log('For more information visit the following links:')
    console.log('Getting started: https://some-getting-started-link-here')
    console.log('Documentation: https://appstrap-documentation-link-here')
  }
}

export default ConfigGenerator
