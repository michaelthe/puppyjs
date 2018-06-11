const URL = require('url').URL
const http = require('http')

const puppyConfig = require('./config')

async function emit (path, payload, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      var dataString = JSON.stringify(payload)
    } catch (error) {
      reject(error)
    }

    let requestData = {
      host: '127.0.0.1',
      port: puppyConfig.PUPPY_PORT,
      path: '/emit',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    }

    let response = ''
    let post = http
      .request(requestData, resStream => {
        resStream.setEncoding('utf8')
        resStream.on('error', error => reject(error))

        resStream.on('data', chunk => {
          response += chunk
        })

        resStream.on('end', () => resolve(response))
      })

    post.on('error', error => reject(error))

    post.write(dataString)
    post.end()
  })
}

async function register (data) {
  return new Promise((resolve, reject) => {
    try {
      var dataString = JSON.stringify(data)
    } catch (error) {
      reject(error)
    }

    let options = {
      host: '127.0.0.1',
      port: puppyConfig.PUPPY_PORT,
      path: '/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    }

    let response = ''
    let post = http
      .request(options, resStream => {
        resStream.setEncoding('utf8')
        resStream.on('error', error => reject(error))

        resStream.on('data', chunk => {
          response += chunk
        })

        resStream.on('end', () => resolve(response))
      })

    post.on('error', error => reject(error))

    post.write(dataString)
    post.end()
  })
}

async function newPage (url = '') {
  const page = await this.newPage()

  await page.setViewport({width: 1300, height: 1080})

  let isURL
  try {
    isURL = !!(new URL(url))
  } catch (e) {
    isURL = false
  }

  const path = url || puppyConfig.STATIC_INDEX
  const constructedURL = isURL ? url : (`http://127.0.0.1:${puppyConfig.PORT}/${path.replace(/^\//, '')}`)

  await page.goto(constructedURL)

  return page
}

module.exports = {emit, register, newPage}
