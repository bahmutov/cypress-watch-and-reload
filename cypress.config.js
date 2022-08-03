const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 300,
  viewportWidth: 400,
  e2e: {
    env: {
      // it only makes sense to watch the application files
      // in the end-to-end tests, not component tests
      // so our settings are in the "e2e.env" object
      'cypress-watch-and-reload': {
        watch: ['page/*', 'circle.yml'],
      },
    },
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./plugins.js')(on, config)
    },
  },
})
