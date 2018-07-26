const chalk = require('chalk')

const _ws = chalk.bold.blue
const _api = chalk.bold.green
const _log = chalk.yellow
const _info = chalk.bold.cyan
const _error = chalk.bold.red

function info (location, ...args) {
  switch (location) {
    case 'ws':
      console.info(_ws('Puppy WS: '), _info(...args))
      break
    case 'api':
      console.info(_api('Puppy API: '), _info(...args))
      break
    default:
      console.info(_info(location, ...args))
  }
}

function log (location, ...args) {
  if (process.env.VERBOSE !== 'true') {
    return
  }

  switch (location) {
    case 'ws':
      console.log(_ws('Puppy WS: '), _log(...args))
      break
    case 'api':
      console.log(_api('Puppy API: '), _log(...args))
      break
    default:
      console.log(_info('Puppy: '), _log(location, ...args))
  }
}

function error (location, ...args) {
  if (process.env.VERBOSE !== 'true') {
    return
  }

  switch (location) {
    case 'ws':
      console.error(_ws('Puppy WS ERROR: '), _error(...args))
      break
    case 'api':
      console.error(_api('Puppy API ERROR: '), _error(...args))
      break
    default:
      console.error(_info('Puppy ERROR: '), _error(location, ...args))
  }
}

module.exports = { error, info, log }
