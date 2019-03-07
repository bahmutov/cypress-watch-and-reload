/// <reference types="Cypress" />

import xs from 'xstream'

const ws = new WebSocket('ws://localhost:8765')

const isReloadMessage = data =>
  data.command === 'reload' && Cypress._.isString(data.filename)
const isStdoutMessage = data =>
  data.command === 'stdout' && Cypress._.isString(data.message)
const isStderrMessage = data =>
  data.command === 'stderr' && Cypress._.isString(data.message)
const isLogMessage = data =>
  data.command === 'log' && Cypress._.isString(data.message)

beforeEach(() => {
  expect(ws.readyState).to.equal(WebSocket.OPEN)

  const producer = {
    start (listener) {
      console.log('starting producer')
      ws.onmessage = ev => listener.next(ev)
    },
    stop () {
      console.log('closing web socket')
      ws.close()
    }
  }
  const message$ = xs
    .create(producer)
    .filter(ev => ev.type === 'message' && Cypress._.isString(ev.data))
    .map(ev => ev.data)
    .map(JSON.parse)

  const reload$ = message$.filter(isReloadMessage)
  const stdout$ = message$.filter(isStdoutMessage)
  const stderr$ = message$.filter(isStderrMessage)

  reload$.addListener({
    next (data) {
      console.log('reloading Cypress because "%s" has changed', data.filename)
      window.top.document.querySelector('.reporter .restart').click()
    }
    // todo: handle errors and completed event
  })

  stdout$.addListener({
    next (data) {
      console.log(data.message)
      const log = Cypress.log({
        name: 'STDOUT',
        message: data.message,
        consoleProps () {
          return {
            message: data.message
          }
        }
      })
      log.end()
    },
    error (e) {
      console.error(e)
    },
    complete () {
      console.log('log messages completed')
    }
  })

  stderr$.addListener({
    next (data) {
      console.error(data.message)
      const log = Cypress.log({
        name: 'STDERR',
        message: data.message,
        consoleProps () {
          return {
            message: data.message
          }
        }
      })
      log.end()
    },
    error (e) {
      console.error(e)
    },
    complete () {
      console.log('log messages completed')
    }
  })
})
