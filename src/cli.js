#!/usr/bin/env node
const { version } = require('../package.json')
const Appstrap = require('./Appstrap')
const program = require('commander')
const ConfigGenerator = require('./utilities/ConfigGenerator')

program
  .name('appstrap')
  .version(version)

program
  .command('init')
  .description('Initialize a base configuration file for your appstrap server')
  .action(() => ConfigGenerator.generate())

program
  .command('start')
  .option('-c, --configPath <configPath>', 'Config directory path')
  .option('-p, --port <port>', 'Preferred port to listen on')
  .action(async (params) => {
    try {
      const Instance = new Appstrap(params)
      await Instance.start()
    } catch (e) { throw (e) }
  })

program.parse(process.argv)
