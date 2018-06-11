'use strict'

const cors = require('cors')
const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')

const ws = require('./ws')
const api = require('./api')
const puppyConfig = require('./config')

const flag = chalk.bold.blueBright

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

staticApp.use(express.static(puppyConfig.STATIC_DIR))

ws(wsApp || apiApp || staticApp, internalApp)
api(apiApp || staticApp, internalApp)

internalApp
  .listen(puppyConfig.PUPPY_PORT, () => {
    console.log(flag(`Puppy is listening on port ${puppyConfig.PUPPY_PORT}!`))
  })

staticApp
  .listen(puppyConfig.PORT, () => {
    console.log(flag(`Puppy static is listening on port ${puppyConfig.PORT}!`))
    console.log(flag(`Puppy static dir is: ${puppyConfig.STATIC_DIR}!`))
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
