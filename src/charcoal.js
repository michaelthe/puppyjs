const chalk = require('chalk')

const _info = chalk.bold.cyan
const _error = chalk.red
const _important = chalk.bold.blueBright

const _log = chalk.cyan
const _debug = chalk.magenta

function info (...args) {
  console.info(_info(...args))
}

function important (...args) {
  console.info(_important(...args))
}

function log (...args) {
  if (process.env.VERBOSE === 'true') {
    console.log(_log(...args))
  }
}

function debug (...args) {
  if (process.env.VERBOSE === 'true') {
    console.debug(_debug(...args))
  }
}

function error (...args) {
  if (process.env.VERBOSE === 'true') {
    console.error(_error(...args))
  }
}

module.exports = {important, log, debug, info, error}
