'use strict'

const cors = require('cors')
const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')

const ws = require('./ws')
const api = require('./api')

const flag = chalk.bold.blueBright

let wsApp
let apiApp
let staticApp = express()
let internalApp = express()

internalApp.use(cors())
internalApp.use(bodyParser.json())

if (process.env.API_PORT !== process.env.PORT) {
  apiApp = express()
}

if (process.env.WS_PORT !== process.env.API_PORT) {
  wsApp = express()
}

staticApp.use(express.static(process.env.STATIC_DIR))

ws(wsApp || apiApp || staticApp, internalApp)
api(apiApp || staticApp, internalApp)

internalApp
  .listen(process.env.INTERNAL_PORT, () => {
    console.log(flag(`Puppy is listening on port ${process.env.INTERNAL_PORT}!`))
  })

staticApp
  .listen(process.env.PORT, () => {
    console.log(flag(`Puppy static is listening on port ${process.env.PORT}!`))
    console.log(flag(`Puppy static dir is: ${process.env.STATIC_DIR}!`))
    console.log(flag(`Puppy static index file: ${process.env.INDEX_FILE}!`))

    if (!apiApp) {
      console.log(flag(`Puppy static api is listening on port ${process.env.PORT}!`))
    }

    if (!apiApp && !wsApp) {
      console.log(flag(`Puppy ws is listening on port ${process.env.PORT}!`))
      console.log(flag(`Puppy ws URL is set to ${process.env.WS_URL}!`))
    }
  })

if (apiApp) {
  apiApp
    .listen(process.env.API_PORT, () => {
      console.log(flag(`Puppy api is listening on port ${process.env.API_PORT}!`))

      if (!wsApp) {
        console.log(flag(`Puppy ws is listening on port ${process.env.API_PORT}!`))
        console.log(flag(`Puppy ws URL is set to ${process.env.API_PORT}!`))
      }
    })
}

if (wsApp) {
  wsApp
    .listen(process.env.WS_PORT, () => {
      console.log(flag(`Puppy ws is listening on port ${process.env.WS_PORT}!`))
      console.log(flag(`Puppy ws URL is set to ${process.env.WS_URL}!`))
    })
}
