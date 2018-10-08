'use strict'

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

const ws = require('./ws')
const api = require('./api')
const hotReload = require('./hot-reload')

const charcoal = require('./libs/charcoal')

let wsApp
let apiApp
let internalApp = express()
let hotReloadApp = express()

internalApp.use(cors())
internalApp.use(bodyParser.json({ strict: false }))

hotReloadApp.use(cors())
hotReloadApp.use(bodyParser.json({ strict: false }))

internalApp.get('/status', (req, res) => res.end('ok'))

if (process.env.API_PORT !== process.env.PORT) {
  apiApp = express()

  apiApp.use(cors())
  apiApp.use(bodyParser.json({ strict: false }))
}

if (process.env.WS_PORT !== process.env.API_PORT) {
  wsApp = express()

  wsApp.use(cors())
  wsApp.use(bodyParser.json({ strict: false }))
}

ws(wsApp || apiApp || hotReloadApp, internalApp)
api(apiApp || hotReloadApp, internalApp)
hotReload(hotReloadApp, internalApp)

charcoal.info(`Puppy WS URL is: ${process.env.WS_URL}.`)
charcoal.info(`Puppy static dir is: ${process.env.STATIC_DIR}.`)
charcoal.info(`Puppy static index file: ${process.env.INDEX_FILE}.`)

charcoal.info(`Puppy is listening on port ${process.env.INTERNAL_PORT}.`)

charcoal.info(`Puppy WS port is: ${process.env.WS_PORT || process.env.API_PORT || process.env.PORT}.`)
charcoal.info(`Puppy API port is: ${process.env.API_PORT || process.env.PORT}.`)
charcoal.info(`Puppy static port is: ${process.env.PORT}.`)

internalApp.listen(process.env.INTERNAL_PORT, () => charcoal.info(`PORT ${process.env.INTERNAL_PORT} is ready.`))
hotReloadApp.listen(process.env.PORT, () => charcoal.info(`PORT ${process.env.PORT} is ready.`))

if (apiApp) {
  apiApp.listen(process.env.API_PORT, () => charcoal.info(`PORT ${process.env.API_PORT} is ready.`))
}

if (wsApp) {
  wsApp.listen(process.env.WS_PORT, () => charcoal.info(`PORT ${process.env.WS_PORT} is ready.`))
}
