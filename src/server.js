'use strict'

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

const ws = require('./ws')
const api = require('./api')
const hotReload = require('./hot-reload')

const charcoal = require('./libs/charcoal')

const apps = {}
apps[process.env.PORT] = createApp()
apps[process.env.WS_PORT] = apps[process.env.WS_PORT] || createApp()
apps[process.env.API_PORT] = apps[process.env.API_PORT] || createApp()
apps[process.env.INTERNAL_PORT] = apps[process.env.INTERNAL_PORT] || createApp()

const app = apps[process.env.PORT]
const wsApp = apps[process.env.WS_PORT]
const apiApp = apps[process.env.API_PORT]
const internalApp = apps[process.env.INTERNAL_PORT]

internalApp.get('/status', (req, res) => res.end('ok'))

ws(wsApp, internalApp)
api(apiApp, internalApp)
hotReload(app, internalApp)

charcoal.info(`Puppy WS URL is: ${process.env.WS_URL}.`)
charcoal.info(`Puppy static dir is: ${process.env.STATIC_DIR}.`)
charcoal.info(`Puppy static index file: ${process.env.INDEX_FILE}.`)

charcoal.info(`Puppy is listening on port ${process.env.INTERNAL_PORT}.`)

charcoal.info(`Puppy WS port is: ${process.env.WS_PORT}.`)
charcoal.info(`Puppy API port is: ${process.env.API_PORT}.`)
charcoal.info(`Puppy static port is: ${process.env.PORT}.`)

for (let port of Object.keys(apps)) {
  apps[port].listen(port, () => charcoal.info(`PORT ${port} is ready.`))
}

function createApp () {
  const app = express()

  app.use(cors())
  app.use(bodyParser.json({ strict: false }))

  return app
}
