const fs = require('fs')
const path = require('path')

function updateWS (exports) {
  const wsBackup = path.resolve(process.cwd(), '.puppy', path.basename(process.env.WS))

  _writeFile(process.env.WS, wsBackup, exports)
}

function updateAPI (exports) {
  const apiBackup = path.resolve(process.cwd(), '.puppy', path.basename(process.env.API))

  _writeFile(process.env.API, apiBackup, exports)
}

function resetFiles () {
  const wsBackup = path.resolve(process.cwd(), '.puppy', path.basename(process.env.WS))
  const apiBackup = path.resolve(process.cwd(), '.puppy', path.basename(process.env.API))

  if (fs.existsSync(wsBackup)) {
    fs.copyFileSync(wsBackup, process.env.WS)
  }

  if (fs.existsSync(apiBackup)) {
    fs.copyFileSync(apiBackup, process.env.API)
  }
}

function _writeFile (file, backupFile, exports) {
  if (!fs.existsSync(backupFile)) {
    fs.copyFileSync(file, backupFile)
  }

  fs.writeFileSync(file, `module.exports = ${JSON.stringify(exports)}`)
}

module.exports = {updateWS, updateAPI, resetFiles}
