#! /usr/bin/env node
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const chalk = require('chalk')
const spawn = require('child_process').spawn
const mkdirp = require('mkdirp')
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

  if (arguments.help || !arguments._.find(arg => ['s', 't', 'serve', 'test'].includes(arg))) {
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

  const VERBOSE = arguments['verbose'] || puppyConfig['verbose'] || false
  const HEADLESS = arguments['headless'] || puppyConfig['headless'] || false

  const WS_URL = arguments['ws-url'] || puppyConfig['ws-url']
  const INDEX_FILE = arguments['index-file'] || puppyConfig['index-file']
  const STATIC_DIR = arguments['static-dir'] || puppyConfig['static-dir']

  console.log(chalk.cyan(logo(arguments.headless)))

  let server
  let INTERNAL_PORT
  mkdirp.sync(path.join(process.cwd(), '.puppy'))
  if (fs.existsSync(path.join(process.cwd(), '.puppy') + '/internal-port')) {
    INTERNAL_PORT = fs.readFileSync(path.join(process.cwd(), '.puppy') + '/internal-port')
  }

  try {
    await fetch(`http://127.0.0.1:${INTERNAL_PORT}/status`)
    console.log(chalk.cyan('Server is running...'))
  } catch (e) {
    INTERNAL_PORT = (await findFreePort(65000, 65535)).pop()
    fs.writeFileSync(path.join(process.cwd(), '.puppy') + '/internal-port', INTERNAL_PORT)

    server = spawn(`node`, ['--inspect', serverFile, '--colors'], {
      pwd: process.cwd(),
      stdio: 'pipe',
      env: Object.assign({}, process.env, {WS, API, PORT, WS_PORT, API_PORT, INTERNAL_PORT, VERBOSE, HEADLESS, WS_URL, INDEX_FILE, STATIC_DIR})
    })

    server.stdout.pipe(process.stdout)
    server.stderr.pipe(process.stderr)
  }

  if (arguments._.find(arg => ['s', 'serve'].includes(arg))) {
    return console.log('serving only')
  }

  const jest = spawn('jest', ['--colors', '--runInBand', '--config', jestConfigFile, '--rootDir', process.cwd(), ...arguments._.filter(arg => !['s', 't', 'serve', 'test'].includes(arg))], {
    stdio: 'pipe',
    env: Object.assign({}, process.env, {WS, API, PORT, WS_PORT, API_PORT, INTERNAL_PORT, VERBOSE, HEADLESS, WS_URL, INDEX_FILE, STATIC_DIR})
  })

  jest.stdout.pipe(process.stdout)
  jest.stderr.pipe(process.stderr)

  const killServer = () => server && server.kill('SIGHUP')

  process.on('SIGHUP', () => killServer())
  process.on('SIGTERM', () => killServer())

  jest
    .on('close', code => {
      killServer()
      process.exit(code)
    })
})()
