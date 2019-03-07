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

    client.onclose = () => {
      console.log('client closing connection ✋')
    }
    client.onerror = e => {
      console.error('WS client error', e)
    }

    const stdoutWrite = process.stdout.write.bind(process.stdout)
    process.stdout.write = what => {
      if (typeof what === 'string') {
        console.error('wrote stdout')
        client.send(
          JSON.stringify({
            command: 'stdout',
            message: what
          })
        )
      }
      stdoutWrite.call(null, what)
    }
    // const stderrWrite = process.stderr.write.bind(process.stderr)
    // process.stderr.write = what => {
    //   if (typeof what === 'string') {
    //     client.send(
    //       JSON.stringify({
    //         command: 'stderr',
    //         message: what
    //       })
    //     )
    //   }
    //   stderrWrite.call(null, what)
    // }

    setTimeout(() => {
      console.log('first line is %d', 101)
      console.error('but there was an error %s', '😡')
    }, 1000)
  })
} else {
  console.log(
    'nothing to watch. Use cypress.json to set "cypress-watch-and-reload" object'
  )
  console.log('see https://github.com/bahmutov/cypress-watch-and-reload#use')
}
