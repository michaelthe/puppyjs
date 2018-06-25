'use strict'
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const chalk = require('chalk')
const chokidar = require('chokidar')
const bodyParser = require('body-parser')

const log = chalk.bold.magenta
const error = chalk.keyword('red')
const warning = chalk.keyword('orange')

function initialize (apiApp, internalApp) {
  const apiOnDemandResponses = {}

  let apiFile = path.resolve(process.cwd(), process.env.API)
  let apiDefaultResponses = {}

  if (fs.existsSync(apiFile)) {
    Object.assign(apiDefaultResponses, require(apiFile))
  }

  chokidar.watch(apiFile, {persistent: true, usePolling: true})
    .on('change', (path, event) => {
      delete require.cache[require.resolve(path)]
      apiDefaultResponses = require(path)
    })

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

    const method = req.method

    const data = apiOnDemandResponses[req.url] && apiOnDemandResponses[req.url][req.method]
      || apiDefaultResponses[req.url] && apiDefaultResponses[req.url][req.method]
      || apiDefaultResponses[req.url] && apiDefaultResponses[req.url]['DEFAULT']
      || undefined

    if (!data) {
      console.warn(error(`Puppy API: HTTP VERB (${method}) not supported for this route, please update your API`))
      res.status(404)
      res.end(`Puppy API: HTTP VERB (${method}) not supported for this route, please update your API`)
      return
    }

    const body = data.body || 'EMPTY BODY'
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
