const fs = require('fs')
const path = require('path')

const help = fs.readFileSync(path.resolve(__dirname, 'help.text'), 'utf8')
const version = require('../../package').version

module.exports = () => help.replace('{version}', version)
