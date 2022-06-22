const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 300,
  viewportWidth: 400,
  'cypress-watch-and-reload': {
    watch: ['page/*', 'circle.yml'],
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./plugins.js')(on, config)
    },
  },
})
