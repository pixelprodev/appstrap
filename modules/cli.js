#!/usr/bin/env node
const { version } = require('../package.json')
const Appstrap = require('./Appstrap')
const program = require('commander')

program
  .version(version)
  .option('-c, --configPath <configPath>', 'Config directory path')
  .option('-p, --port <port>', 'Port to start express server on')
  .parse(process.argv);

const Instance = new Appstrap(program)
Instance.start()
