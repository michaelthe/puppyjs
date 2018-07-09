'use strict'
const path = require('path')
const chalk = require('chalk')
const chokidar = require('chokidar')
const expressuws = require('express-ws')

let wsEvents = {}

const log = chalk.bold.magenta
const error = chalk.bold.red
const socket = chalk.bold.greenBright

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

      if (process.env.VERBOSE === 'true' && event === 'change') {
        console.log(chalk.bold.cyan(`Puppy WS: Changes detected, reloading ${process.env.WS} file`))
      }

      delete require.cache[require.resolve(path)]

      try {
        let newResponses = require(path)

        wsEvents = Object
          .keys(newResponses)
          .map(key => Object.assign(newResponses[key], {label: key}))

        if (process.env.VERBOSE === 'true') {
          console.log(log(`Puppy WS: ${process.env.WS} loaded. Refresh browser to view changes`))
        }
      } catch (e) {
        if (process.env.VERBOSE === 'true') {
          console.log(error(`Puppy WS: failed to load default responses from ${process.env.WS}`))
          console.error(e)
        }
      }
    })

  wsApp.ws(process.env.WS_URL, ws => {
    if (process.env.VERBOSE === 'true') {
      console.debug(socket('Puppy WS: Client connected'))
    }

    wsEvents
      .filter(event => event.activate === undefined)
      .forEach(event => handleEvent(ws, event))

    ws.on('message', message => {
      if (process.env.VERBOSE === 'true') {
        console.log(socket('Puppy WS: Received message: %s'), message)
      }

      wsEvents
        .filter(event => typeof event.activate === 'function' && event.activate(message))
        .forEach(event => handleEvent(ws, event, message))
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
      console.log(chalk.bold.red('Puppy WS: Something went wrong while executing the function'))
      console.error(err)
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
    if (process.env.VERBOSE === 'true') {
      console.log(chalk.keyword('orange')('Puppy WS: Clearing previous timeout and interval for event due to socket disconnection'))
    }

    return interval && clearInterval(interval)
  }

  ws.send(JSON.stringify(message))
}

module.exports = initialize
