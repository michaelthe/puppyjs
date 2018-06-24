const path = require('path')

module.exports = {
  'ws': path.resolve(process.cwd(), 'puppy.ws.js'),
  'api': path.resolve(process.cwd(), 'puppy.api.js'),

  'port': 8080,
  'ws-port': 8080,
  'api-port': 8080,

  'verbose': false,
  'headless': false,

  'ws-url': '/ws',
  'index-file': 'index.html',
  'static-dir': path.resolve(process.cwd(), 'dist'),
}
