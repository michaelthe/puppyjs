const os = require('os')
const path = require('path')
const rimraf = require('rimraf')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = async function () {
  await global.__BROWSER__.close()

  const wsBackup = path.resolve(process.cwd(), '.puppy', path.basename(process.env.WS))
  const apiBackup = path.resolve(process.cwd(), '.puppy', path.basename(process.env.API))

  rimraf.sync(DIR)
  rimraf.sync(wsBackup)
  rimraf.sync(apiBackup)
}
