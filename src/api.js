'use strict'
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const chalk = require('chalk')
const chokidar = require('chokidar')
const bodyParser = require('body-parser')

const log = chalk.bold.magenta
const error = chalk.bold.red
const warning = chalk.keyword('orange')

function initialize (apiApp, internalApp) {
  let apiDefaultResponses = {}
  let apiOnDemandResponses = {}

  let apiFile = path.resolve(process.cwd(), process.env.API)

  chokidar
    .watch(apiFile, {usePolling: true})
    .on('all', (event, path) => {
      if (event !== 'add' && event !== 'change') {
        return
      }

      if (process.env.VERBOSE === 'true' && event === 'change') {
        console.log(chalk.bold.cyan('Puppy WS: Changes detected, reloading API file'))
      }

      delete require.cache[require.resolve(path)]

      try {
        apiDefaultResponses = require(apiFile)
      } catch (err) {
        // to avoid printing this before printing the usual console.logs()
        setTimeout(() => {
          console.error(err)
          console.log(chalk.bold.red(`Error in ${process.env.API} file`))
        }, 200)
      }
    })

  apiApp.use(cors())
  apiApp.use(bodyParser.json())

  internalApp.post('/flush', (req, res) => {
    apiOnDemandResponses = {}
    res.send('ok')
  })

  internalApp.post('/register', (req, res) => {
    const {data, headers, status, path, method} = req.body

    if (process.env.VERBOSE === 'true') {
      console.debug(log(`Puppy register METHOD %s URL %s`), method || 'DEFAULT', path)
    }

    apiOnDemandResponses[path] = apiOnDemandResponses[path] || {}

    apiOnDemandResponses[path][method || 'DEFAULT'] = {
      body: data || 'OK',
      status: status || 200,
      headers: headers || {}
    }

    res.send('ok')
  })

  apiApp.all('*', (req, res) => {
    if (req.url === '') {
      return
    }

    const data = apiOnDemandResponses[req.url] && (apiOnDemandResponses[req.url][req.method] || apiOnDemandResponses[req.url]['DEFAULT'])
      || apiDefaultResponses[req.url] && (apiDefaultResponses[req.url][req.method] || apiDefaultResponses[req.url]['DEFAULT'])

    if (!data) {
      const message = `Puppy API: method: ${req.method} url: ${req.url} is not supported, please update your API definition`

      res.status(404)
      res.end(message)
      if (process.env.VERBOSE === 'true') {
        console.warn(error(message))
      }
      return
    }

    if (process.env.VERBOSE === 'true') {
      console.log(`Puppy API: method: ${req.method} url: ${req.url}`)
    }

    if (apiOnDemandResponses[req.url]) {
      delete apiOnDemandResponses[req.url][req.method]
      delete apiOnDemandResponses[req.url]['DEFAULT']
    }

    const body = JSON.stringify(data.body) || 'EMPTY BODY'
    const status = data.status || 200
    const headers = data.headers || {}

    Object.keys(headers).forEach(key => res.setHeader(key, headers[key]))

    res.status(status)

    res.end(body)
  })
}

module.exports = initialize
