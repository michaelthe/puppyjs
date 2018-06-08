const fs = require('fs')
const path = require('path')

const puppyConfig = require('../puppy.config.js')

const configFile = path.resolve(process.cwd(), 'puppy.config.js')

if (fs.existsSync(configFile)) {
  Object.assign(puppyConfig, require(configFile))
}

module.exports = puppyConfig
