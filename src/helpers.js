const fs = require('fs')
const path = require('path')
const http = require('http')

const puppyConfig = require('../puppy.config.js')

const configFile = path.resolve(process.cwd(), 'puppy.config.js')

if (fs.existsSync(configFile)) {
  Object.assign(puppyConfig, require(configFile))
}

const emit = async (path, data, options = {}) => {
  return new Promise((resolve, reject) => {
    const payload = {
      'path': path,
      'method': options.method || 'POST',
      'params': options.params || {},
      'query': options.query || {},
      'body': data
    }

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

const register = async (data) => {
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

module.exports = {emit, register}
