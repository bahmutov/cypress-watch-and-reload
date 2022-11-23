/// <reference types="Cypress" />

if (Cypress.config('isInteractive')) {
  const insertToggleButton = require('./ui/toggle-btn')
  const waitUntil = require('async-wait-until')
  const ws = new WebSocket('ws://localhost:8765')

  let watchAndReloadEnabled = true
  const button = insertToggleButton()
  button.onclick = () => {
    button.classList.toggle('reload-enabled')
    watchAndReloadEnabled = !watchAndReloadEnabled
  }

  beforeEach(() => {
    if (!Cypress.env('cypressWatchAndReloadPluginInitialized')) {
      throw new Error(
        'Did you forget to initialize the cypress-watch-and-reload plugin ' +
          'from your plugins file? See https://github.com/bahmutov/cypress-watch-and-reload#use',
      )
    }
    cy.wrap(
      waitUntil(() => ws.readyState === WebSocket.OPEN, 2000, 50),
      { log: false },
    ).then(() => {
      ws.onmessage = (ev) => {
        console.log('message from OS')
        console.log(ev)
        if (ev.type === 'message' && ev.data) {
          try {
            const data = JSON.parse(ev.data)
            if (data.command === 'reload' && data.filename) {
              if (watchAndReloadEnabled) {
                console.log(
                  'reloading Cypress because "%s" has changed',
                  data.filename,
                )
                // if the button is unavailable, that means
                // the tests are probably already running
                // so let's reload the top window and they will restart again
                const restartBtn =
                  window.top.document.querySelector('.reporter .restart')
                restartBtn ? restartBtn.click() : window.top.location.reload()
              }
            }
          } catch (e) {
            console.error('Could not parse message from plugin')
            console.error(e.message)
            console.error('original text')
            console.error(ev.data)
          }
        }
      }
    })
  })
}
