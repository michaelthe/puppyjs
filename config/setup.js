const os = require('os')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const puppeteer = require('puppeteer')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = async function () {
  const width = 1920
  const height = 1080

  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS === 'true',
    args: [`--window-size=${width},${height}`],
    devtools: process.env.HEADLESS !== 'true'
  })

  global.__BROWSER__ = browser

  mkdirp.sync(DIR)

  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
