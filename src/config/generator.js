import readline from 'readline'
import path from 'path'
import fs from 'fs-extra'
import util from 'util'
import prettier from 'prettier'
import chalk from 'chalk'

const prompts = {
  isSinglePageApp: chalk`      Are you strapping a single page app? {blue [y/n]}:  `,
  bundlePath: chalk`      Please provide the path to your bundle file {blue [relative to current dir]}:  `,
  bundleHost: chalk`      Please specify the html container your bundle expects {blue [i.e. #container or .host]}:  `
}

class ConfigGenerator {
  static async generate () {
    const {stdin, stdout} = process
    console.log(chalk`
    ===============================================================
      {yellow.bold Appstrap} config file generator
    `)
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
      bundle.directory = path.join(...splitFileName)
    }
    const config = {}
    if (isSinglePageApp) {
      config.bundle = {webPath: bundle.path, host: bundle.host}
      config.assets = [{webPath: `/${bundle.fileName}`, directory: bundle.directory}]
    }
    if (!config.assets) {
      config.assets = []
    }
    config.endpoints = []
    return config
  }

  static async writeConfigFile (configObject) {
    const configContents = `module.exports = ${util.inspect(configObject, false, 2, false)}`
    const filePath = path.resolve(process.cwd(), './.appstrap/config.js')
    await fs.ensureFile(filePath)
    await fs.ensureDir(path.resolve(process.cwd(), './.appstrap/presets'))

    await fs.writeFile(path.resolve(process.cwd(), './.appstrap/config.js'), prettier.format(configContents))
  }

  static showGenerationSummary () {
    console.log(chalk`
    ===============================================================
      {yellow.bold Appstrap} Config generated {green.bold successfully!} 
    
      Root Directory : ${process.cwd()} {cyan
         |- .appstrap
            |- presets/
            |- config.js}

      For more information visit the following links:
      Getting started: {blue https://github.com/pixelprodotco/appstrap#getting-started}
      Documentation: {blue https://github.com/pixelprodotco/appstrap/blob/master/docs/api.md#appstrap-api}
    ===============================================================
    `)
  }
}

export default ConfigGenerator
