/// <reference types="Cypress" />

const ws = new WebSocket('ws://localhost:8765')

beforeEach(() => {
  assert(ws.readyState === WebSocket.OPEN, 'Watch & Reload is ready')

  ws.onmessage = ev => {
    console.log('message from OS')
    console.log(ev)
    if (ev.type === 'message' && ev.data) {
      try {
        const data = JSON.parse(ev.data)
        if (data.command === 'reload' && data.filename) {
          console.log(
            'reloading Cypress because "%s" has changed',
            data.filename
          )
          window.top.document.querySelector('.reporter .restart').click()
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
