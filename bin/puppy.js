#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const spawn = require('child_process').spawn
const mkdirp = require('mkdirp')
const minimist = require('minimist')
const findFreePort = require('find-free-port')

const logo = require('../src/logo')
const help = require('../src/help')
const version = require('../package').version
const charcoal = require('../src/charcoal')
const puppyConfig = require('../puppy.config.js')

;(async () => {
  // files
  const serverFile = path.resolve(__dirname, '..', 'src/server.js')
  const jestConfigFile = path.resolve(__dirname, '..', 'config/jest.config.js')

  // args
  const args = minimist(process.argv.slice(2), {boolean: ['h', 'help', 'version', 'headless']})

  if (args.version) {
    return charcoal.info('Version:', version)
  }

  if (args.help || !args._.find(arg => ['s', 't', 'serve', 'test'].includes(arg))) {
    return charcoal.info(help())
  }

  const configFile = path.resolve(process.cwd(), args.config || 'puppy.config.js')

  if (fs.existsSync(configFile)) {
    Object.assign(puppyConfig, require(configFile))
  }

  const WS = args['ws'] || puppyConfig['ws']
  const API = args['api'] || puppyConfig['api']

  const PORT = args['port'] || puppyConfig['port']
  const WS_PORT = args['ws-port'] || args['api-port'] || args['port'] || puppyConfig['wsApi'] || puppyConfig['apiPort'] || puppyConfig['port']
  const API_PORT = args['api-port'] || args['port'] || puppyConfig['apiPort'] || puppyConfig['port']

  const VERBOSE = args['verbose'] || puppyConfig['verbose'] || false
  const HEADLESS = args['headless'] || puppyConfig['headless'] || false

  const WS_URL = args['ws-url'] || puppyConfig['wsUrl']
  const INDEX_FILE = args['index-file'] || puppyConfig['indexFile']
  const STATIC_DIR = args['static-dir'] || puppyConfig['staticDir']

  const DEVTOOLS = args['devtools'] || puppyConfig['devtools']

  const WINDOW_WIDTH = puppyConfig['windowWidth']
  const WINDOW_HEIGHT = puppyConfig['windowHeight']

  const VIEWPORT_WIDTH = puppyConfig['viewportWidth']
  const VIEWPORT_HEIGHT = puppyConfig['viewportHeight']

  const EXT_PREFIX = args['ext-prefix'] || puppyConfig['extPrefix']

  charcoal.info(logo(args.headless))

  let server
  let INTERNAL_PORT = 65000
  mkdirp.sync(path.join(process.cwd(), '.puppy'))
  if (fs.existsSync(path.join(process.cwd(), '.puppy') + '/internal-port')) {
    INTERNAL_PORT = fs.readFileSync(path.join(process.cwd(), '.puppy') + '/internal-port')
  }

  let ENV = {
    WS,
    API,
    PORT,
    WS_PORT,
    API_PORT,
    INTERNAL_PORT,
    VERBOSE,
    HEADLESS,
    WS_URL,
    INDEX_FILE,
    STATIC_DIR,
    EXT_PREFIX,
    DEVTOOLS,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    VIEWPORT_WIDTH,
    VIEWPORT_HEIGHT
  }

  try {
    let response = await fetch(`http://127.0.0.1:${INTERNAL_PORT}/status`)

    // there is no previous process running
    // -> throw error so that a new process can start
    // in catch block
    if (response.status !== 200) {
      throw new Error('some error')
    }

    if (args._.find(arg => ['s', 'serve'].includes(arg))) {
      return charcoal.info('Mock servers are running on another process already')
    }
  } catch (e) {
    INTERNAL_PORT = (await findFreePort(65000, 65535)).pop()
    fs.writeFileSync(path.join(process.cwd(), '.puppy') + '/internal-port', INTERNAL_PORT)

    const serverArguments = [serverFile, '--colors']

    if (args.inspect) {
      serverArguments.push('--inspect')
    }

    const serverOptions = {
      pwd: process.cwd(),
      stdio: 'pipe',
      env: Object.assign({}, process.env, ENV)
    }

    server = spawn(`node`, serverArguments, serverOptions)

    server.stdout.pipe(process.stdout)
    server.stderr.pipe(process.stderr)
  }

  if (args._.find(arg => ['s', 'serve'].includes(arg))) {
    return charcoal.info(`Serving ${process.cwd()}`)
  }

  const jestArguments = ['--colors', '--runInBand', '--config', jestConfigFile, '--rootDir', process.cwd(), ...args._.filter(arg => !['s', 't', 'serve', 'test'].includes(arg))]

  const jestOptions = {
    stdio: 'pipe',
    env: Object.assign({}, process.env, ENV)
  }

  const jest = spawn('jest', jestArguments, jestOptions)

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
