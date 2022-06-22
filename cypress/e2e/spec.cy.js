// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Example Cypress TodoMVC test', () => {
  beforeEach(() => {
    // usually we recommend setting baseUrl in cypress.json
    // but for simplicity of this example we just use it here
    // https://on.cypress.io/visit
    cy.on('window:alert', cy.stub().as('alert'))
    cy.visit('page/index.html')
  })

  it('has header', function () {
    cy.contains('h2', 'simple HTML page')
    cy.get('@alert').should('be.calledWithExactly', 'bar')
  })
})
