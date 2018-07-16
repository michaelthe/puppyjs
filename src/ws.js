'use strict'
const path = require('path')
const chokidar = require('chokidar')
const expressuws = require('express-ws')

const charcoal = require('./charcoal')

let wsEvents = {}

function initialize (wsApp, internalApp) {
  const expressUms = expressuws(wsApp) // eslint-disable-line

  const wss = expressUms.getWss()

  const wsFile = path.resolve(process.cwd(), process.env.WS)

  chokidar
    .watch(wsFile, {usePolling: true})
    .on('all', (event, path) => {
      if (event !== 'add' && event !== 'change') {
        return
      }

      charcoal.log('ws', `Changes detected, reloading ${process.env.WS} file`)

      delete require.cache[require.resolve(path)]

      try {
        let newResponses = require(path)

        wsEvents = Object
          .keys(newResponses)
          .map(key => Object.assign(newResponses[key], {label: key}))

        charcoal.log('ws', `${process.env.WS} loaded. Refresh browser to view changes`)
      } catch (e) {
        charcoal.error('ws', `Failed to load default responses from ${process.env.WS}`)
        charcoal.error(e)
      }
    })

  wsApp.ws(process.env.WS_URL, ws => {
    charcoal.log('ws', 'Client connected')

    wsEvents
      .filter(event => event.activate === undefined)
      .forEach(event => handleEvent(ws, event))

    ws.on('message', async message => {
      charcoal.log('ws', `Received message: ${message}`)

      const events = wsEvents.filter(event => typeof event.activate === 'function')

      for (const event of events) {
        if (await event.activate(message)) {
          await handleEvent(ws, event, message)
        }
      }
    })
  })

  internalApp.post('/emit', (req, res) => {
    let message = req.body

    wss.clients.forEach(client => client.send(JSON.stringify(message)))

    setTimeout(() => res.send('OK'), 50)
  })
}

async function handleEvent (ws, event, clientMessage) {
  let message = event.message
  if (typeof message === 'function') {
    try {
      message = await event.message(clientMessage)
    } catch (err) {
      charcoal.error('ws', 'Something went wrong while executing the function')
      charcoal.error(err)
      return
    }
  }

  if (typeof message === 'undefined' || message === null) {
    return
  }

  setTimeout(async () => {
    if (!event.interval) {
      return sendMessage(ws, message)
    }

    let interval
    interval = setInterval(() => sendMessage(ws, message, interval), event.interval)
  }, event.delay || 0)
}

async function sendMessage (ws, message, interval) {
  if (ws.readyState !== 1) {
    return interval && clearInterval(interval)
  }

  charcoal.log('ws', JSON.stringify(message))
  ws.send(JSON.stringify(message))
}

module.exports = initialize
