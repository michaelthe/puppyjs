const fs = require('fs')
const path = require('path')

const client = fs.readFileSync(path.resolve(__dirname, 'hot-reload-client.js'), 'utf8')

module.exports = socketPath => `<script type="text/javascript">${client}</script>`.replace('SOCKET_ADDRESS', socketPath)
