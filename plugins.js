const WebSocket = require('ws')
const { join } = require('path')

// https://github.com/websockets/ws#simple-server
// create socket even if not watching files to avoid
// tripping up client trying to connect
const wss = new WebSocket.Server({ port: 8765 })
let client // future Cypress client

// watch files using chokidar
const chokidar = require('chokidar')
const cypressJson = require(join(process.cwd(), 'cypress.json'))
const options = cypressJson['cypress-watch-and-reload']
if (options && typeof options.watch === 'string') {
  console.log('will watch "%s"', options.watch)

  wss.on('connection', function connection (ws) {
    console.log('new socket connection 🎉')
    client = ws

    console.log('starting to watch file index.html')
    // TODO clear previous watcher
    chokidar.watch(options.watch).on('change', (path, event) => {
      console.log('file %s has changed', path)
      if (client) {
        const text = JSON.stringify({
          command: 'reload',
          filename: path
        })
        client.send(text)
      }
    })

    setTimeout(() => {
      client.send(
        JSON.stringify({
          command: 'log',
          message: 'hello there'
        })
      )
    }, 1000)
  })
} else {
  console.log(
    'nothing to watch. Use cypress.json to set "cypress-watch-and-reload" object'
  )
  console.log('see https://github.com/bahmutov/cypress-watch-and-reload#use')
}
