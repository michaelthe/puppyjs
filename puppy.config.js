const path = require('path')

module.exports = {
  PORT: 9090,
  WS_PORT: null,
  API_PORT: null,
  PUPPY_PORT: 7877,

  HEADLESS: true,

  WS_URL: '/socket',

  STATIC_DIR: path.resolve(process.cwd(), 'dist'),
  STATIC_INDEX: 'index.html'
}
