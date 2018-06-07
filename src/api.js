'use strict'
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const chalk = require('chalk')
const bodyParser = require('body-parser')

const log = chalk.bold.magenta
const warning = chalk.keyword('orange')

function initialize (apiApp, internalApp) {
  const apiDefaultResponses = {}
  const apiOnDemandResponses = {}

  const apiFile = path.resolve(process.cwd(), 'puppy.api.js')

  if (fs.existsSync(apiFile)) {
    Object.assign(apiDefaultResponses, require(apiFile))
  }

  apiApp.use(cors())
  apiApp.use(bodyParser.json())

  internalApp.post('/register', (req, res) => {
    const {data, headers, status, path} = req.body

    console.debug(log(`Puppy register URL %s`), path)

    apiOnDemandResponses[path] = {
      body: data || 'ok',
      headers: headers || [],
      status: status || 200
    }

    res.send('ok')
  })

  apiApp.all('*', (req, res, next) => {
    if (req.url === '') {
      return
    }

    let data = apiOnDemandResponses[req.url] || apiDefaultResponses[req.url]

    if (!data) {
      return console.warn(warning(`Puppy API: unknown URL: ${req.url}`))
    }

    const body = data.body ? JSON.stringify(data.body) : 'ok'
    const status = data.status || 200
    const headers = data.headers || []

    headers.forEach(header => res.setHeader(header.key, header.value))

    res.status(status)
    res.end(body)

    delete apiOnDemandResponses[req.url]
    next()
  })
}

module.exports = initialize
