#!/usr/bin/env node
const { version } = require('./package.json')
const AppstrapServer = require('./lib/Server')
const program = require('commander')

program
  .version(version)
  .option('-c, --configPath <configPath>', 'Config directory path')
  .option('-p, --port <port>', 'Port to start express server on')
  .parse(process.argv);

AppstrapServer.start(program)