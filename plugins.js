const WebSocket = require('ws')

// https://github.com/websockets/ws#simple-server
const wss = new WebSocket.Server({ port: 8765 })
let client // future Cypress client

// watch files using chokidar
const chokidar = require('chokidar')
const cypressJson = require('./cypress.json')
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
  })
}
