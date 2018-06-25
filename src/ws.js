'use strict'
const chalk = require('chalk')
const expressuws = require('express-ws')
const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const socket = chalk.bold.greenBright

function initialize (wsApp, internalApp) {
  const expressUms = expressuws(wsApp)// eslint-disable-line

  const wss = expressUms.getWss()
  const wsOnDemandResponses = {}

  let wsFile = path.resolve(process.cwd(), process.env.WS)
  let wsDefaultResponses = {}

  if (fs.existsSync(wsFile)) {
    wsDefaultResponses = require(wsFile)
  }

  chokidar.watch(wsFile, {usePolling: true})
    .on('change', (path, event) => {
      delete require.cache[require.resolve(path)]
      wsDefaultResponses = require(path)
    })

  wsApp.ws(process.env.WS_URL, ws => {
    console.debug(socket('Puppy ws client connected'))

    wsDefaultResponses.forEach(event => {
      let intervalRef
      setTimeout(() => {
        intervalRef = setInterval(() => {
          if (typeof event.messages === 'function') {
            ws.send(JSON.stringify(event.messages.call(event.messages)))
          }

          if (Array.isArray(event.messages)) {
            event.messages.forEach(message => {
              ws.send(JSON.stringify(message))
            })
          }
        }, event.interval)
      }, event.delay || 0)

      if (!event.interval) {
        intervalRef.clear()
      }
    })

    ws.on('message', message => {
      console.log(socket('Puppy ws received message: %s'), message)
    })
  })

  internalApp.post('/emit', (req, res) => {
    let message = req.body

    wss.clients.forEach(client => client.send(JSON.stringify(message)))

    setTimeout(() => res.send('ok'), 50)
  })
}

module.exports = initialize
