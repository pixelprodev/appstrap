#!/usr/bin/env node
const { version } = require('./package.json')
const { initialize } = require('./server')
const program = require('commander')

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
  config: program.config || defaults.config,
  port: program.port || defaults.port
}

initialize(options)
