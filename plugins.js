const WebSocket = require('ws')
const chokidar = require('chokidar')

module.exports = (config) => {
  // https://github.com/websockets/ws#simple-server
  // create socket even if not watching files to avoid
  // tripping up client trying to connect
  const wss = new WebSocket.Server({ port: 8765 })
  let client // future Cypress client

  const options = config['cypress-watch-and-reload']
  let watchPathOrPaths = options && options.watch

  // utils to check type of options.watch
  const isWatchPathString = typeof watchPathOrPaths === 'string'
  const isWatchPathArray =
    Array.isArray(watchPathOrPaths) && watchPathOrPaths.length
  const isWatchPathStringOrArray = isWatchPathString || isWatchPathArray

  if (isWatchPathStringOrArray) {
    if (isWatchPathArray) {
      watchPathOrPaths = options.watch.map((path) => `"${path}"`).join(', ')
    } else {
      watchPathOrPaths = `"${watchPathOrPaths}"`
    }

    console.log(
      'cypress-watch-and-reload: maybe will watch %s',
      watchPathOrPaths,
    )

    let watcher = null
    wss.on('connection', function connection(ws) {
      console.log('cypress-watch-and-reload: new socket connection 🎉')
      client = ws

      console.log('cypress-watch-and-reload: starting to watch files')

      if (watcher) {
        watcher.close()
      }

      watcher = chokidar.watch(options.watch).on('change', (path, event) => {
        console.log('cypress-watch-and-reload: file %s has changed', path)
        if (client) {
          const text = JSON.stringify({
            command: 'reload',
            filename: path,
          })
          client.send(text)
        }
      })
    })
  } else {
    console.log(
      'Nothing to watch. Set the "cypress-watch-and-reload" object in the Cypress configuration',
    )
    console.log('see https://github.com/bahmutov/cypress-watch-and-reload#use')
  }

  // set an internal variable to let the browser-side code know
  config.env.cypressWatchAndReloadPluginInitialized = true
  return config
}
