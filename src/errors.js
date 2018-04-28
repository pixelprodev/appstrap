export class ErrConfigNotFound extends Error {
  constructor (message, configFilePath) {
    super(`
      Unable to load config file at ${configFilePath}
      Please provide a valid configuration file to proceed
    `, 500)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ErrConfigInvalid extends Error {
  constructor () {
    super(`
      You are missing crucial config data.  
      Please ensure bundle, assets, and routes are specified to proceed.
    `, 500)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ErrEndpointInvalid extends Error {
  constructor () {
    super(`
      Endpoint supplied without path, handler, or method.  Please check and try again.
    `, 500)
    Error.captureStackTrace(this, this.constructor)
  }
}
