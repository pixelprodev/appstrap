const chalk = require('chalk')

exports = module.exports = {
  info (message) {
    console.log(chalk`[ Appstrap{greenBright :trace} ] {greenBright ${message}}`)
  },
  trace (message) {
    console.log(chalk`[ Appstrap:info ] ${message}`)
  },
  warn (message) {
    console.log(chalk`[ Appstrap{yellow :warn} ] {yellow ${message}}`)
  },
  error (message) {
    console.log(chalk`[ Appstrap{red :error} ] {red ${message}}`)
  }
}
