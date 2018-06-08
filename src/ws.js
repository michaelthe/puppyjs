'use strict'
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const expressuws = require('express-uws')

const puppyConfig = require('./config')

const socket = chalk.bold.greenBright

function initialize (wsApp, internalApp) {
  const expressUms = expressuws(wsApp)// eslint-disable-line

  const wss = expressUms.getWss()

  wsApp.ws(puppyConfig.WS_URL, ws => {
    console.debug(socket('Puppy ws client connected'))
    ws.on('message', message => {
      console.log(socket('Puppy ws received message: %s'), message)
    })
  })

  internalApp.post('/emit', (req, res) => {
    let message = req.body

    wss.clients.forEach(client => client.send(JSON.stringify(message)))

    res.send('ok')
  })
}

module.exports = initialize
