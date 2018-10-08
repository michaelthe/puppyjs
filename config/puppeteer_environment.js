const fs = require('fs')
const os = require('os')
const path = require('path')
const helpers = require('../src/libs/helpers.js')
const puppeteer = require('puppeteer')
const NodeEnvironment = require('jest-environment-node')

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

    this.global.puppy = {
      browser: browser,
      emit: helpers.emit,
      flush: helpers.flush,
      register: helpers.register,
      newPage: helpers.newPage.bind(browser)
    }
  }
}

module.exports = PuppeteerEnvironment
