module.exports = (on, config) => {
  require('../../plugins')(config)
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  return config
}
