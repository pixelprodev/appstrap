#!/usr/bin/env node
const { version } = require('./package.json')
const { initialize } = require('./server')
const program = require('commander')
const path = require('path')

const defaults = {
  config: './appstrap.config.js',
  port: 5000
}

program
  .version(version)
  .option('-c, --config <directory>', 'Config directory path')
  .option('-p, --port <port>', 'Port to start express server on')
  .parse(process.argv);


const options = {
  configPath: program.config || defaults.config,
  port: program.port || defaults.port
}

//validate options config
validateAndInit(options)

async function validateAndInit({configPath, port}) {
  try {
    const config = require(path.resolve(__dirname, configPath))
    // todo throw if required pieces arent present
      // I don't quite know what I want to have for required pieces just yet
    initialize(config, port)
  } catch (e) {
    console.log('custom error message here')
    console.error(e)
    process.exit()
  }
}
