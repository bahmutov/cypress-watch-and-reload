/// <reference types="Cypress" />

const ws = new WebSocket('ws://localhost:8765')

beforeEach(() => {
  expect(ws.readyState).to.equal(WebSocket.OPEN)
  ws.onmessage = ev => {
    console.log('message from OS')
    console.log(ev)
    if (ev.type === 'message' && ev.data === 'reload') {
      console.log('reloading Cypress')
      window.top.location.reload()
    }
  }
})
