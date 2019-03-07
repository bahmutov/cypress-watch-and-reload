/// <reference types="Cypress" />

const ws = new WebSocket('ws://localhost:8765')

const isReloadMessage = data =>
  data.command === 'reload' && Cypress._.isString(data.filename)
const isLogMessage = data =>
  data.command === 'log' && Cypress._.isString(data.message)

beforeEach(() => {
  expect(ws.readyState).to.equal(WebSocket.OPEN)
  ws.onmessage = ev => {
    console.log('message from OS')
    console.log(ev)
    if (ev.type === 'message' && Cypress._.isString(ev.data)) {
      try {
        const data = JSON.parse(ev.data)
        if (isReloadMessage(data)) {
          console.log(
            'reloading Cypress because "%s" has changed',
            data.filename
          )
          window.top.document.querySelector('.reporter .restart').click()
        } else if (isLogMessage(data)) {
          console.log(data.message)
          const log = Cypress.log({
            name: 'message',
            message: data.message,
            consoleProps () {
              return {
                message: data.message
              }
            }
          })
          log.end()
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
