#!/usr/bin/env node
const { version } = require('../package.json')
const Appstrap = require('./Appstrap')
const program = require('commander')

program
  .version(version)
  .option('-c, --configPath <configPath>', 'Config directory path')
  .option('-p, --port <port>', 'Port to start express server on')
  .parse(process.argv);


/**
 * start up all services
 * - app server itself
 * - management interface
 * - optionally start webpack build (dev)
 *
 * single instance of appstrap base class
 *    pass in options from cmd
 * */

const Instance = new Appstrap(program)
Instance.start()
