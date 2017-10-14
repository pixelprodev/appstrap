#!/usr/bin/env node
const { version } = require('./package.json')
const program = require('commander')
const cp = require('child_process')

program
  .version(version)
  .option('-c, --configPath <configPath>', 'Config directory path')
  .option('-p, --port <port>', 'Port to start express server on')
  .parse(process.argv);

let childServer
cycleChildProcess({restart: false})
function cycleChildProcess ({restart}) {
  if (restart) {
    childServer.kill()
  }
  childServer = cp.fork(`${__dirname}/lib/Server.js`, [JSON.stringify({
    configPath: program.configPath,
    port: program.port
  })])
  childServer.on('message', cycleChildProcess.bind(null, {restart: true}))
}
