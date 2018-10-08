const fs = require('fs')
const path = require('path')

const logo = fs.readFileSync(path.resolve(__dirname, 'logo.text'), 'utf8')
const logoHeadless = fs.readFileSync(path.resolve(__dirname, 'logo-headless.text'), 'utf8')

module.exports = headless => headless ? logoHeadless : logo
