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

  let timeouts = []
  let intervals = []

  if (fs.existsSync(wsFile)) {
    wsDefaultResponses = require(wsFile)
  }

  chokidar
    .watch(wsFile, {usePolling: true})
    .on('change', path => {
      if (process.env.VERBOSE === 'true') {
        console.log(chalk.bold.cyan('Puppy WS: Changes detected, reloading file. Refresh browser to view changes'))
      }

      delete require.cache[require.resolve(path)]
      wsDefaultResponses = require(path)

      timeouts.forEach(timeout => clearTimeout(timeout))
      intervals.forEach(interval => clearInterval(interval))

      timeouts = []
      intervals = []
    })

  wsApp.ws(process.env.WS_URL, ws => {
    if (process.env.VERBOSE === 'true') {
      console.debug(socket('Puppy WS: Client connected'))
    }

    wsDefaultResponses.forEach(event => {
      const timeout = setTimeout(async () => {
        const _emitMessage = async messages => {

          if (ws.readyState !== 1) {
            if (process.env.VERBOSE === 'true') {
              console.log(chalk.keyword('orange')('Puppy WS: Clearing previous timeout and interval for event due to socket disconnection'))
            }

            clearTimeout(timeout)
            clearInterval(interval)
            return
          }

          if (!Array.isArray(messages)) {
            messages = [messages]
          }

          for (let message of messages) {
            if (typeof message === 'function') {
              try {
                message = await message()
              } catch (err) {
                console.log(chalk.bold.red('Puppy WS: Something went wrong while executing the function'))
                console.error(err)
                clearTimeout(timeout)
                clearInterval(interval)
                return
              }
            }

            if (process.env.VERBOSE === 'true') {
              console.log(chalk.cyan(`Puppy WS: Emitting message `) + chalk.bold.magenta(JSON.stringify(message)))
            }

            ws.send(JSON.stringify(message))
          }
        }

        if (!event.interval) {
          return _emitMessage(event.messages)
        }

        const interval = setInterval(() => _emitMessage(event.messages), event.interval)

        intervals.push(interval)
      }, event.delay || 0)

      timeouts.push(timeout)
    })

    ws.on('message', message => {
      if (process.env.VERBOSE === 'true') {
        console.log(socket('Puppy WS: Received message: %s'), message)
      }
    })
  })

  internalApp.post('/emit', (req, res) => {
    let message = req.body

    wss.clients.forEach(client => client.send(JSON.stringify(message)))

    setTimeout(() => res.send('OK'), 50)
  })
}

module.exports = initialize
