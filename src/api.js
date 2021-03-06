'use strict'
const path = require('path')
const chokidar = require('chokidar')
const charcoal = require('./libs/charcoal')

let apiDefaultResponses = {}
let apiOnDemandResponses = {}

function initialize (apiApp, internalApp) {
  let apiFile = path.resolve(process.cwd(), process.env.API)

  chokidar
    .watch(apiFile, { usePolling: true })
    .on('all', (event, path) => {
      if (event !== 'add' && event !== 'change') {
        return
      }

      charcoal.log('api', `Changes detected, reloading ${process.env.API} file`)

      delete require.cache[require.resolve(path)]

      let newResponses
      try {
        newResponses = require(path)

        for (const path of Object.keys(newResponses)) {
          for (const method of Object.keys(newResponses[path])) {
            let response = newResponses[path][method]
            delete newResponses[path][method]
            newResponses[path][method.toUpperCase()] = response
          }
        }

        apiDefaultResponses = newResponses
        charcoal.log('api', `Loaded on demand responses from ${process.env.API}`)
      } catch (e) {
        charcoal.error('api', `Failed to load on demand responses from ${process.env.API}`)
        charcoal.error(e)
      }
    })

  internalApp.post('/flush', (req, res) => {
    apiOnDemandResponses = {}
    res.send('ok')
  })

  internalApp.post('/register', (req, res) => {
    let { body, headers, status, path, method } = req.body

    method = (method || 'DEFAULT').toUpperCase()

    charcoal.log('api', `Register METHOD ${method} URL ${path}`)

    apiOnDemandResponses[path] = apiOnDemandResponses[path] || {}

    apiOnDemandResponses[path][method] = {
      body: body || 'OK',
      status: status || 200,
      headers: headers || {}
    }

    res.send('ok')
  })

  apiApp.all('*', async (req, res, next) => {
    if (req.url === '') {
      return
    }

    const data = (apiOnDemandResponses[req.url] && (apiOnDemandResponses[req.url][req.method] || apiOnDemandResponses[req.url]['DEFAULT'])) ||
      (apiDefaultResponses[req.url] && (apiDefaultResponses[req.url][req.method] || apiDefaultResponses[req.url]['DEFAULT']))

    if (!data) {
      const message = `Method: ${req.method} url: ${req.url} is not supported, please update your API definition`

      charcoal.error('api', message)

      return next()
    }

    charcoal.log('api', `Method: ${req.method} url: ${req.url}`)

    if (apiOnDemandResponses[req.url]) {
      delete apiOnDemandResponses[req.url][req.method]
      delete apiOnDemandResponses[req.url]['DEFAULT']
    }

    let body = data.body
    if (typeof body === 'function') {
      try {
        body = await body(req)
      } catch (err) {
        const message = `Puppy API: method: ${req.method} url: ${req.url} body function failed to execute`

        charcoal.log('api', message)
        charcoal.error('api', err)

        res.status(500)
        res.end(message)
        return
      }
    }

    body = JSON.stringify(body)

    const status = data.status || 200
    const headers = data.headers || {}

    Object.keys(headers).forEach(key => res.setHeader(key, headers[key]))

    res.status(status)

    res.end(body)
  })
}

module.exports = initialize
