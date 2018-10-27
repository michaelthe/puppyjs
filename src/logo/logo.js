const fs = require('fs')
const path = require('path')

const logo = fs.readFileSync(path.resolve(__dirname, 'logo.txt'), 'utf8')
const logoHeadless = fs.readFileSync(path.resolve(__dirname, 'logo-headless.txt'), 'utf8')

module.exports = headless => headless ? logoHeadless : logo
