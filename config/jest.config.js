const path = require('path')

module.exports = {
  globalSetup: path.resolve(__dirname, 'setup.js'),
  globalTeardown: path.resolve(__dirname, 'teardown.js'),
  testEnvironment: path.resolve(__dirname, 'puppeteer_environment.js'),
  moduleDirectories: ['node_modules', 'bower_components'],
  testMatch:  [`**/*.${process.env.EXT_PREFIX}.js`]
}
