const path = require('path')

module.exports = {
  ws: path.resolve(process.cwd(), 'puppy.ws.js'),
  api: path.resolve(process.cwd(), 'puppy.api.js'),

  port: 8080,
  wsPort: 8080,
  apiPort: 8080,

  verbose: false,
  headless: false,

  wsUrl: '/ws',
  indexFile: 'index.html',
  staticDir: path.resolve(process.cwd(), 'dist'),

  devtools: true,
  windowWidth: 1920,
  windowHeight: 1080,
  viewportWidth: 1300,
  viewportHeight: 1080
}
