'use strict'
const path = require('path')
const chalk = require('chalk')
const chokidar = require('chokidar')
const expressuws = require('express-ws')

let timeouts = []
let intervals = []
let wsDefaultResponses = {}

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

      let newResponses
      try {
        newResponses = require(path)

        wsDefaultResponses = Object
          .keys(newResponses)
          .map(key => Object.assign(newResponses[key], {label: key}))

        timeouts.forEach(timeout => clearTimeout(timeout))
        intervals.forEach(interval => clearInterval(interval))

        timeouts = []
        intervals = []

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

    wsDefaultResponses
      .forEach(event => {
        const timeout = setTimeout(async () => {
          const _emitMessage = async message => {

            if (ws.readyState !== 1) {
              if (process.env.VERBOSE === 'true') {
                console.log(chalk.keyword('orange')('Puppy WS: Clearing previous timeout and interval for event due to socket disconnection'))
              }

              clearTimeout(timeout)
              clearInterval(interval)
              return
            }

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
              console.log(chalk.cyan(`Puppy WS: `) + chalk.bold.cyan(`Emitting [${event.label}]`))
              console.log(chalk.bold.magenta(JSON.stringify(message)))
            }

            ws.send(JSON.stringify(message))
          }

          if (!event.interval) {
            return _emitMessage(event.message)
          }

          const interval = setInterval(() => _emitMessage(event.message), event.interval)

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
