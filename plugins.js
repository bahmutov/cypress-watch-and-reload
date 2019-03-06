const WebSocket = require('ws')

// https://github.com/websockets/ws#simple-server
const wss = new WebSocket.Server({ port: 8765 })
let client // future Cypress client

// watch files using chokidar
const chokidar = require('chokidar')

wss.on('connection', function connection (ws) {
  console.log('new socket connection 🎉')
  client = ws

  console.log('starting to watch file index.html')
  // TODO clear previous watcher
  chokidar.watch('index.html').on('change', (path, event) => {
    console.log('file %s has changed', path)
    if (client) {
      client.send('reload')
    }
  })

  client.on('message', function incoming (message) {
    console.log('received: %s', message)
  })

  // to send message to Cypress client
  // use client.send(...)
})