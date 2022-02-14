const chalk = require('chalk')

class Logger {
  constructor ({ info, trace, warn, error } = {}) {
    this.info = typeof info === 'function' ? info : this.logInfo
    this.trace = typeof trace === 'function' ? trace : this.logTrace
    this.warn = typeof warn === 'function' ? warn : this.logWarn
    this.error = typeof error === 'function' ? error : this.logError
  }

  logInfo (message) {
    console.log(chalk`[ Appstrap:info ] ${message}`)
  }

  logTrace (message) {
    console.log(chalk`[ Appstrap{greenBright :trace} ] {greenBright ${message}}`)
  }

  logWarn (message) {
    console.log(chalk`[ Appstrap{yellow :warn} ] {yellow ${message}}`)
  }

  logError (message) {
    console.log(chalk`[ Appstrap{red :error} ] {red ${message}}`)
  }
}

exports = module.exports = new Logger()
