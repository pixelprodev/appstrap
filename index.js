#!/usr/bin/env node
const { version } = require('./package.json')
const { initialize } = require('./server')
const AppstrapConfig = require('./server/AppstrapConfig')
const AppstrapServer = require('./server/AppstrapServer')
const program = require('commander')

program
  .version(version)
  .option('-c, --configPath <configPath>', 'Config directory path')
  .option('-p, --port <port>', 'Port to start express server on')
  .parse(process.argv);

const config = new AppstrapConfig(program)
const server = new AppstrapServer(config)

server.start()