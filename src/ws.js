'use strict'
const chalk = require('chalk')
const expressuws = require('express-uws')

const socket = chalk.bold.greenBright

function initialize (wsApp, internalApp) {
  const expressUms = expressuws(wsApp)// eslint-disable-line

  const wss = expressUms.getWss()

  wsApp.ws(process.env.WS_URL, ws => {
    console.debug(socket('Puppy ws client connected'))
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
