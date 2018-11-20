const fs = require('fs')
const path = require('path')

const client = fs.readFileSync(path.resolve(__dirname, 'hot-reload-client.js'), 'utf8')

module.exports = function (path, port) {
  const script = `<script type="text/javascript">${client}</script>`
  return script.replace('PATH', path).replace('PORT', port)
}
