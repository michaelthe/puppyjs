const fs = require('fs')
const os = require('os')
const path = require('path')
const helpers = require('../src/helpers.js')
const puppeteer = require('puppeteer')
const NodeEnvironment = require('jest-environment-node')
const URL = require('url').URL

const puppyConfig = require('../puppy.config.js')

const configFile = path.resolve(process.cwd(), 'puppy.config.js')

if (fs.existsSync(configFile)) {
  Object.assign(puppyConfig, require(configFile))
}

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

class PuppeteerEnvironment extends NodeEnvironment {
  async setup () {
    await super.setup()

    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')

    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found')
    }

    const browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint
    })

    const newPage = async (url = '') => {
      const page = await browser.newPage()

      await page.setViewport({width: 1300, height: 1080})

      let isURL
      try {
        isURL = !!(new URL(url))
      } catch (e) {
        isURL = false
      }

      const constructedURL = isURL ? url : (`http://127.0.0.1:${puppyConfig.PORT}/${url}`)

      await page.goto(constructedURL)

      return page
    }

    this.global.puppy = {browser, newPage, emit: helpers.emit, register: helpers.register}
  }
}

module.exports = PuppeteerEnvironment
