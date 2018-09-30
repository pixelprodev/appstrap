#!/usr/bin/env node
const { version } = require('../package.json')
const Appstrap = require('./Appstrap')
const program = require('commander')
// const ConfigGenerator = require('./config/generator')

program
  .name('appstrap')
  .version(version)

// program
//   .command('init')
//   .description('Initialize a base configuration file for your appstrap server')
//   .action(() => ConfigGenerator.generate())

program
  .command('start')
  .action(async () => {
    try {
      const Instance = new Appstrap({cli: true})
      await Instance.start()
    } catch (e) { throw (e) }
  })

program.parse(process.argv)
