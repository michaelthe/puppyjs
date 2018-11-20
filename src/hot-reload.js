'use strict'

const fs = require('fs')
const url = require('url')
const path = require('path')
const send = require('send')
const chokidar = require('chokidar')
const expressuws = require('express-ws')
const eventStream = require('event-stream')

const charcoal = require('./libs/charcoal')
const clientLoader = require('./libs/hot-reload-client-loader.js')

async function isDir (basepath, filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(basepath + filePath, (err, stats) => {
      if (err && err.code === 'ENOENT') {
        return resolve(false)
      }

      if (err) {
        return reject(err)
      }

      if (stats.isDirectory()) {
        return resolve(true)
      }

      return resolve(false)
    })
  })
}

async function isFile (basepath, filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(basepath + filePath, (err, stats) => {
      if (err && err.code === 'ENOENT') {
        return resolve(false)
      }

      if (err) {
        return reject(err)
      }

      if (stats.isFile()) {
        return resolve(true)
      }

      return resolve(false)
    })
  })
}

async function injectCodeHandler (req, res, next) {
  let pathname = url.parse(req.url).pathname
  let extension = path.extname(pathname)

  if (process.env.INDEX_FILE && extension === '') {
    pathname = `/${process.env.INDEX_FILE}`
  }

  const dir = await isDir(process.env.STATIC_DIR, pathname)
  const file = await isFile(process.env.STATIC_DIR, pathname)
  const exists = dir || file

  if (!exists && !process.env.INDEX_FILE) {
    return next()
  }

  let injectableTag = null

  send(req, pathname, { root: process.env.STATIC_DIR })
    .on('error', err => {
      res.statusCode = err.status || 500
      res.end(err.message)
    })
    .on('directory', () => {
      res.statusCode = 301
      res.setHeader('Location', req.url + '/')
      res.end('Redirecting to ' + req.url + '/')
    })
    .on('file', filepath => {
      const fileExtension = path.extname(filepath).toLocaleLowerCase()
      const possibleExtensions = ['', '.html', '.htm', '.xhtml', '.php', '.svg']

      if (!possibleExtensions.includes(fileExtension)) {
        return
      }

      let match
      const candidates = [/<\/body>/i, /<\/svg>/i, /<\/head>/i]
      const fileContent = fs.readFileSync(filepath, 'utf8')

      for (let i = 0; i < candidates.length; ++i) {
        match = candidates[i].exec(fileContent)

        if (match) {
          injectableTag = match.shift()
          break
        }
      }
    })
    .on('stream', stream => {
      if (!injectableTag) {
        return
      }

      const INJECTED_CODE = clientLoader('/hot-reload', process.env.INTERNAL_PORT)
      const len = INJECTED_CODE.length + res.getHeader('Content-Length')
      res.setHeader('Content-Length', len)

      const originalPipe = stream.pipe
      stream.pipe = resp => originalPipe.call(stream, eventStream.replace(new RegExp(injectableTag, 'i'), INJECTED_CODE + injectableTag)).pipe(resp)
    })
    .pipe(res)
}

function initialize (hotReloadApp, internalApp) {
  const expressUms = expressuws(internalApp)
  const wss = expressUms.getWss()

  internalApp.ws('/hot-reload', () => {
    charcoal.log('hot', 'Client connected')
  })

  chokidar
    .watch(process.env.STATIC_DIR)
    .on('all', (event, changePath) => {
      if (!['add', 'change', 'unlink'].includes(event)) {
        return
      }

      wss.clients.forEach(client => client.send(path.extname(changePath) === '.css' ? 'stylesReload' : 'fullReload'))
    })

  hotReloadApp.use(injectCodeHandler)
}

module.exports = initialize
