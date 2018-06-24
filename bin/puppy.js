#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const spawn = require('child_process').spawn
const minimist = require('minimist')
const findFreePort = require('find-free-port')

const logo = require('../src/logo')
const help = require('../src/help')
const version = require('../package').version
const puppyConfig = require('../puppy.config.js')

;(async () => {
  // files
  const serverFile = path.resolve(__dirname, '..', 'src/server.js')
  const jestConfigFile = path.resolve(__dirname, '..', 'config/jest.config.js')

  // arguments
  const arguments = minimist(process.argv.slice(2), {boolean: ['h', 'help', 'version', 'headless']})

  if (arguments.version) {
    return console.log('Version:', version)
  }

  if (arguments.help) {
    return console.log(help())
  }

  const configFile = path.resolve(process.cwd(), arguments.config || 'puppy.config.js')

  if (fs.existsSync(configFile)) {
    Object.assign(puppyConfig, require(configFile))
  }

  const WS = arguments['ws'] || puppyConfig['ws']
  const API = arguments['api'] || puppyConfig['api']

  const PORT = arguments['port'] || puppyConfig['port']
  const WS_PORT = arguments['ws-port'] || arguments['api-port'] || arguments['port'] || puppyConfig['ws-api'] || puppyConfig['api-port'] || puppyConfig['port']
  const API_PORT = arguments['api-port'] || arguments['port'] || puppyConfig['api-port'] || puppyConfig['port']
  const INTERNAL_PORT = (await findFreePort(65000, 65535)).pop()

  const VERBOSE = arguments['verbose'] || puppyConfig['verbose'] || false
  const HEADLESS = arguments['headless'] || puppyConfig['headless'] || false

  const WS_URL = arguments['ws-url'] || puppyConfig['ws-url']
  const INDEX_FILE = arguments['index-file'] || puppyConfig['index-file']
  const STATIC_DIR = arguments['static-dir'] || puppyConfig['static-dir']

  console.log(chalk.cyan(logo(arguments.headless)))

  const server = spawn(`node`, ['--inspect', serverFile, '--colors'], {
    pwd: process.cwd(),
    stdio: 'pipe',
    env: Object.assign({}, process.env, {WS, API, PORT, WS_PORT, API_PORT, INTERNAL_PORT, VERBOSE, HEADLESS, WS_URL, INDEX_FILE, STATIC_DIR})
  })

  server.stdout.pipe(process.stdout)
  server.stderr.pipe(process.stderr)

  if (arguments._.includes('serve') || arguments._.includes('s')) {
    return console.log('serving only')
  }

  const jest = spawn('jest', ['-i', '--colors', '-c', jestConfigFile, '--rootDir', process.cwd()], {
    stdio: 'pipe',
    env: Object.assign({}, process.env, {WS, API, PORT, WS_PORT, API_PORT, INTERNAL_PORT, VERBOSE, HEADLESS, WS_URL, INDEX_FILE, STATIC_DIR})
  })

  jest.stdout.pipe(process.stdout)
  jest.stderr.pipe(process.stderr)

  process.on('SIGHUP', () => server.kill('SIGHUP'))
  process.on('SIGTERM', () => server.kill('SIGHUP'))

  jest
    .on('close', code => {
      server.kill('SIGHUP')
      process.exit(code)
    })
})()
