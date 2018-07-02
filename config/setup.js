const os = require('os')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const puppeteer = require('puppeteer')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = async function () {
  const width = process.env.WINDOW_WIDTH
  const height = process.env.WINDOW_HEIGHT

  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS === 'true',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--window-size=${width},${height}`,
    ],
    devtools: process.env.HEADLESS !== 'true' && process.env.DEVTOOLS === 'true'
  })

  global.__BROWSER__ = browser

  mkdirp.sync(DIR)

  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
