#!/usr/bin/env node
import { version } from '../package.json'
import Appstrap from './Appstrap'
import program from 'commander'
import ConfigGenerator from './config/generator'

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
  .option('-P, --preserve <preserve>', 'Preserve initial state on config updates [default: true]')
  .action(async (params) => {
    try {
      params.invokedFromCLI = true
      const Instance = new Appstrap(params)
      await Instance.start()
    } catch (e) { throw (e) }
  })

program.parse(process.argv)
