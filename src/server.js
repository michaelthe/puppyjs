'use strict'
const fs = require('fs')
const cors = require('cors')
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')

const ws = require('./ws')
const api = require('./api')
const statik = require('./static')

const puppyConfig = require('../puppy.config.js')

const flag = chalk.bold.blueBright

const configFile = path.resolve(process.cwd(), 'puppy.config.js')

if (fs.existsSync(configFile)) {
  Object.assign(puppyConfig, require(configFile))
}

let wsApp
let apiApp
let staticApp = express()
let internalApp = express()

internalApp.use(cors())
internalApp.use(bodyParser.json())

if (puppyConfig.API_PORT) {
  apiApp = express()
}

if (puppyConfig.WS_PORT) {
  wsApp = express()
}

statik(staticApp)
ws(wsApp || apiApp || staticApp, internalApp)
api(apiApp || staticApp, internalApp)

staticApp.all('*', (req, res) => {
  res.sendFile(puppyConfig.STATIC_INDEX, {root: puppyConfig.STATIC_DIR})
})

internalApp
  .listen(puppyConfig.PUPPY_PORT, () => {
    console.log(flag(`Puppy is listening on port ${puppyConfig.PUPPY_PORT}!`))
  })

staticApp
  .listen(puppyConfig.PORT, () => {
    console.log(flag(`Puppy static is listening on port ${puppyConfig.PORT}!`))
    console.log(flag(`Puppy static index file: ${puppyConfig.STATIC_INDEX}!`))

    if (!apiApp) {
      console.log(flag(`Puppy static api is listening on port ${puppyConfig.PORT}!`))
    }

    if (!apiApp && !wsApp) {
      console.log(flag(`Puppy ws is listening on port ${puppyConfig.PORT}!`))
      console.log(flag(`Puppy ws URL is set to ${puppyConfig.WS_URL}!`))
    }
  })

if (apiApp) {
  apiApp
    .listen(puppyConfig.API_PORT, () => {
      console.log(flag(`Puppy api is listening on port ${puppyConfig.API_PORT}!`))

      if (!wsApp) {
        console.log(flag(`Puppy ws is listening on port ${puppyConfig.API_PORT}!`))
        console.log(flag(`Puppy ws URL is set to ${puppyConfig.API_PORT}!`))
      }
    })
}

if (wsApp) {
  wsApp
    .listen(puppyConfig.WS_PORT, () => {
      console.log(flag(`Puppy ws is listening on port ${puppyConfig.WS_PORT}!`))
      console.log(flag(`Puppy ws URL is set to ${puppyConfig.WS_URL}!`))
    })
}
