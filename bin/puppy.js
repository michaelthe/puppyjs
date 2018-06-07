#! /usr/bin/env node

const path = require('path')
const spawn = require('child_process').spawn
const chalk = require('chalk')
const figlet = require('figlet')

function getPuppy () {
  return process.env.HEADLESS === 'true'
    ? `
                       \\
         >--,-'\`-'*_*'\`\`---.
         |\\_* _*'-'         '
        /    \`               \\
        \\.         _ .       /
         '\`._     /   )     /
          \\  |\`-,-|  /c-'7 /
           ) \\ (_,| |   / (_
          ((_/   ((_;)  \\_)))`

    : `          ,_____ ,
         ,._ ,_. 7\\
        j \`-'     /
        |o_, o    \\
       .\`_y_\`-,'   !
       |/   \`, \`._ \`-,
       |_     \\   _.'*\\
         >--,-'\`-'*_*'\`\`---.
         |\\_* _*'-'         '
        /    \`               \\
        \\.         _ .       /
         '\`._     /   )     /
          \\  |\`-,-|  /c-'7 /
           ) \\ (_,| |   / (_
          ((_/   ((_;)  \\_)))`
}

;(async () => {
  console.log(chalk.cyan(getPuppy()))
  figlet('puppy.js', (_, data) => console.log(chalk.red(data)))

  const config = path.resolve(__dirname, '..', 'config/jest.config.js')
  const serverFile = path.resolve(__dirname, '..', 'src/server.js')

  const server = spawn(`node`, ['--inspect', serverFile], {pwd: process.cwd(), stdio: 'inherit'})
  const jest = spawn('jest', ['-i', '-c', config, '--rootDir', process.cwd(), ...process.argv.slice(2)], {stdio: 'inherit'})

  process.on('SIGHUP', () => server.kill('SIGHUP'))
  process.on('SIGTERM', () => server.kill('SIGHUP'))

  jest
    .on('close', code => {
      server.kill('SIGHUP')
      process.exit(code)
    })
})()
