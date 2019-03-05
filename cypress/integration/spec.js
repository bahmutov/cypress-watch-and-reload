// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
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

context('Example Cypress TodoMVC test', () => {
  beforeEach(() => {
    // usually we recommend setting baseUrl in cypress.json
    // but for simplicity of this example we just use it here
    // https://on.cypress.io/visit
    cy.visit('index.html')
  })

  it('has header', function () {
    cy.contains('h2', 'simple HTML page')
  })

  // more examples
  //
  // https://github.com/cypress-io/cypress-example-todomvc
  // https://github.com/cypress-io/cypress-example-kitchensink
  // https://on.cypress.io/writing-your-first-test
})
